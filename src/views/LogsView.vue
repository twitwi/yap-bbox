<script setup lang="ts">
import { useMainStore } from '@/stores/simple'
import { Activity, DUMMY_ACTIVITY, DUMMY_LOG, Log } from '@/typing'
import { useNow } from '@vueuse/core'
import { computed } from 'vue'
const main = useMainStore()

const now = useNow({ interval: 500, controls: true })

function showTime(t) {
  return new Date(t).toISOString().substring(11, 19)
}

const lastLog = computed(() => {
  const logs = main.logs
  if (logs.length === 0) return DUMMY_LOG
  return logs[logs.length - 1]
})
const lastActivity = computed(() => {
  const logs = main.logs
  if (logs.length === 0) return DUMMY_ACTIVITY
  return main.activities.find((a) => a.id === logs[logs.length - 1].activity) || DUMMY_ACTIVITY
})
const lastLogTime = computed(() => {
  const log = lastLog.value
  if (log.end.length === 0) {
    const live = now.now.value - log.start
    return showTime(live)
  }
  const duration = Math.min(...log.end) - log.start
  return showTime(duration)
})
const beforeLastLog = computed(() => {
  const logs = main.logs
  if (logs.length < 2) return DUMMY_LOG
  return logs[logs.length - 2]
})
const beforeLastActivity = computed(() => {
  const logs = main.logs
  if (logs.length < 2) return DUMMY_ACTIVITY
  return main.activities.find((a) => a.id === logs[logs.length - 2].activity) || DUMMY_ACTIVITY
})
const beforeLastLogTime = computed(() => {
  const log = beforeLastLog.value
  if (log.end.length === 0) {
    const live = now.now.value - log.start
    return showTime(live)
  }
  const duration = Math.min(...log.end) - log.start
  return showTime(duration)
})

function clickActivity(a: Activity) {
  if (lastLog.value.end.length == 0) {
    lastLog.value.end.push(Date.now() - 500)
  }
  const newLog: Log = {
    activity: a.id,
    start: Date.now() - 500,
    end: [],
    comment: '',
  }
  main.logs.push(newLog)
}
</script>

<template>
  <h3>Logging</h3>

  <div class="log last-log" :style="{ ['--col']: lastActivity.color }">
    <div>Current Log</div>
    <div>{{ lastLogTime }}</div>
    <p>{{ lastLog.comment }}</p>
  </div>

  <div class="log before-last-log" :style="{ ['--col']: beforeLastActivity.color }">
    <div>Previous Log</div>
    <div>{{ beforeLastLogTime }}</div>
    <p>{{ beforeLastLog.comment }}</p>
  </div>

  <div class="pick-activities">
    <div v-for="a in main.activities" :key="a.id" class="activity"
    :style="{ ['--col']: a.color }"
    @click="clickActivity(a)">
      <h4>{{ a.name }}</h4>
    </div>
  </div>

  <pre>{{ JSON.stringify(main.logs.slice(0, 10), null, 2) }}</pre>
</template>

<style>
.log {
  border: 2px solid grey;
}
.pick-activities {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  margin-bottom: 1em;
  .activity {
    cursor: pointer;
    border: 1em solid var(--col);
    border-top: .5em solid black;
    border-bottom: .5em solid black;
    padding: .5em;

  }
}
</style>
