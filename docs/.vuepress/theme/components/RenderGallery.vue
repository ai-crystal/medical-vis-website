<script setup lang="ts">
import { reactive } from 'vue'
import { withBase } from 'vuepress/client'
import { pages } from '../data/navigation'

const specimenSheet = { image: '/images/Research_Field/Realistic_Rendering_03.png', width: 1458, height: 1331 }
const materialSheet = { image: '/images/Research_Field/Realistic_Rendering_01.png', width: 1565, height: 390 }

type Sheet = typeof specimenSheet

// The rectangle uses the original sheet's pixel coordinates, excluding its dividers.
function frame(sheet: Sheet, alt: string, [left, top, right, bottom]: [number, number, number, number]) {
  const width = right - left
  const height = bottom - top
  return {
    alt,
    image: sheet.image,
    ratio: width / height,
    crop: {
      left: -100 * left / width + '%',
      top: -100 * top / height + '%',
      width: 100 * sheet.width / width + '%',
      height: 100 * sheet.height / height + '%',
    },
  }
}

const collections = [
  {
    id: 'specimens',
    title: 'Specimen renderings',
    sets: [
      {
        label: 'Skeleton',
        frames: [frame(specimenSheet, 'Curled skeletal specimen with the skull and rib cage exposed', [4, 422, 783, 906])],
      },
      {
        label: 'Horned beetles',
        frames: [
          frame(specimenSheet, 'Horned beetle from below', [3, 3, 431, 416]),
          frame(specimenSheet, 'Horned beetle from the side', [443, 3, 1026, 416]),
        ],
      },
      {
        label: 'Beetle views',
        frames: [
          frame(specimenSheet, 'Black beetle viewed from above', [789, 422, 1189, 906]),
          frame(specimenSheet, 'Black beetle viewed from below', [1198, 422, 1455, 906]),
        ],
      },
      {
        label: 'Birds',
        frames: [
          frame(specimenSheet, 'Side view of a bird specimen with translucent tissue', [3, 915, 842, 1327]),
          frame(specimenSheet, 'Bird specimen with the head turned down and the wing folded', [859, 915, 1455, 1326]),
        ],
      },
    ],
  },
  {
    id: 'materials',
    title: 'Materials and structure',
    sets: [
      {
        label: 'Surface detail',
        frames: [
          frame(materialSheet, 'Skull with a pale stone-like surface', [5, 2, 391, 388]),
          frame(materialSheet, 'The same skull with a mossy surface texture', [396, 2, 782, 388]),
        ],
      },
      {
        label: 'Shape and texture',
        frames: [
          frame(materialSheet, 'Smooth rounded form with a recessed opening', [798, 2, 1176, 388]),
          frame(materialSheet, 'Rounded form with an irregular textured surface', [1182, 2, 1560, 388]),
        ],
      },
      {
        label: 'Internal structure',
        frames: [frame(specimenSheet, 'Translucent rectangular enclosure showing the structure inside', [1036, 3, 1455, 416])],
      },
    ],
  },
] as const

const materialStudies = [
  { image: 'marbled-surface.png', label: 'Marbled surface', alt: 'Pale rounded form with dark veins and a soft highlight.' },
  { image: 'golden-cylinder.png', label: 'Golden cylinder', alt: 'Warm golden cylinder with fine vertical ridges and a glossy rim.' },
  { image: 'amber-like-inclusion.png', label: 'Amber-like inclusion', alt: 'Insect silhouette visible through a glossy amber-colored form.' },
  { image: 'glossy-green-rabbit.png', label: 'Glossy green rabbit', alt: 'Green rabbit with bright highlights following its curved surface.' },
]

const active = reactive({ specimens: 0, materials: 0 })
</script>

<template>
  <section id="rendering-gallery" class="crystal-section render-gallery" aria-labelledby="render-gallery-title">
    <header class="crystal-section-head gallery-head">
      <h2 id="render-gallery-title">Rendering gallery</h2>
      <a class="crystal-text-link" :href="withBase(pages.rendering)">More rendering examples <span aria-hidden="true">↗</span></a>
    </header>
    <div class="gallery-grid">
      <article v-for="collection in collections" :key="collection.id" class="gallery-card">
        <h3 :id="'gallery-' + collection.id">{{ collection.title }}</h3>
        <div class="gallery-options" role="group" :aria-labelledby="'gallery-' + collection.id">
          <button
            v-for="(set, index) in collection.sets"
            :key="set.label"
            type="button"
            :aria-pressed="active[collection.id] === index"
            @click="active[collection.id] = index"
          >{{ set.label }}</button>
        </div>
        <div
          class="gallery-frames"
          :class="{ 'paired-frames': collection.sets[active[collection.id]].frames.length > 1 }"
          aria-live="polite"
        >
          <div
            v-for="photo in collection.sets[active[collection.id]].frames"
            :key="photo.alt"
            class="gallery-mat"
          >
            <div class="gallery-crop" :style="{ '--crop-ratio': photo.ratio }">
              <img :src="withBase(photo.image)" :alt="photo.alt" :style="photo.crop" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </article>
    </div>

    <section id="material-studies" class="material-studies" aria-labelledby="material-studies-title">
      <header class="gallery-head material-studies-head">
        <h3 id="material-studies-title">Material studies</h3>
        <a class="crystal-text-link" :href="withBase(pages.transferFunctionHandbook)">Transfer function handbook <span aria-hidden="true">→</span></a>
      </header>
      <div class="material-study-grid">
        <figure v-for="study in materialStudies" :key="study.image">
          <img
            :src="withBase('/images/Material_Studies/' + study.image)"
            :alt="study.alt" width="1024" height="1024" loading="lazy" decoding="async"
          />
          <figcaption>{{ study.label }}</figcaption>
        </figure>
      </div>
    </section>
  </section>
</template>

<style scoped>
.render-gallery { scroll-margin-top: 84px; }
.gallery-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 20px; }
.gallery-grid { display: grid; grid-template-columns: minmax(0, 1.18fr) minmax(0, 1fr); gap: 16px; }
.gallery-card {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 12px;
  min-width: 0;
  padding: clamp(12px, 2.4vw, 23px);
  border: 1px solid var(--cr-line);
  border-radius: 16px;
  background: var(--cr-surface-fill);
}
.gallery-card h3 { font-size: clamp(1.18rem, 2.5vw, 1.5rem); }
.gallery-options { display: flex; flex-wrap: wrap; gap: 6px; align-content: start; }
.gallery-options button {
  min-height: 38px;
  padding: 5px 10px;
  border: 1px solid var(--cr-line);
  border-radius: 6px;
  background: var(--cr-card);
  color: var(--cr-ink);
  font: inherit;
  font-size: .8rem;
  line-height: 1.2;
  cursor: pointer;
}
.gallery-options button:hover { border-color: var(--cr-accent); }
.gallery-options button[aria-pressed="true"] { color: var(--cr-action-text); background: var(--cr-action-fill); border-color: transparent; }
.gallery-frames {
  --gallery-height: clamp(172px, 22vw, 292px);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 5px;
  min-height: var(--gallery-height);
  border-radius: 10px;
  overflow: hidden;
  background: #142941;
}
.paired-frames { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gallery-mat { display: grid; place-items: center; min-width: 0; background: #142941; }
.gallery-crop { position: relative; width: min(100%, calc(var(--crop-ratio) * var(--gallery-height))); aspect-ratio: var(--crop-ratio); overflow: hidden; }
.gallery-crop img { position: absolute; display: block; max-width: none; max-height: none; }
.material-studies { margin-top: clamp(24px, 4vw, 36px); scroll-margin-top: 84px; }
.material-studies-head { margin-bottom: 14px; }
.material-studies h3 { font-size: clamp(1.3rem, 2.8vw, 1.7rem); }
.material-study-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(9px, 2vw, 16px); }
.material-study-grid figure { overflow: hidden; border: 1px solid var(--cr-line); border-radius: 12px; background: var(--cr-surface-fill); }
.material-study-grid img { display: block; width: 100%; height: auto; aspect-ratio: 1; }
.material-study-grid figcaption { padding: 9px 10px; color: var(--cr-ink); font-size: .86rem; font-weight: 650; }
@media (max-width: 760px) {
  .material-study-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery-grid { grid-template-columns: minmax(0, 1fr); }
  .gallery-frames { --gallery-height: clamp(172px, 54vw, 320px); }
}
</style>
