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
      { text: 'Realistic Rendering', link: '/medical-vis/research_field/Realistic_Rendering.md' },  
      { text: 'Neural Rendering', link: '/medical-vis/research_field/Neural_Rendering.md' },  
      { text: 'Image Analysis', link: '/medical-vis/research_field/Image_Analysis.md' },  
      { text: 'Generative AI', link: '/medical-vis/research_field/Generative_AI.md' },  
      { text: 'Large Scale Data', link: '/medical-vis/research_field/Large_Scale_Data.md' },  
      { text: 'Mixed Reality', link: '/medical-vis/research_field/Mixed_Reality.md' },  
      { text: 'Games Engine', link: '/medical-vis/research_field/Games_Engine.md' },  
      { text: 'Data Analysis', link: '/medical-vis/research_field/Data_Analysis.md' },  
    ]  
  },  
  {  
    text: 'Development Manual',  
    items: [  
      { text: 'Development Manual', link: '/medical-vis/development_manual/README.md' },  
      { text: 'Software Operation', link: '/medical-vis/development_manual/Software_Operation.md' },  
      { text: 'Build Crystal Project', link: '/medical-vis/development_manual/Build_Crystal_Project.md' },  
      { text: 'Code Structure', link: '/medical-vis/development_manual/Code_Structure.md' },  
      { text: 'Datasets', link: '/medical-vis/development_manual/Datasets.md' },       
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