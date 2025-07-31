<script setup lang="ts">
import { RouterView } from 'vue-router'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { NButton, NButtonGroup, NConfigProvider, NNotificationProvider, type GlobalThemeOverrides } from 'naive-ui';
import router from './router';
import type { Type } from 'naive-ui/es/button/src/interface';
import Color from 'colorjs.io';

function ifRoute(name: string) {
  return (router.currentRoute.value.name === name ? 'primary' : 'default') as Type
}

function bindFor(name: string) {
  return {
    type: ifRoute(name),
    onClick: () => {
      router.replace({ name })
    },
  }
}

const color = new Color(import.meta.env.VITE_THEME_HEXCOLOR).to('oklch')
const hex = (c: Color) => '#'+c.to('srgb').toString().split(/[(%]/).slice(1, 4).map((s:string)=>Math.round((parseFloat(s.trim())*255/100)).toString(16).padStart(2, '0')).join('')
const nThemeOverride: GlobalThemeOverrides = {
  common: {
    primaryColor: hex(color),
    primaryColorHover: hex(color.clone().set('l', l=>l+.05)),
    primaryColorPressed: hex(color.clone().set('l', l=>l-.05)),
  },
  Button: {
    heightMedium: '50px',
    fontSizeMedium: '22px',
  }
}
</script>

<template>
  <NConfigProvider :theme-overrides="nThemeOverride">
   <NNotificationProvider placement="bottom" :max="2">
    <header>
      <NButtonGroup class="header">
        <NButton v-bind="bindFor('home')">Log</NButton>
        <NButton v-bind="bindFor('activities')">Activities</NButton>
        <NButton v-bind="bindFor('config')" style="flex: 0;">cfg</NButton>
      </NButtonGroup>
    </header>

    <RouterView />
    <ReloadPrompt />
   </NNotificationProvider>
  </NConfigProvider>
</template>
<style>
.header {
  width: 100%;
  display: flex;
  & > * {
    flex: 1;
  }
}
</style>
