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
      { text: 'Realistic Rendering', link: '/medical-vis/Research_Field/Realistic_Rendering.md' },  
      { text: 'Neural Rendering', link: '/medical-vis/Research_Field/Neural_Rendering.md' },  
      { text: 'Image Analysis', link: '/medical-vis/Research_Field/Image_Analysis.md' },  
      { text: 'Geometry_Process', link: '/medical-vis/Research_Field/Geometry_Process.md' },
    //  { text: 'Generative AI', link: '/medical-vis/Research_Field/Generative_AI.md' },    
    //  { text: 'Large Scale Data', link: '/medical-vis/Research_Field/Large_Scale_Data.md' },  
    //  { text: 'Mixed Reality', link: '/medical-vis/Research_Field/Mixed_Reality.md' },  
    //  { text: 'Games Engine', link: '/medical-vis/Research_Field/Games_Engine.md' },  
    //  { text: 'Data Analysis', link: '/medical-vis/Research_Field/Data_Analysis.md' },  
    ]  
  },  
  {  
    text: 'Development Manual',  
    items: [
      { text: 'Software Operation', link: '/medical-vis/Development_Manual/Software_Operation.md' },  
      { text: 'Build Crystal Project', link: '/medical-vis/Development_Manual/Build_Crystal_Project.md' },  
      { text: 'Code Structure', link: '/medical-vis/Development_Manual/Code_Structure.md' },  
      { text: 'Datasets', link: '/medical-vis/Development_Manual/Datasets.md' },       
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
      { text: 'MR-DVR', link: '/medical-vis/Publications/PBDVR.md' },
      { text: 'MR-Relighting', link: '/medical-vis/Publications/PBDVR.md' },
      { text: 'Illumin-Estim', link: '/medical-vis/Publications/PBDVR.md' },
      { text: 'ST-WSKP', link: '/medical-vis/Publications/PBDVR.md' },     
    ]  
  },
    {
    text: 'Technology Demo',
    items: [
      { text: '2D Image to 2.5D', link: '/medical-vis/Technology_Demo/2D-to-3D.md' },
      { text: 'Naked Eye 3D pipeline', link: '/medical-vis/Technology_Demo/NakeEye3D.md' }, 
    ]
  },
  {
    text: 'Team Profile',
    items: [
      { text: 'Chunxiao Xu', link: 'https://chunxiao.dezeming.top/' },
      { text: 'Di Zhang', link: '/medical-vis/Team_Profile/Di_Zhang.md' }, 
    ]
  },
])