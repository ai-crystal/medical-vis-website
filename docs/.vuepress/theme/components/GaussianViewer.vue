<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { withBase } from 'vuepress/client'
import { defaultExample, exampleGroups, examples, modelBase, type Example } from '../gaussian/examples'
import type { OrbitPose } from '../gaussian/camera-controls'
import type { GaussianRenderer } from '../gaussian/renderer'
import '../gaussian/viewer.css'

const props = defineProps<{ compact?: boolean }>()
const canvasId = useId()
const stage = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const selected = ref<Example>(defaultExample)
const status = ref('Loading model…')
const backend = ref('')
const ready = ref(false)
const loading = ref(false)
const failed = ref(false)
const draggingFile = ref(false)
const poster = computed(() => withBase(modelBase + selected.value.id + '.jpg'))
const lifetime = new AbortController()
let visibility: IntersectionObserver | undefined
let pendingLoad: AbortController | undefined
let renderer: GaussianRenderer | undefined
let startup: Promise<GaussianRenderer> | undefined
let retry: (() => Promise<void>) | undefined
const pointers = new Map<number, { x: number, y: number, zoomOnly: boolean, touch: boolean }>()

function getRenderer() {
  if (!startup) {
    const target = canvas.value!
    startup = import('../gaussian/renderer').then(({ createGaussianRenderer }) => {
      lifetime.signal.throwIfAborted()
      return createGaussianRenderer(target, (value) => { backend.value = value }, lifetime.signal)
    }).then((device) => {
      renderer = device
      return device
    }).catch((error) => {
      startup = undefined
      throw error
    })
  }
  return startup
}

async function showModel(name: string, extension: string, getBuffer: (signal: AbortSignal) => Promise<ArrayBuffer>, initialPose?: OrbitPose) {
  pendingLoad?.abort()
  const controller = new AbortController()
  pendingLoad = controller
  const { signal } = controller
  loading.value = true
  failed.value = false
  status.value = 'Loading ' + name + '…'
  try {
    const [device, buffer] = await Promise.all([getRenderer(), getBuffer(signal)])
    signal.throwIfAborted()
    const count = await device.load(buffer, extension, signal, initialPose)
    signal.throwIfAborted()
    ready.value = true
    status.value = name + ' · ' + count.toLocaleString('en-US') + ' Gaussians'
  } catch (error) {
    if (signal.aborted) return
    controller.abort()
    failed.value = true
    const message = error instanceof AggregateError ? 'WebGPU or WebGL2 is required.'
      : error instanceof Error ? error.message : 'Could not open this model.'
    status.value = message
  } finally {
    if (pendingLoad === controller) loading.value = false
  }
}

function showExample(example: Example) {
  visibility?.disconnect()
  selected.value = example
  retry = () => showModel(example.label, 'splat', async (signal) => {
    const response = await fetch(withBase(modelBase + example.id + '.splat'), { signal })
    if (!response.ok) throw new Error('Could not download this example.')
    return response.arrayBuffer()
  }, example.initialPose)
  void retry()
}

function openFile(file?: File) {
  if (!file) return
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension !== 'ply' && extension !== 'splat') {
    retry = undefined
    status.value = 'Choose a Gaussian .splat or .ply file.'
    failed.value = true
    return
  }
  if (file.size > 128 * 1024 * 1024) {
    retry = undefined
    status.value = 'Choose a Gaussian model smaller than 128 MiB.'
    failed.value = true
    return
  }
  visibility?.disconnect()
  retry = () => showModel(file.name, extension, () => file.arrayBuffer())
  void retry()
}

function fileChanged(event: Event) {
  const input = event.target as HTMLInputElement
  openFile(input.files?.[0])
  input.value = ''
}

function drop(event: DragEvent) {
  draggingFile.value = false
  openFile(event.dataTransfer?.files[0])
}

function exampleChanged(event: Event) {
  const id = (event.target as HTMLSelectElement).value
  const example = examples.find(item => item.id === id)
  if (example) showExample(example)
}

function pointerDown(event: PointerEvent) {
  if (!ready.value || pointers.size === 2 || (event.button !== 0 && event.button !== 2)) return
  const touch = event.pointerType === 'touch'
  if (pointers.size && (!touch || !pointers.values().next().value?.touch)) return
  const target = event.currentTarget as HTMLCanvasElement
  target.focus({ preventScroll: true })
  target.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, {
    x: event.clientX, y: event.clientY, touch,
    zoomOnly: !touch && (event.button === 2 || event.ctrlKey || event.metaKey),
  })
}

function pointerMove(event: PointerEvent) {
  const point = pointers.get(event.pointerId)
  if (!point) return
  const { clientX, clientY } = event
  if (pointers.size === 2) {
    const [first, second] = pointers.values()
    const other = point === first ? second : first
    const before = Math.hypot(point.x - other.x, point.y - other.y)
    const after = Math.hypot(clientX - other.x, clientY - other.y)
    if (before > 0 && after > 0) renderer?.pinch(before / after)
  } else if (point.zoomOnly) {
    renderer?.zoom((clientX - point.x) * 25)
  } else {
    renderer?.orbit(clientX - point.x, clientY - point.y, point.touch)
  }
  point.x = clientX
  point.y = clientY
}

function stopDrag(event: PointerEvent) {
  pointers.delete(event.pointerId)
}

function wheel(event: WheelEvent) {
  if (!ready.value) return
  event.preventDefault()
  const scale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 10
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? canvas.value!.clientHeight : 1
  renderer?.zoom(event.deltaY * scale)
}

function key(event: KeyboardEvent) {
  if (!ready.value) return
  switch (event.key) {
    case 'ArrowLeft': renderer?.pan(-1, 0); break
    case 'ArrowRight': renderer?.pan(1, 0); break
    case 'ArrowUp': if (event.shiftKey) renderer?.pan(0, 1); else renderer?.zoom(-120); break
    case 'ArrowDown': if (event.shiftKey) renderer?.pan(0, -1); else renderer?.zoom(120); break
    case '+': case '=': renderer?.zoom(-120); break
    case '-': renderer?.zoom(120); break
    case 'Home': renderer?.reset(); break
    default: return
  }
  event.preventDefault()
}

onMounted(() => {
  if ('IntersectionObserver' in window) {
    visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) showExample(selected.value)
    }, { rootMargin: '80px' })
    visibility.observe(stage.value!)
  } else {
    showExample(selected.value)
  }
})

onBeforeUnmount(() => {
  visibility?.disconnect()
  pendingLoad?.abort()
  lifetime.abort()
  renderer?.destroy()
})
</script>

<template>
  <section class="gaussian-viewer" :class="{ 'gaussian-compact': props.compact }" aria-label="Interactive Gaussian splatting viewer">
    <div
      ref="stage" class="gaussian-stage" :class="{ 'gaussian-drop': draggingFile }"
      @dragover.prevent="draggingFile = true" @dragleave="draggingFile = false" @drop.prevent="drop"
    >
      <canvas
        :id="canvasId" ref="canvas" :class="{ 'gaussian-active': ready }" :tabindex="ready ? 0 : -1"
        aria-label="3D Gaussian model. Drag to rotate. Scroll or pinch to zoom. Left and right move sideways. Up and down move forward or backward."
        @pointerdown="pointerDown" @pointermove="pointerMove" @lostpointercapture="stopDrag"
        @pointerup="stopDrag" @pointercancel="stopDrag" @contextmenu.prevent @wheel="wheel" @keydown="key"
      />
      <img v-if="!ready" class="gaussian-poster" :src="poster" alt="" width="250" height="250" decoding="async" />
      <span v-if="backend" class="gaussian-backend">{{ backend }}</span>
      <span v-if="ready" class="gaussian-hint">Drag to rotate · Scroll or pinch to zoom</span>
    </div>
    <div class="gaussian-toolbar">
      <label class="gaussian-model">
        <span>3D Gaussian splatting</span>
        <select aria-label="Example model" :value="selected.id" @change="exampleChanged">
          <optgroup v-for="group in exampleGroups" :key="group.label" :label="group.label">
            <option v-for="example in group.models" :key="example.id" :value="example.id" :selected="example.id === selected.id">{{ example.label }}</option>
          </optgroup>
        </select>
      </label>
      <div class="gaussian-controls">
        <label class="gaussian-choose">
          Open model
          <input aria-label="Open Gaussian model" type="file" accept=".splat,.ply" @change="fileChanged" />
        </label>
        <button type="button" aria-label="Zoom out" :disabled="!ready" @click="renderer?.zoom(120)">−</button>
        <button type="button" aria-label="Zoom in" :disabled="!ready" @click="renderer?.zoom(-120)">+</button>
        <button type="button" :disabled="!ready" @click="renderer?.reset()">Reset</button>
      </div>
      <div class="gaussian-status">
        <span role="status" :class="{ 'gaussian-error': failed }">{{ status }}</span>
        <button v-if="failed && !loading && retry" type="button" @click="retry()">Retry</button>
      </div>
    </div>
  </section>
</template>
