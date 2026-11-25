<script setup lang="ts">
import { withBase } from 'vuepress/client'
import GaussianViewer from './GaussianViewer.vue'
import RenderComparison from './RenderComparison.vue'
import RenderGallery from './RenderGallery.vue'
import SurgicalComparison from './SurgicalComparison.vue'
import { pages } from '../data/navigation'

const research = [
  { title: 'Realistic volume rendering', href: pages.rendering, image: '/images/Research_Field/hyper_realistic_rendering/Image-01.png', description: 'Material, illumination and structure in CT and other volume data.' },
  { title: 'Medical image analysis', href: pages.analysis, image: '/images/Research_Field/Image_Analysis/Image_Analysis_01.png', description: 'Segmentation and visualization workflows for medical imaging.' },
  { title: '3D Gaussian splatting', href: '#gaussian-viewer', image: '/images/Crystal_introduction/Crystal_introduction_05.png', description: 'Explore the interactive Gaussian splatting viewer in your browser.' },
]
</script>

<template>
  <div class="crystal-site crystal-shell">
    <section class="crystal-hero" aria-labelledby="crystal-home-title">
      <div class="crystal-hero-copy">
        <h1 id="crystal-home-title">See beneath the surface.</h1>
        <p class="crystal-lede">Crystal brings medical images into 3D. Explore anatomy through volume rendering, segmentation and Gaussian splatting.</p>
        <div class="crystal-actions">
          <a class="crystal-button primary" href="#rendering-comparison">Compare renderings <span aria-hidden="true">↓</span></a>
          <a class="crystal-button secondary" :href="withBase(pages.about)">About Crystal</a>
        </div>
      </div>
      <GaussianViewer id="gaussian-viewer" compact />
    </section>

    <RenderGallery />

    <SurgicalComparison />

    <RenderComparison />

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
