<script setup lang="ts">
const groups = [
  {
    id: 'medical-datasets',
    title: 'Medical volume datasets',
    links: [
      ['Open Scivis Datasets', 'https://klacansky.com/open-scivis-datasets/'],
      ['OpenOrganelle', 'https://openorganelle.janelia.org/datasets'],
      ['OsiriX DICOM Image Library', 'https://www.osirix-viewer.com/resources/dicom-image-library/'],
      ['EMDB', 'https://www.ebi.ac.uk/emdb/'],
      ['Medical Decathlon', 'http://medicaldecathlon.com/'],
      ['CBCTData', 'https://www.kaggle.com/datasets/imaginar2t/cbctdata?resource=download'],
      ['Stanford Volume Data', 'https://graphics.stanford.edu/data/voldata/voldata.html'],
      ['3D Slicer Sample Data', 'https://www.slicer.org/wiki/SampleData'],
      ['IDA', 'https://ida.loni.usc.edu/login.jsp'],
      ['Linhandev dataset list', 'https://github.com/linhandev/dataset'],
      ['ImageCAS', 'https://www.kaggle.com/datasets/xiaoweixumedicalai/imagecas/data?select=1-200.z04'],
      ['Voreen datasets', 'https://www.uni-muenster.de/Voreen/download/workspaces_and_data_sets.html'],
      ['TU Wien volume datasets', 'https://www.cg.tuwien.ac.at/research/vis/datasets/'],
      ['DigiMorph · Pseudotherium', 'https://digimorph.org/specimens/Pseudotherium_argentinus/'],
      ['DigiMorph · Publications', 'https://www.digimorph.org/publications.phtml/'],
      ['DigiMorph · Taxon index', 'https://digimorph.org/navcommon.phtml/'],
      ['UTCT · Biological and paleontological scans', 'http://www.ctlab.geo.utexas.edu/ct-applications/biological-and-paleontological-applications/'],
      ['UTCT · Texas Data Repository', 'https://dataverse-prod.tdl.org/'],
      ['MorphoSource · Project 000368762', 'https://www.morphosource.org/projects/000368762?locale=en/'],
      ['MorphoSource', 'https://www.morphosource.org/'],
      ['Dryad', 'https://datadryad.org/dataset/doi:10.6078/D1VH9M#methods/'],
      ['BugNIST', 'https://qim.dk/bugnist/'],
      ['Vera', 'https://zenodo.org/records/12784447'],
      ['ACDC', 'https://acdc.vision.ee.ethz.ch/download'],
      ['ACDC MRI4D', 'https://www.creatis.insa-lyon.fr/Challenge/acdc/databasesTraining.html'],
      ['Dataset with segmentations', 'https://zenodo.org/records/10047292'],
    ],
  },
  {
    id: 'hdr-environments',
    title: 'HDR panorama environment maps',
    links: [
      ['Laval Indoor HDR Dataset', 'https://paperswithcode.com/dataset/laval-indoor-hdr-dataset'],
      ['Free HDRI environments', 'https://www.hdri-hub.com/free-hdri-environments-for-download'],
      ['HDRI Hub', 'https://www.hdri-hub.com/'],
    ],
  },
  {
    id: 'mesh-datasets',
    title: 'Mesh datasets',
    links: [
      ['Georgia Tech large models', 'https://sites.cc.gatech.edu/projects/large_models/'],
      ['Stanford 3D Scanning Repository', 'https://graphics.stanford.edu/data/3Dscanrep/'],
      ['Casual Effects 3D models', 'https://casual-effects.com/data/'],
      ['PBRT example scenes', 'https://pbrt.org/scenes-v3'],
      ['Benedikt Bitterli’s rendering resources', 'https://benedikt-bitterli.me/resources/'],
      ['3DRender lighting challenges', 'https://www.3drender.com/challenges/'],
      ['Free3D', 'https://free3d.com/'],
    ],
  },
]
</script>

<template>
  <section id="public-resources" class="crystal-site crystal-section crystal-resource-guide" aria-labelledby="public-resource-title">
    <header class="crystal-section-head">
      <h2 id="public-resource-title">Public datasets and resources</h2>
      <p>Collected by Chunxiao Xu, PhD</p>
    </header>
    <div class="crystal-resource-groups">
      <section v-for="group in groups" :key="group.id" class="crystal-resource-group" :aria-labelledby="group.id">
        <h3 :id="group.id">{{ group.title }}</h3>
        <ul>
          <li v-for="[title, url] in group.links" :key="url">
            <a :href="url">{{ title }} <span aria-hidden="true">↗</span></a>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
