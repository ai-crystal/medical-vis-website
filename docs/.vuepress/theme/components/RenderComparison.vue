<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { withBase } from 'vuepress/client'
import { pages } from '../data/navigation'

const imageRoot = '/images/Research_Field/volume-surface_hybrid_rendering'
const scenes = [
  {
    name: 'Cornell box',
    shaded: 'Image-01.png',
    structure: 'Image-02.png',
    caption: 'The same head volume in a Cornell box. The wireframe shows how the volume sits inside the surrounding geometry.',
  },
  {
    name: 'Outdoor scene',
    shaded: 'Image-03.png',
    structure: 'Image-04.png',
    caption: 'The outdoor scene combines surface models with a volume. The wireframe shows the extent of the volume.',
  },
] as const

const scene = shallowRef<(typeof scenes)[number]>(scenes[0])
const split = ref(58)
const clip = computed(() => 'inset(0 0 0 ' + split.value + '%)')
</script>

<template>
  <section id="rendering-comparison" class="render-comparison" aria-labelledby="render-comparison-title">
    <div class="render-copy">
      <h2 id="render-comparison-title">One scene, two ways to see it</h2>
      <p>Slide between the finished image and its structural view. Both are rendered in Crystal.</p>
      <div class="render-scenes" role="group" aria-label="Comparison scene">
        <button v-for="option in scenes" :key="option.name" type="button"
          :aria-pressed="scene === option" @click="scene = option">{{ option.name }}</button>
      </div>
      <p id="render-description" class="render-description" aria-live="polite">{{ scene.caption }}</p>
      <a class="crystal-text-link" :href="withBase(pages.rendering)">Explore volume rendering <span aria-hidden="true">↗</span></a>
    </div>

    <figure class="render-figure">
      <div class="render-stage" role="img" :aria-label="scene.name + ': shaded rendering and structural view'">
        <img :src="withBase(imageRoot + '/' + scene.shaded)" alt="" loading="lazy" decoding="async" />
        <img :src="withBase(imageRoot + '/' + scene.structure)" alt="" loading="lazy" decoding="async"
          class="render-overlay" :style="{ clipPath: clip }" />
        <span class="render-divider" :style="{ left: split + '%' }" aria-hidden="true"></span>
      </div>
      <figcaption class="render-slider">
        <span aria-hidden="true">Shaded view</span>
        <input v-model.number="split" type="range" min="0" max="100"
          aria-label="Rendering comparison split" aria-describedby="render-description"
          :aria-valuetext="split + '% shaded view and ' + (100 - split) + '% structural view'" />
        <span aria-hidden="true">Structural view</span>
      </figcaption>
    </figure>
  </section>
</template>

<style scoped>
.render-comparison {
  display: grid;
  grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
  align-items: center;
  gap: clamp(24px, 5vw, 74px);
  padding: clamp(20px, 5vw, 56px);
  scroll-margin-top: 84px;
  color: #f1f7ff;
  background: radial-gradient(ellipse at 20% 2%, #234c8b 0, transparent 70%), linear-gradient(115deg, #132e5a, #09182e);
  border-radius: 18px;
}
.render-copy { display: grid; gap: 15px; justify-items: start; }
.render-copy h2 { color: #f1f7ff; font-size: clamp(1.85rem, 4vw, 3.35rem); line-height: 1.08; }
.render-copy p { color: #c6d8ef; line-height: 1.62; }
.render-copy .render-description { font-size: .9rem; }
.render-copy .crystal-text-link { color: #b8dbff; }
.render-scenes { display: flex; flex-wrap: wrap; gap: 8px; }
.render-scenes button {
  padding: 7px 13px;
  min-height: 42px;
  background: #183359;
  border: 1px solid #648ab9;
  border-radius: 7px;
  color: #e6f2ff;
  cursor: pointer;
  font: inherit;
  font-size: .9rem;
  font-weight: 650;
}
.render-scenes button:hover { background: #254775; }
.render-scenes button[aria-pressed="true"] { color: #10294f; background: #def0ff; border-color: #def0ff; }
.render-comparison :is(button, input):focus-visible { outline-color: #acd6ff; }
.render-figure { width: min(100%, 530px); justify-self: center; }
.render-stage {
  position: relative;
  isolation: isolate;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #10223a;
  border: 1px solid #5b7ba5;
  border-radius: 12px;
}
.render-stage img { width: 100%; height: 100%; object-fit: cover; display: block; }
.render-stage .render-overlay { position: absolute; inset: 0; }
.render-divider { position: absolute; inset-block: 0; width: 2px; background: #e2f4ff; box-shadow: 0 0 8px #071c36; transform: translateX(-50%); }
.render-slider {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
  color: #d8eaff;
  font-size: .79rem;
}
.render-slider input { width: 100%; min-width: 0; margin: 0; height: 34px; accent-color: #a5d5ff; cursor: ew-resize; }
@media (max-width: 760px) {
  .render-comparison { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 370px) {
  .render-slider { gap: 6px; font-size: .72rem; }
}
</style>
