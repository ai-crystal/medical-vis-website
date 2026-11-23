<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { cvPath, members, pages, type Language, type MemberId } from '../data/navigation'

const props = defineProps<{ member: MemberId; language: Language }>()
const person = computed(() => members[props.member])
</script>

<template>
  <header class="crystal-site crystal-profile" :lang="language === 'zh' ? 'zh-CN' : 'en'">
    <img v-if="person.photo" :class="{ 'crystal-portrait-di': member === 'Di_Zhang' }" :src="withBase(person.photo)" alt="" width="112" height="112" />
    <div>
      <a class="crystal-profile-return" :href="withBase(pages.team)">{{ language === 'zh' ? '← 项目团队' : '← Project team' }}</a>
      <p class="crystal-profile-role">{{ language === 'zh' ? person.roleZh : person.role }}</p>
      <nav class="crystal-cv-links" :aria-label="language === 'zh' ? '简历语言' : 'CV language'">
        <a :href="withBase(cvPath(member, 'en'))" :aria-current="language === 'en' ? 'page' : undefined" hreflang="en" lang="en">English CV</a>
        <a :href="withBase(cvPath(member, 'zh'))" :aria-current="language === 'zh' ? 'page' : undefined" hreflang="zh-CN" lang="zh-CN">中文简历</a>
      </nav>
    </div>
  </header>
</template>
