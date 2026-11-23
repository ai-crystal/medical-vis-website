<script setup lang="ts">
import { withBase } from 'vuepress/client'
import { cvPath, members, type MemberId } from '../data/navigation'

const roster = Object.entries(members) as [MemberId, typeof members[MemberId]][]
</script>

<template>
  <div class="crystal-site crystal-shell crystal-inner">
    <header class="crystal-page-intro">
      <p class="crystal-kicker">Crystal</p>
      <h1>Project team</h1>
      <p class="crystal-lede" lang="zh-CN">项目成员</p>
    </header>
    <div class="crystal-team-grid">
      <article v-for="[id, member] in roster" :key="id" class="crystal-person">
        <img v-if="member.photo" :class="{ 'crystal-portrait-di': id === 'Di_Zhang' }" :src="withBase(member.photo)" alt="" width="112" height="112" loading="lazy" />
        <div v-else class="crystal-initials" aria-hidden="true">DZ</div>
        <div class="crystal-person-copy">
          <h2>{{ member.en }}<template v-if="member.degree">, {{ member.degree }}</template> <span lang="zh-CN">{{ member.zh }}</span></h2>
          <p>{{ member.role }}</p>
          <p lang="zh-CN">{{ member.roleZh }}</p>
          <p v-if="member.doctorate" class="crystal-doctorate">
            <span lang="en">{{ member.doctorate.en }}</span>
            <span lang="zh-CN">{{ member.doctorate.zh }}</span>
          </p>
          <div class="crystal-cv-links" :aria-label="member.en + ' CV languages'">
            <a :href="withBase(cvPath(id, 'en'))" hreflang="en">English CV</a>
            <a :href="withBase(cvPath(id, 'zh'))" hreflang="zh-CN" lang="zh-CN">中文简历</a>
          </div>
        </div>
      </article>
    </div>
    <footer class="crystal-footer"><a :href="withBase('/')">Crystal</a></footer>
  </div>
</template>
