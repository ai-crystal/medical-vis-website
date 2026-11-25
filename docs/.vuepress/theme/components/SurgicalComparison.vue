<script setup lang="ts">
import { withBase } from 'vuepress/client'

const views = [
  {
    label: 'Preoperative',
    image: '/images/Surgical_Comparison/preoperative.png',
    alt: 'Preoperative volume rendering showing bone and surrounding soft tissue.',
  },
  {
    label: 'Postoperative',
    image: '/images/Surgical_Comparison/postoperative.png',
    alt: 'Postoperative volume rendering showing bone and fixation hardware highlighted in cyan.',
  },
]
</script>

<template>
  <section id="surgical-comparison" class="crystal-section surgical-comparison" aria-labelledby="surgical-comparison-title">
    <header class="crystal-section-head">
      <h2 id="surgical-comparison-title">Before and after surgery</h2>
      <p>Volume renderings of bone and surrounding tissue, with fixation hardware highlighted in the postoperative view.</p>
    </header>
    <div class="surgical-views">
      <figure v-for="view in views" :key="view.label">
        <img :src="withBase(view.image)" :alt="view.alt" loading="lazy" decoding="async" />
        <figcaption>{{ view.label }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.surgical-comparison { scroll-margin-top: 84px; }
.surgical-comparison header p { color: var(--cr-muted); margin-top: 7px; max-width: 66ch; line-height: 1.55; }
.surgical-views { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.surgical-views figure { overflow: hidden; border: 1px solid var(--cr-line); border-radius: 12px; background: var(--cr-surface-fill); }
.surgical-views img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: contain; background: #bcbcbc; }
.surgical-views figcaption { padding: 10px 15px; color: var(--cr-ink); font-size: .89rem; font-weight: 680; }
@media (max-width: 680px) {
  .surgical-views { grid-template-columns: minmax(0, 1fr); }
}
</style>
