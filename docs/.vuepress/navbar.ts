/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: 'Home', link: '/' },
  {
    text: 'Crystal Presentations',
    items: [
      { text: '3dgs-demo', link: '/medical-vis/Crystal_Presentations/3dgs_demo.md' },
    ]
  },
  {
    text: 'Research Field',
    items: [
      { text: 'Realistic Rendering', link: '/demo/README.md' },
      { text: 'Neural Rendering', link: '/demo/README.md' },
      { text: 'image Analysis', link: '/demo/README.md' },
      { text: 'Generative Al', link: '/demo/README.md' },
      { text: 'Large Scale Data', link: '/demo/README.md' },
      { text: 'Mixed Reality', link: '/demo/README.md' },
      { text: 'Games Engine', link: '/demo/README.md' },
      { text: 'Data Analysis', link: '/demo/README.md' },
    ]
  },
  {
    text: 'Development Manual',
    items: [
      { text: 'Development Manual', link: '/demo/README.md' },
      { text: 'Software Operation', link: '/demo/README.md' },
      { text: 'Build Crystal Project', link: '/demo/README.md' },
      { text: 'Code Structure', link: '/demo/README.md' },
      { text: 'Datasets', link: '/demo/README.md' },      
    ]
  },
  {
    text: 'Publications',
    items: [
      { text: 'PBDVR', link: '/medical-vis/Publications/PBDVR.md' },
      { text: 'RTR-DVR', link: '/medical-vis/Publications/RTR-DVR.md' },
      { text: 'NNFF', link: '/medical-vis/Publications/NNFF.md' },
      { text: 'SWKP', link: '/medical-vis/Publications/SWKP.md' },
      { text: 'SegR3D', link: '/medical-vis/Publications/SegR3D.md' },      
    ]
  },
  {
    text: 'Team Profile',
    items: [
      { text: 'Chunxiao Xu', link: 'https://chunxiao.dezeming.top/' },
      { text: 'Di Zhang', link: '/medical-vis/Team _Profile/Di_Zhang.md' }, 
    ]
  },
])