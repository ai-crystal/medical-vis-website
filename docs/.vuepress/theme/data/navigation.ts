const docs = '/medical-vis'

export const pages = {
  project: `${docs}/Crystal_Presentations/Crystal_introduction.html`,
  datasets: `${docs}/Development_Manual/Datasets.html`,
  team: `${docs}/Team_Profile/`,
  rendering: `${docs}/Research_Field/Realistic_Rendering.html`,
  analysis: `${docs}/Research_Field/Image_Analysis.html`,
  geometry: `${docs}/Research_Field/Geometry_Process.html`,
  source: 'https://github.com/ai-crystal/CrystalVis',
}

export const members = {
  Chunxiao_Xu: {
    en: 'Chunxiao Xu',
    degree: 'PhD',
    zh: '许春晓',
    doctorate: { en: 'PhD · USTC', zh: '中科大博士' },
    role: 'Founder & rendering research',
    roleZh: '项目发起与渲染算法',
    photo: '/images/Team_Profile/CHUNXIAO_XU/xuchunxiao.png',
  },
  Di_Zhang: {
    en: 'Di Zhang',
    degree: null,
    zh: '张磾',
    doctorate: null,
    role: 'Web development & infrastructure',
    roleZh: '网站开发与服务器运维',
    photo: '/images/Team_Profile/DI_ZHANG/di-zhang.jpg',
  },
  Jiatian_Zhang: {
    en: 'Jiatian Zhang',
    degree: 'PhD',
    zh: '张家天',
    doctorate: { en: 'PhD · USTC', zh: '中科大博士' },
    role: 'Medical image analysis',
    roleZh: '医学影像分析',
    photo: '/images/Team_Profile/JIATIAN_ZHANG/zhangjiatian.png',
  },
  Wei_Hu: {
    en: 'Wei Hu',
    degree: 'MD',
    zh: '胡薇',
    doctorate: { en: 'MD · Fudan University', zh: '复旦大学医学博士' },
    role: 'Clinical research & medical evaluation',
    roleZh: '临床研究与医学评估',
    photo: '/images/Team_Profile/WEI_HU/wei_hu.png',
  },
  Yiheng_Cao: {
    en: 'Yiheng Cao',
    degree: 'PhD',
    zh: '曹毅恒',
    doctorate: { en: 'PhD · University of Western Brittany', zh: '法国西布列塔尼大学博士' },
    role: 'Medical imaging & generative AI',
    roleZh: '医学影像与生成式 AI',
    photo: '/images/Team_Profile/YIHENG_CAO/yiheng-cao.jpg',
  },
}

export type MemberId = keyof typeof members
export type Language = 'en' | 'zh'

export function cvPath(member: MemberId, language: Language) {
  const suffix = language === 'en' ? '_English.html' : '.html'
  return `${pages.team}${member}${suffix}`
}
