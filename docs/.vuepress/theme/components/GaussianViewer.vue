<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { withBase } from 'vuepress/client'
import { examples, modelBase, type Example } from '../gaussian/examples'
import type { GaussianRenderer } from '../gaussian/renderer'
import '../gaussian/viewer.css'

const props = defineProps<{ compact?: boolean }>()
const canvasId = useId()
const stage = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const selected = ref<Example>(examples[0])
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
let drag: { id: number, x: number, y: number } | undefined

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

async function showModel(name: string, extension: string, getBuffer: (signal: AbortSignal) => Promise<ArrayBuffer>) {
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
    const count = await device.load(buffer, extension, signal)
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
  })
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

function pointerDown(event: PointerEvent) {
  if (!ready.value || drag || event.button !== 0) return
  const target = event.currentTarget as HTMLCanvasElement
  target.focus({ preventScroll: true })
  target.setPointerCapture(event.pointerId)
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY }
}

function pointerMove(event: PointerEvent) {
  if (drag?.id !== event.pointerId) return
  renderer?.orbit(event.clientX - drag.x, event.clientY - drag.y)
  drag.x = event.clientX
  drag.y = event.clientY
}

function stopDrag(event: PointerEvent) {
  if (drag?.id === event.pointerId) drag = undefined
}

function wheel(event: WheelEvent) {
  if (!ready.value || document.activeElement !== canvas.value) return
  event.preventDefault()
  renderer?.zoom(event.deltaY * (event.deltaMode ? 16 : 1))
}

function key(event: KeyboardEvent) {
  if (!ready.value) return
  switch (event.key) {
    case 'ArrowLeft': renderer?.orbit(-12, 0); break
    case 'ArrowRight': renderer?.orbit(12, 0); break
    case 'ArrowUp': renderer?.orbit(0, -12); break
    case 'ArrowDown': renderer?.orbit(0, 12); break
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
        aria-label="3D Gaussian model. Drag or use arrow keys to rotate. Use plus and minus to zoom."
        @pointerdown="pointerDown" @pointermove="pointerMove" @lostpointercapture="stopDrag"
        @pointercancel="stopDrag" @wheel="wheel" @keydown="key"
      />
      <img v-if="!ready" class="gaussian-poster" :src="poster" alt="" width="250" height="250" decoding="async" />
      <span v-if="backend" class="gaussian-backend">{{ backend }}</span>
      <span v-if="ready" class="gaussian-hint">Drag to rotate</span>
    </div>
    <div class="gaussian-toolbar">
      <label class="gaussian-model">
        <span>3D Gaussian splatting</span>
        <select aria-label="Example model" :value="selected.id" @change="showExample(examples.find(item => item.id === ($event.target as HTMLSelectElement).value)!)">
          <option v-for="example in examples" :key="example.id" :value="example.id">{{ example.label }}</option>
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
