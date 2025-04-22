<script setup lang="ts">
import EditLocalStorageConfig from '@/components/EditLocalStorageConfig.vue';
import router from '@/router';

import { useMainStore } from '@/stores/simple'
const main = useMainStore()

function promptReloadPage() {
  if (confirm('Are you sure you want to reload the page?')) {
    location.reload()
  }
}
</script>

<template>
  <h3>Config</h3>
  <details>
    <summary>local storage (security: hidden)</summary>
    <EditLocalStorageConfig style="width: 100%" />
  </details>
  <h3>Stats</h3>
  <p>Total logs: {{ main.logs.length }}</p>
  <p>Unfinished logs: {{ main.logs.filter((l) => l.end.length == 0).length }}</p>
  <p>Total activities: {{ main.activities.length }}</p>
  <p class="activity-rainbow"><span v-for="a in main.activities" :key="a.id"
    :style="{ background: a.color}"
    @click="router.push({ name: 'activity', params: { activityId: a.id } })"
    :title="a.name">{{ main.logs.filter((l) => l.activity == a.id).length }}</span></p>
  <h3>More</h3>
  <button @click="promptReloadPage()">Reload</button>
</template>

<style>
.activity-rainbow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 1em;
  span {
    display: inline-block;
    width: 2em;
    height: 2em;
    border-radius: 0.5em;
    box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
    text-shadow: 1px 1px 2px white;
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
