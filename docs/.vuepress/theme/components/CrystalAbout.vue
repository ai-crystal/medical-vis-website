<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { pages, type Language } from '../data/navigation'

const props = withDefaults(defineProps<{ language?: Language }>(), { language: 'en' })

const content = {
  en: {
    languageLabel: 'Page language',
    title: 'About Crystal',
    subtitle: 'Medical visualization, grounded in anatomy',
    intro: 'Crystal is a project team founded at the University of Science and Technology of China (USTC). We build tools that make medical images easier to explore in 3D, with attention to anatomical accuracy and visual detail.',
    imageAlt: 'Crystal volume rendering of a torso showing the ribs and internal structures.',
    imageCaption: 'Torso volume rendered in Crystal',
    sections: [
      { title: 'How Crystal began', body: 'The project began at USTC around a shared question: how can we turn medical scans into clear, detailed 3D views? That question brings together rendering research, medical image analysis and software development.' },
      { title: 'What we build', body: 'Crystal combines volume rendering, segmentation and 3D reconstruction. Color, opacity and light help make structures easier to distinguish. Adjustable rendering and mapping settings let researchers see how display choices affect the result.' },
      { title: 'Why medical expertise matters', body: 'Medical analysis specialists take part in the project. They bring anatomical and imaging expertise to the interpretation of source images, segmentation results and rendered views, and help the team identify ambiguities that need closer review.' },
    ],
    team: 'Meet the team',
    project: 'Project overview',
    docs: 'Read the documentation',
  },
  zh: {
    languageLabel: '页面语言',
    title: '关于 Crystal',
    subtitle: '以解剖结构为基础的医学可视化',
    intro: 'Crystal 是一个成立于中国科学技术大学的项目团队。我们致力于把医学影像转化为便于观察和理解的三维视图，兼顾解剖结构的准确性与画面的精细度。',
    imageAlt: 'Crystal 的躯干体渲染，展示肋骨和内部结构。',
    imageCaption: 'Crystal 躯干体渲染',
    sections: [
      { title: '团队起源', body: '项目起源于中国科学技术大学。团队围绕一个共同问题展开工作：如何把医学扫描变成清晰、细致、便于观察的三维视图？这一目标将渲染研究、医学影像分析和软件开发汇集到同一个项目中。' },
      { title: '项目目标', body: 'Crystal 将体渲染、分割与三维重建结合起来。通过调整颜色、不透明度和光照，可以更清楚地观察不同结构。可调节的渲染与映射参数也便于研究人员对照不同设置，理解它们如何影响显示结果。' },
      { title: '医学分析人员的参与', body: '团队有专业的医学分析人员参与。他们结合解剖与影像知识，协助解读原始影像、分割结果与渲染画面，帮助团队发现需要进一步核查的结构和容易产生歧义的呈现方式。' },
    ],
    team: '认识项目团队',
    project: '项目概览',
    docs: '阅读项目文档',
  },
}

const copy = computed(() => content[props.language])
</script>

<template>
  <div class="crystal-site crystal-shell crystal-inner crystal-about">
    <header class="about-hero">
      <div class="about-copy">
        <nav class="crystal-cv-links" :aria-label="copy.languageLabel">
          <a :href="withBase(pages.about)" lang="en" hreflang="en" :aria-current="language === 'en' ? 'page' : undefined">English</a>
          <a :href="withBase(pages.aboutZh)" lang="zh-CN" hreflang="zh-CN" :aria-current="language === 'zh' ? 'page' : undefined">中文</a>
        </nav>
        <h1>{{ copy.title }}</h1>
        <p class="about-subtitle">{{ copy.subtitle }}</p>
        <p class="crystal-lede">{{ copy.intro }}</p>
        <div class="crystal-actions">
          <a class="crystal-button primary" :href="withBase(pages.team)">{{ copy.team }} <span aria-hidden="true">↗</span></a>
          <a class="crystal-button secondary" :href="withBase(pages.project)">{{ copy.project }}</a>
        </div>
      </div>

      <figure class="about-figure">
        <img :src="withBase('/images/Research_Field/hyper_realistic_rendering/Image-02.png')" :alt="copy.imageAlt" decoding="async" />
        <figcaption>{{ copy.imageCaption }}</figcaption>
      </figure>
    </header>

    <div class="about-sections">
      <section v-for="section in copy.sections" :key="section.title">
        <h2>{{ section.title }}</h2>
        <p>{{ section.body }}</p>
      </section>
    </div>

    <footer class="crystal-footer">
      <span>Crystal</span>
      <a :href="withBase(pages.documentation)">{{ copy.docs }}</a>
      <a :href="withBase(pages.team)">{{ copy.team }}</a>
    </footer>
  </div>
</template>

<style scoped>
.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
  align-items: center;
  gap: clamp(26px, 6vw, 74px);
  padding: clamp(20px, 5vw, 56px);
  background: var(--cr-surface-fill);
  border: 1px solid var(--cr-line);
  border-radius: 18px;
}
.about-copy { display: grid; justify-items: start; gap: 15px; }
.about-copy h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.04; }
.about-copy .about-subtitle { color: var(--cr-accent); font-size: clamp(1.15rem, 2.5vw, 1.5rem); font-weight: 670; }
.about-figure { max-width: 440px; width: 100%; justify-self: center; overflow: hidden; background: #112c53; border-radius: 12px; }
.about-figure img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; }
.about-figure figcaption { padding: 11px 14px; color: #e4efff; font-size: .87rem; }
.about-sections {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-block: clamp(25px, 5vw, 52px);
}
.about-sections section { padding: clamp(17px, 3vw, 26px); border: 1px solid var(--cr-line); border-top: 3px solid var(--cr-accent); border-radius: 12px; background: var(--cr-card); }
.about-sections h2 { font-size: 1.32rem; line-height: 1.25; }
.about-sections p { margin-top: 10px; color: var(--cr-muted); line-height: 1.68; }
@media (max-width: 850px) {
  .about-hero, .about-sections { grid-template-columns: minmax(0, 1fr); }
}
</style>
