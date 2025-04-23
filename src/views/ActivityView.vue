<script setup lang="ts">
const props = defineProps({
  activityId: {
    type: String,
    required: true,
  },
})

import BackButton from '@/components/BackButton.vue'
import router from '@/router'
import { useMainStore } from '@/stores/simple'
import { logDuration, showInstant, showTime } from '@/tools'
import { DUMMY_ACTIVITY } from '@/typing'
import { computed } from 'vue'
const main = useMainStore()
const activity = computed(() => {
  return main.activities.find((a) => a.id === props.activityId) ?? DUMMY_ACTIVITY
})
const logs = computed(() => {
  let total = 0
  return main.logs.filter((l) => l.activity === activity.value.id).reverse().map((l) => {
    const duration = logDuration(l)
    total += duration
    return { ...l, original: l, total }
  })
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
  <BackButton/>

  <template v-if="activity">
    <h3>Activity: {{ activity.name }} <span @click="promptChangeId()">{{ activity.id }}</span></h3>

    <input type="text" v-model="activity.name" placeholder="Activity Name" />
    <input type="text" v-model="activity.description" placeholder="Activity Description" />
    <input type="color" v-model="activity.color" placeholder="Activity Color" />

    <hr/>

    <h3>Logs for {{ activity.name }}</h3>
    <div class="logs">
      <div v-for="log in logs" :key="log.start" class="log"
      :style="{ ['--col']: activity.color }" @click="router.push({ name: 'log', params: { logIndex: main.logs.indexOf(log.original) } })">
        <div class="time">{{ showTime(logDuration(log)) }}</div>
        <div>{{ showInstant(log.start) }}</div>
        <div>{{ showInstant(log.end[0]) }}</div>
        <div class="total-duration">cumulated: {{ showTime(log.total) }}</div>
        <div class="comment">{{ log.comment }}</div>
      </div>
    </div>
  </template>
</template>

<style scoped>
h3 span {
  font-size: .5em;
  font-family: monospace;
}
.comment {
  font-style: italic;
}
</style>
