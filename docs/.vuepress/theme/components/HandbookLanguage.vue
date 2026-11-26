<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vuepress/client'

const props = defineProps<{ language: 'en' | 'zh' }>()
const bar = ref<HTMLElement>()
const section = ref('')
const english = computed(() => props.language === 'en')
const otherPage = computed(() => withBase('/medical-vis/Development_Manual/Transfer_Function_Handbook'
  + (english.value ? '_ZH.html' : '.html')) + section.value)

function locateSection() {
  const top = (bar.value?.getBoundingClientRect().bottom ?? 0) + 20
  let peer: string | undefined
  for (const marker of document.querySelectorAll<HTMLElement>('[data-handbook-peer]')) {
    const heading = marker.closest('h2, h3, h4') ?? marker
    if (heading.getBoundingClientRect().top > top) break
    peer = marker.dataset.handbookPeer
  }
  section.value = peer ? '#' + peer : ''
}

// The theme and its fonts can finish laying out the preceding chapters after
// the browser's first fragment scroll. Correct a direct entry once.
let entryNavigation: AbortController | undefined
function settleEntryAnchor() {
  const hash = window.location.hash
  let id: string
  try { id = decodeURIComponent(hash.slice(1)) } catch { return }
  const heading = document.getElementById(id)?.closest('h2, h3, h4')
  if (!heading?.querySelector('.handbook-anchor')) return

  const controller = new AbortController()
  entryNavigation = controller
  const { signal } = controller
  const cancel = () => controller.abort()
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange']) {
    window.addEventListener(event, cancel, { once: true, passive: true, signal })
  }
  async function align() {
    await document.fonts.ready
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (signal.aborted || !heading?.isConnected) return
      const top = heading.getBoundingClientRect().top
      // Plume's outline tracks the heading box at the navigation boundary.
      // Its text starts below the language control via heading padding.
      const margin = (bar.value?.getBoundingClientRect().top ?? 64) + 2
      if (Math.abs(top - margin) > 1) {
        window.scrollBy({ top: top - margin, behavior: 'instant' })
      }
      locateSection()
      cancel()
    }))
  }
  if (document.readyState === 'complete') void align()
  else window.addEventListener('load', align, { once: true, signal })
}

onMounted(() => {
  locateSection()
  settleEntryAnchor()
})
onBeforeUnmount(() => entryNavigation?.abort())
</script>

<template>
  <nav ref="bar" class="handbook-language" :aria-label="english ? 'Handbook language' : '手册语言'">
    <span v-if="english" lang="en" aria-current="page">English</span>
    <a v-else :href="otherPage" lang="en" hreflang="en" @pointerenter="locateSection" @focus="locateSection" @pointerdown="locateSection" @click="locateSection">English</a>
    <span aria-hidden="true">/</span>
    <a v-if="english" :href="otherPage" lang="zh-CN" hreflang="zh-CN" @pointerenter="locateSection" @focus="locateSection" @pointerdown="locateSection" @click="locateSection">简体中文</a>
    <span v-else lang="zh-CN" aria-current="page">简体中文</span>
  </nav>
</template>

<style scoped>
.handbook-language {
  position: sticky;
  top: calc(var(--vp-nav-height, 64px) + 6px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: .65rem;
  width: fit-content;
  padding: .25rem .75rem;
  margin: 1rem 0;
  border: 1px solid var(--cr-line);
  border-radius: .5rem;
  background: var(--cr-card);
  font-size: .875rem;
}
.handbook-language [aria-current] { font-weight: 650; }
.handbook-language [aria-hidden] { color: var(--cr-muted); }
:global(.vp-doc :is(h2, h3, h4):has(.handbook-anchor)) {
  padding-block-start: 2.75rem;
  margin-block-start: 1rem;
}
:global(.handbook-anchor) { scroll-margin-top: calc(var(--vp-nav-height, 64px) + 62px); }
:global(.vp-doc ol.handbook-flow) {
  margin: 1.5rem 0;
  padding: .65rem 1rem .65rem 3rem;
  border-inline-start: 3px solid var(--cr-accent);
  background: var(--cr-surface);
  border-radius: .25rem;
}
:global(.handbook-flow li::marker) { color: var(--cr-accent); font-weight: 650; }
</style>
