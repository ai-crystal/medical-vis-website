import {
  AppBase, AppOptions, Asset, CameraComponentSystem, Color, createGraphicsDevice,
  DEVICETYPE_WEBGPU, Entity, GSplatComponentSystem, GSplatData, GSplatHandler, GSplatResource,
  GSPLAT_RENDERER_AUTO, GSPLAT_RENDERER_RASTER_GPU_SORT, Vec3,
} from 'playcanvas'
import type { GSplatResourceBase } from 'playcanvas'
import { OrbitCamera, type OrbitPose } from './camera-controls'

const maxFileBytes = 128 * 1024 * 1024
const maxSplatCount = 2_000_000
const fieldOfView = 44

type SplatElement = ConstructorParameters<typeof GSplatData>[0][number]

function unpackSplat(buffer: ArrayBuffer, signal: AbortSignal): Promise<GSplatData> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./splat.worker.ts', import.meta.url), { type: 'module' })
    const finish = () => {
      worker.terminate()
      signal.removeEventListener('abort', cancel)
    }
    const cancel = () => {
      finish()
      reject(signal.reason)
    }
    signal.addEventListener('abort', cancel, { once: true })
    worker.onerror = () => {
      finish()
      reject(new Error('The .splat decoder failed to start.'))
    }
    worker.onmessage = ({ data }: MessageEvent<{ error?: string, element?: SplatElement }>) => {
      finish()
      if (!data.element) {
        reject(new Error(data.error ?? 'The .splat file could not be decoded.'))
        return
      }
      const splats = new GSplatData([data.element])
      splats.activated = true
      resolve(splats)
    }
    worker.postMessage(buffer, [buffer])
  })
}

function framing(resource: GSplatResourceBase) {
  const centers = resource.centers
  if (!centers?.length) return { center: resource.aabb.center.clone(), radius: resource.aabb.halfExtents.length() }
  // Trim isolated centers for the initial framing. The renderer still draws the entire model.
  const stride = 3 * Math.max(1, Math.ceil(centers.length / 3 / 8192))
  const axes = [[], [], []] as number[][]
  for (let i = 0; i < centers.length; i += stride) {
    if (![centers[i], centers[i + 1], centers[i + 2]].every(Number.isFinite)) continue
    for (let axis = 0; axis < 3; axis++) axes[axis].push(centers[i + axis])
  }
  if (!axes[0].length) return { center: Vec3.ZERO.clone(), radius: 1 }
  const ranges = axes.map(axis => {
    axis.sort((a, b) => a - b)
    const edge = Math.floor(axis.length * 0.005)
    return [axis[edge], axis[axis.length - 1 - edge]]
  })
  const midpoint = ranges.map(([low, high]) => (low + high) / 2)
  const halfWidths = ranges.map(([low, high]) => (high - low) / 2)
  return { center: new Vec3(midpoint[0], midpoint[1], midpoint[2]), radius: Math.hypot(...halfWidths) }
}

export async function createGaussianRenderer(
  canvas: HTMLCanvasElement,
  onBackend: (backend: string) => void,
  signal: AbortSignal,
) {
  const device = await createGraphicsDevice(canvas, {
    deviceTypes: [DEVICETYPE_WEBGPU], alpha: false, antialias: false, stencil: false,
    powerPreference: 'high-performance',
  })
  if (signal.aborted) {
    device.destroy()
    throw signal.reason
  }

  const options = new AppOptions()
  options.graphicsDevice = device
  options.componentSystems = [CameraComponentSystem, GSplatComponentSystem]
  options.resourceHandlers = [GSplatHandler]
  options.devtools = false
  const app = new AppBase(canvas)
  app.init(options)
  app.autoRender = false
  app.scene.gsplat.renderer = GSPLAT_RENDERER_AUTO
  const camera = new Entity('Model camera')
  camera.addComponent('camera', { fov: fieldOfView, clearColor: new Color(0.027, 0.051, 0.094, 1) })
  app.root.addChild(camera)

  const model = new Entity('Gaussian model')
  model.addComponent('gsplat')
  model.enabled = false
  app.root.addChild(model)

  const controls = new OrbitCamera()
  let aspect = 1
  let installed: { resource: GSplatResourceBase, release: () => void } | undefined

  function requestFrame() {
    app.renderNextFrame = true
  }

  function updateCamera() {
    camera.setPosition(controls.position)
    camera.setRotation(controls.rotation)
    camera.camera!.nearClip = Math.max(controls.radius / 10_000, controls.distance / 10_000)
    camera.camera!.farClip = controls.distance + controls.radius * 10
    requestFrame()
  }

  function resize() {
    const width = Math.max(1, canvas.clientWidth)
    const height = Math.max(1, canvas.clientHeight)
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1440 / Math.max(width, height))
    aspect = width / height
    device.setResolution(Math.round(width * ratio), Math.round(height * ratio))
    requestFrame()
  }

  function reportBackend() {
    onBackend(app.scene.gsplat.currentRenderer === GSPLAT_RENDERER_RASTER_GPU_SORT
      ? 'WebGPU · GPU sorting'
      : device.isWebGPU ? 'WebGPU · CPU sorting' : 'WebGL2 · CPU sorting')
  }

  async function loadPly(buffer: ArrayBuffer, loadSignal: AbortSignal) {
    const header = new TextDecoder().decode(buffer.slice(0, 65536)).split('end_header', 1)[0]
    const count = Number(/^element vertex (\d+)\r?$/m.exec(header)?.[1])
    if (!header.startsWith('ply') || !/^format binary_little_endian 1\.0\r?$/m.test(header)
        || !(count > 0 && count <= maxSplatCount)) {
      throw new Error('Choose a binary Gaussian PLY with up to two million splats.')
    }
    const url = URL.createObjectURL(new Blob([buffer]))
    const asset = new Asset('Gaussian PLY', 'gsplat', { url, filename: 'local-model.ply' }, { reorder: false })
    return new Promise<GSplatResourceBase>((resolve, reject) => {
      const cancel = () => reject(loadSignal.reason)
      loadSignal.addEventListener('abort', cancel, { once: true })
      // PlayCanvas reads the local blob. Discard a superseded parse when it finishes.
      app.loader.load(url, 'gsplat', (error, result: GSplatResourceBase) => {
        loadSignal.removeEventListener('abort', cancel)
        URL.revokeObjectURL(url)
        app.loader.clearCache(url, 'gsplat')
        if (loadSignal.aborted) result?.destroy()
        else if (error || !result) reject(new Error('Could not read this Gaussian PLY file.'))
        else resolve(result)
      }, asset)
    })
  }

  async function load(buffer: ArrayBuffer, extension: string, loadSignal: AbortSignal, initialPose?: OrbitPose) {
    loadSignal.throwIfAborted()
    if (!buffer.byteLength || buffer.byteLength > maxFileBytes) {
      throw new Error('Choose a Gaussian model smaller than 128 MiB.')
    }
    let resource: GSplatResourceBase
    if (extension === 'ply') {
      resource = await loadPly(buffer, loadSignal)
    } else {
      const data = await unpackSplat(buffer, loadSignal)
      loadSignal.throwIfAborted()
      resource = new GSplatResource(device, data)
    }
    const release = () => resource.destroy()
    if (loadSignal.aborted || !resource.numSplats || resource.numSplats > maxSplatCount) {
      release()
      loadSignal.throwIfAborted()
      throw new Error('Choose a Gaussian model with up to two million splats.')
    }
    const bounds = framing(resource)
    model.gsplat!.resource = resource
    model.enabled = true
    installed?.release()
    installed = { resource, release }
    const radius = Number.isFinite(bounds.radius) && bounds.radius > 0 ? bounds.radius : 1
    controls.frame(bounds.center, radius, aspect, fieldOfView, initialPose)
    updateCamera()
    return resource.numSplats
  }

  app.on('postrender', reportBackend)
  // A CPU sort completes asynchronously and needs one more draw when its indices arrive.
  app.scene.on('gsplat:sorted', requestFrame)
  device.on('devicelost', () => onBackend('Restoring graphics device…'))
  device.on('devicerestored', requestFrame)
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()
  controls.reset()
  updateCamera()
  app.start()
  reportBackend()

  return {
    load,
    reset() {
      controls.reset()
      updateCamera()
    },
    orbit(dx: number, dy: number, touch: boolean) {
      controls.orbit(dx / Math.max(1, canvas.clientWidth), dy / Math.max(1, canvas.clientHeight), touch)
      updateCamera()
    },
    pan(horizontal: number, vertical: number) {
      controls.pan(horizontal, vertical)
      updateCamera()
    },
    zoom(pixels: number) {
      controls.zoom(pixels)
      updateCamera()
    },
    pinch(ratio: number) {
      controls.pinch(ratio)
      updateCamera()
    },
    destroy() {
      observer.disconnect()
      model.destroy()
      installed?.release()
      app.destroy()
    },
  }
}

export type GaussianRenderer = Awaited<ReturnType<typeof createGaussianRenderer>>
