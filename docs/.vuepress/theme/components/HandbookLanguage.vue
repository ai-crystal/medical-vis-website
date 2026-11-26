<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
    if (marker.getBoundingClientRect().top > top) break
    peer = marker.dataset.handbookPeer
  }
  section.value = peer ? '#' + peer : ''
}

onMounted(locateSection)
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
