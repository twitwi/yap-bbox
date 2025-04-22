<script setup lang="ts">
import { RouterView } from 'vue-router'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { NButton, NButtonGroup } from 'naive-ui';
import router from './router';
import type { Type } from 'naive-ui/es/button/src/interface';

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
</script>

<template>
  <header>
    <NButtonGroup size="large" class="header">
      <NButton v-bind="bindFor('home')">Log</NButton>
      <NButton v-bind="bindFor('activities')">Activities</NButton>
      <NButton v-bind="bindFor('config')" style="flex: 0;">cfg</NButton>
    </NButtonGroup>
  </header>

  <RouterView />
  <ReloadPrompt />
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
