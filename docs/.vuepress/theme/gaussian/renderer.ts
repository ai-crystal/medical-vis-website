import {
  AppBase, AppOptions, Asset, CameraComponentSystem, Color, createGraphicsDevice,
  DEVICETYPE_WEBGPU, Entity, GSplatComponentSystem, GSplatData, GSplatHandler, GSplatResource,
  GSPLAT_RENDERER_AUTO, GSPLAT_RENDERER_RASTER_GPU_SORT, Vec3,
} from 'playcanvas'
import type { GSplatResourceBase } from 'playcanvas'

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
  camera.addComponent('camera', { fov: fieldOfView, clearColor: new Color(0.036, 0.063, 0.074, 1) })
  app.root.addChild(camera)

  const model = new Entity('Gaussian model')
  model.addComponent('gsplat')
  model.enabled = false
  app.root.addChild(model)

  const origin = new Vec3()
  let yaw = 0
  let pitch = 0
  let radius = 1
  let distance = 3
  let aspect = 1
  let installed: { resource: GSplatResourceBase, release: () => void } | undefined

  function requestFrame() {
    app.renderNextFrame = true
  }

  function updateCamera() {
    const horizontal = Math.cos(pitch) * distance
    camera.setPosition(origin.x + Math.sin(yaw) * horizontal,
      origin.y - Math.sin(pitch) * distance, origin.z - Math.cos(yaw) * horizontal)
    // The source viewer faces +Z with +Y pointing down in the image.
    camera.lookAt(origin, Vec3.DOWN)
    camera.camera!.nearClip = Math.max(radius / 10_000, distance / 10_000)
    camera.camera!.farClip = distance + radius * 10
    requestFrame()
  }

  function reset() {
    yaw = 0
    pitch = 0
    const vertical = Math.tan(fieldOfView * Math.PI / 360)
    distance = radius * (1 + 0.86 / (vertical * Math.min(1, aspect)))
    updateCamera()
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

  async function load(buffer: ArrayBuffer, extension: string, loadSignal: AbortSignal) {
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
    origin.copy(bounds.center)
    radius = Number.isFinite(bounds.radius) && bounds.radius > 0 ? bounds.radius : 1
    reset()
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
  updateCamera()
  app.start()
  reportBackend()

  return {
    load, reset,
    orbit(dx: number, dy: number) {
      yaw += dx * 0.009
      pitch = Math.max(-1.53, Math.min(1.53, pitch + dy * 0.009))
      updateCamera()
    },
    zoom(delta: number) {
      distance = Math.max(radius * 0.15, Math.min(radius * 60, distance * Math.exp(delta * 0.0015)))
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
