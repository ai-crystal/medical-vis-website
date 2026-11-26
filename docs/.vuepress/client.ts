import { defineClientConfig } from 'vuepress/client'
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
import HandbookLanguage from './theme/components/HandbookLanguage.vue'
import CrystalHome from './theme/components/CrystalHome.vue'
import CrystalAbout from './theme/components/CrystalAbout.vue'
import CrystalTeam from './theme/components/CrystalTeam.vue'
import DatasetCatalog from './theme/components/DatasetCatalog.vue'
import DatasetResources from './theme/components/DatasetResources.vue'
import ProfileHeader from './theme/components/ProfileHeader.vue'
import GaussianViewer from './theme/components/GaussianViewer.vue'
import './theme/styles/custom.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Swiper', Swiper)
    app.component('HandbookLanguage', HandbookLanguage)
    app.component('CrystalHome', CrystalHome)
    app.component('CrystalAbout', CrystalAbout)
    app.component('CrystalTeam', CrystalTeam)
    app.component('DatasetCatalog', DatasetCatalog)
    app.component('DatasetResources', DatasetResources)
    app.component('ProfileHeader', ProfileHeader)
    app.component('GaussianViewer', GaussianViewer)
  },
})
