<script setup lang="ts">
const props = defineProps({
  logIndex: {
    type: Number,
    required: true,
  },
})

import router from '@/router'
import { useMainStore } from '@/stores/simple'
import { computed } from 'vue'
const main = useMainStore()
const log = computed(() => {
  return main.logs[props.logIndex]
})
const activity = computed(() => {
  return main.activities.find((a) => a.id === log.value.activity)
})

function promptConfirmDelete() {
  const confirm = window.confirm('Are you sure you want to delete this log?')
  if (confirm) {
    main.logs.splice(props.logIndex, 1)
    router.go(-1)
  }
}
</script>

<template>
  <button @click="router.go(-1)">Back</button>

  <template v-if="log">
    <select v-model="log.activity">
      <option v-for="a in main.activities" :key="a.id" :value="a.id" :style="{['--col']: a.color}">{{ a.name }}</option>
    </select>
    <input type="text" v-model="log.comment" placeholder="Comment" />
    <button @click="promptConfirmDelete()">Delete</button>
    <pre>{{ JSON.stringify(log, null, 2) }}</pre>
  </template>
</template>

