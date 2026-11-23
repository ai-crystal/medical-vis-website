<script setup lang="ts">
import GaussianViewer from './GaussianViewer.vue'
import { withBase } from 'vuepress/client'
import { pages } from '../data/navigation'
import catalog from '../data/volume-catalog.json'

const research = [
  { title: 'Realistic volume rendering', href: pages.rendering, image: '/images/Research_Field/hyper_realistic_rendering/Image-01.png', description: 'Material, illumination and structure in CT and other volume data.' },
  { title: 'Medical image analysis', href: pages.analysis, image: '/images/Research_Field/Image_Analysis/Image_Analysis_01.png', description: 'Segmentation and visualization workflows for medical imaging.' },
  { title: '3D Gaussian splatting', href: '#gaussian-viewer', image: '/images/Crystal_introduction/Crystal_introduction_05.png', description: 'Explore the interactive Gaussian splatting viewer in your browser.' },
]
const collectionGB = (catalog.entries.reduce((sum, entry) => sum + entry.bytes, 0) / 1e9).toFixed(2)
</script>

<template>
  <div class="crystal-site crystal-shell">
    <section class="crystal-hero" aria-labelledby="crystal-home-title">
      <div class="crystal-hero-copy">
        <p class="crystal-kicker">Crystal</p>
        <h1 id="crystal-home-title">Medical 3D<br />visualization</h1>
        <p class="crystal-lede">Explore medical images and natural specimens with Crystal’s volume rendering, segmentation and 3D reconstruction tools.</p>
        <div class="crystal-actions">
          <a class="crystal-button primary" :href="withBase(pages.datasets)">Browse datasets <span aria-hidden="true">↗</span></a>
          <a class="crystal-button secondary" :href="withBase(pages.project)">Project overview</a>
        </div>
      </div>
      <GaussianViewer id="gaussian-viewer" compact />
    </section>

    <section class="crystal-library-strip" aria-labelledby="crystal-library-title">
      <div>
        <h2 id="crystal-library-title">Volume data library</h2>
        <p>Scans of insects, crustaceans, plants and other specimens, with provenance and voxel metadata.</p>
      </div>
      <dl class="crystal-stats">
        <div><dt>Volumes</dt><dd>{{ catalog.entries.length }}</dd></div>
        <div><dt>Compressed collection</dt><dd>{{ collectionGB }} <small>GB</small></dd></div>
      </dl>
      <a class="crystal-text-link" :href="withBase(pages.datasets)">Explore the catalog <span aria-hidden="true">↗</span></a>
    </section>

    <section class="crystal-section" aria-labelledby="crystal-work">
      <header class="crystal-section-head"><h2 id="crystal-work">Research and demos</h2></header>
      <div class="crystal-work-grid">
        <a v-for="item in research" :key="item.href" :href="item.href.startsWith('#') ? item.href : withBase(item.href)" class="crystal-work-card">
          <img :src="withBase(item.image)" alt="" loading="lazy" decoding="async" />
          <div><h3>{{ item.title }} <span aria-hidden="true">↗</span></h3><p>{{ item.description }}</p></div>
        </a>
      </div>
    </section>

    <footer class="crystal-footer">
      <span>Crystal · Medical Visualization</span>
      <a :href="withBase(pages.team)">Meet the team</a>
      <a :href="pages.source">Source code</a>
    </footer>
  </div>
</template>
