<script setup lang="ts">
const props = defineProps({
  activityId: {
    type: String,
    required: true,
  },
})

import router from '@/router'
import { useMainStore } from '@/stores/simple'
import { computed } from 'vue'
const main = useMainStore()
const activity = computed(() => {
  return main.activities.find((a) => a.id === props.activityId)
})
const promptChangeId = () => {
  const newId = prompt('Enter new ID (WARNING CHANGING ID BREAKS LINKS):', activity.value.id)
  if (!newId) return
  if (main.activities.some((a) => a.id === newId)) {
    alert('Activity with this ID already exists')
    return
  }
  activity.value.id = newId
}
</script>

<template>
  <button @click="router.go(-1)">Back</button>

  <template v-if="activity">
    <h3>Activity: {{ activity.name }} <span @click="promptChangeId()">{{ activity.id }}</span></h3>

    <input type="text" v-model="activity.name" placeholder="Activity Name" />
    <input type="text" v-model="activity.description" placeholder="Activity Description" />
    <input type="color" v-model="activity.color" placeholder="Activity Color" />

    <pre>{{ JSON.stringify(activity, null, 2) }}</pre>
  </template>
</template>

<style scoped>
h3 span {
  font-size: .5em;
  font-family: monospace;
}
</style>
