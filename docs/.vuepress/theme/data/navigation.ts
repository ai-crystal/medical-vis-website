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
    zh: '许春晓',
    role: 'Founder & rendering research',
    roleZh: '项目发起与渲染算法',
    photo: '/images/Team_Profile/CHUNXIAO_XU/xuchunxiao.png',
  },
  Di_Zhang: {
    en: 'Di Zhang',
    zh: '张磾',
    role: 'Web development & infrastructure',
    roleZh: '网站开发与服务器运维',
    photo: '',
  },
  Jiatian_Zhang: {
    en: 'Jiatian Zhang',
    zh: '张家天',
    role: 'Medical image analysis',
    roleZh: '医学影像分析',
    photo: '/images/Team_Profile/JIATIAN_ZHANG/zhangjiatian.png',
  },
  Wei_Hu: {
    en: 'Wei Hu',
    zh: '胡薇',
    role: 'Clinical research & medical evaluation',
    roleZh: '临床研究与医学评估',
    photo: '/images/Team_Profile/WEI_HU/wei_hu.png',
  },
}

export type MemberId = keyof typeof members
export type Language = 'en' | 'zh'

export function cvPath(member: MemberId, language: Language) {
  const suffix = language === 'en' ? '_English.html' : '.html'
  return `${pages.team}${member}${suffix}`
}
