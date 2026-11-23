<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import catalog from '../data/volume-catalog.json'
import DatasetResources from './DatasetResources.vue'

const categories: Record<string, string> = {
  insects: 'Insects',
  crustaceans: 'Crustaceans',
  plants: 'Plants',
  animals: 'Other animals',
  fossils: 'Fossils',
  references: 'Reference scans',
}
const typeLabels: Record<string, string> = {
  uchar: '8-bit unsigned', char: '8-bit signed', ushort: '16-bit unsigned',
  short: '16-bit signed', uint: '32-bit unsigned', int: '32-bit signed',
  float: '32-bit float', double: '64-bit float',
}
const featuredNames = [
  'Pandalina_brevirostris_Sylon_1b_whole_CT.inforaw',
  'Harmonia_axyridis_PP5_sample01_whole_prepupa_CT.inforaw',
  'Nemadus_microtomographicus_CT.inforaw',
  'Electrohemiphlebia_barucheli_partial_fossil_grayscale_CT.inforaw',
]
const featured = featuredNames.flatMap(file => catalog.entries.filter(entry => entry.file === file))
const collectionGB = (catalog.entries.reduce((sum, entry) => sum + entry.bytes, 0) / 1e9).toFixed(2)
const query = ref('')
const category = ref('')
const page = ref(1)
const pageSize = 12

const matches = computed(() => {
  const words = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return catalog.entries.filter(entry => {
    const searchable = [entry.name, entry.file, entry.description, categories[entry.category]].join(' ').toLowerCase()
    return (!category.value || category.value === entry.category) && words.every(word => searchable.includes(word))
  })
})
const pages = computed(() => Math.max(1, Math.ceil(matches.value.length / pageSize)))
const visible = computed(() => matches.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch([query, category], () => { page.value = 1 })

function pitch(spacing: number[], unit: string) {
  if (unit !== 'mm') return 'Uncalibrated'
  const values = spacing.map(value => Number((value * 1000).toFixed(4)))
  return `${values.every(value => value === values[0]) ? values[0] : values.join(' × ')} µm`
}

function size(bytes: number) {
  return bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : `${(bytes / 1e6).toFixed(1)} MB`
}
</script>

<template>
  <div class="crystal-site crystal-shell crystal-inner crystal-catalog">
    <header class="crystal-page-intro">
      <p class="crystal-kicker">Crystal datasets</p>
      <h1>Volume data library</h1>
      <p class="crystal-lede">Browse the Crystal INFORAW collection by specimen, read the voxel metadata, and follow the source record for attribution and access.</p>
      <dl class="crystal-stats">
        <div><dt>Volumes</dt><dd>{{ catalog.entries.length }}</dd></div>
        <div><dt>Compressed collection</dt><dd>{{ collectionGB }} <small>GB</small></dd></div>
        <div><dt>Catalog snapshot</dt><dd class="crystal-stat-date"><time :datetime="catalog.snapshot">{{ catalog.snapshot }}</time></dd></div>
      </dl>
      <nav class="crystal-actions" aria-label="Dataset sections">
        <a href="#public-resources" class="crystal-button primary">Public datasets and resources</a>
        <a href="#all-volume-title" class="crystal-button secondary">Browse Crystal volumes</a>
      </nav>
    </header>

    <DatasetResources />

    <section class="crystal-section" aria-labelledby="featured-volume-title">
      <header class="crystal-section-head"><h2 id="featured-volume-title">Featured specimens</h2></header>
      <div class="crystal-specimens">
        <article v-for="entry in featured" :key="entry.file" class="crystal-specimen">
          <p class="crystal-category">{{ categories[entry.category] }}</p>
          <h3>{{ entry.name }}</h3>
          <p>{{ entry.description }}</p>
          <dl><dt>Grid</dt><dd>{{ entry.resolution.join(' × ') }}</dd><dt>Voxel spacing</dt><dd>{{ pitch(entry.spacing, entry.spacingUnit) }}</dd></dl>
          <a v-if="entry.source" :href="entry.source" class="crystal-text-link">Source record <span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>

    <section class="crystal-section" aria-labelledby="all-volume-title">
      <header class="crystal-section-head"><h2 id="all-volume-title">Browse all volumes</h2></header>
      <form class="crystal-filters" role="search" @submit.prevent>
        <label>Search specimens<input v-model="query" type="search" placeholder="Name, species or filename" /></label>
        <label>Category<select v-model="category"><option value="">All categories</option><option v-for="(label, key) in categories" :key="key" :value="key">{{ label }}</option></select></label>
      </form>
      <p class="crystal-result-count" role="status">{{ matches.length }} {{ matches.length === 1 ? 'volume' : 'volumes' }}</p>
      <div v-if="visible.length" class="crystal-table-wrap" tabindex="0" role="region" aria-label="Volume catalog">
        <table>
          <thead><tr><th scope="col">Specimen</th><th scope="col">Grid and type</th><th scope="col">Voxel spacing</th><th scope="col">INFORAW size</th><th scope="col">Provenance</th></tr></thead>
          <tbody>
            <tr v-for="entry in visible" :key="entry.file">
              <th scope="row"><strong>{{ entry.name }}</strong><small>{{ categories[entry.category] }}</small><details><summary>File and scope</summary><code>{{ entry.file }}</code><p v-if="entry.description">{{ entry.description }}</p></details></th>
              <td>{{ entry.resolution.join(' × ') }}<small>{{ typeLabels[entry.type] ?? entry.type }}</small></td>
              <td>{{ pitch(entry.spacing, entry.spacingUnit) }}</td>
              <td>{{ size(entry.bytes) }}</td>
              <td>
                <a v-if="entry.source" :href="entry.source" :aria-label="'Source for ' + entry.name">Source</a>
                <a v-if="entry.download && entry.download !== entry.source" :href="entry.download" :aria-label="'Original download for ' + entry.name">Original download</a>
                <small v-if="entry.license">{{ entry.license }}</small>
                <small v-else-if="!entry.source && !entry.download">See the file header</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="crystal-empty">
        <p>No volumes match these filters.</p>
        <button class="crystal-button secondary" type="button" @click="query = ''; category = ''">Clear filters</button>
      </div>
      <nav v-if="pages > 1" class="crystal-pagination" aria-label="Catalog pages">
        <button type="button" :disabled="page === 1" @click="page--">Previous</button>
        <span>Page {{ page }} of {{ pages }}</span>
        <button type="button" :disabled="page === pages" @click="page++">Next</button>
      </nav>
      <p class="crystal-data-note">INFORAW stores compressed voxel data with a readable metadata header. “Uncalibrated” means voxel units are recorded. The size shown is the Crystal file size. Original-download links open the publisher’s files or download page and are subject to the publisher’s access and reuse terms.</p>
    </section>
  </div>
</template>
