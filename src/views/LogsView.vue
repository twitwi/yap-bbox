<script setup lang="ts">
import router from '@/router'
import { useMainStore } from '@/stores/simple'
import { Activity, DUMMY_ACTIVITY, DUMMY_LOG, Log } from '@/typing'
import { useNow } from '@vueuse/core'
import { computed } from 'vue'
const main = useMainStore()

const now = useNow({ interval: 500 })

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
    const live = now.value.getTime() - log.start
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
    const live = now.value.getTime() - log.start
    return showTime(live)
  }
  const duration = Math.min(...log.end) - log.start
  return showTime(duration)
})

function clickLastLog() {
  if (lastLog.value.end.length == 0) {
    lastLog.value.end.push(Date.now() - 500)
  } else {
    clickActivity(lastActivity.value)
  }
}
function clickBeforeLastLog() {
  if (beforeLastLog.value.end.length == 0) {
    beforeLastLog.value.end.push(Date.now() - 500)
  } else {
    clickActivity(beforeLastActivity.value)
  }
}
function edit(log: Log) {
  router.push({ name: 'log', params: { logIndex: main.logs.indexOf(log) } })
}

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

  <div :class="{log:true, 'last-log': true, running: lastLog.end.length == 0}" :style="{ ['--col']: lastActivity.color }">
    <div class="time" @click="clickLastLog()">{{ lastLogTime }}</div>
    <div class="activity">
      <div class="name">{{ lastActivity.name }}</div>
      <div class="comment">{{ lastLog.comment }}</div>
    </div>
    <div class="edit" @click="edit(lastLog)">edit</div>
  </div>

  <div :class="{log:true, 'beforelast-log': true, running: beforeLastLog.end.length == 0}" :style="{ ['--col']: beforeLastActivity.color }">
    <div class="time" @click="clickBeforeLastLog()">{{ beforeLastLogTime }}</div>
    <div class="activity">
      <div class="name">{{ beforeLastActivity.name }}</div>
      <div class="comment">{{ beforeLastLog.comment }}</div>
    </div>
    <div class="edit" @click="edit(beforeLastLog)">edit</div>
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
  background: lightgrey;
  .time {
    text-align: center;
    font-size: 3em;
    .log.running & {
      color: #400;
      font-weight: lighter;
    }
    .beforelast-log & {
      color: #444;
      display: inline-block;
      width: 20%;
      font-size: 2em;
    }
  }
  .activity {
    display: inline-block;
    width: 80%;
    .beforelast-log & {
      width: 60%;
    }
    min-height: 3em;
    margin: 0 1em 1em;
    border: 1em solid var(--col);
    border-width: 0 1em;
    background: black;
    color: white;
    .name {
      text-align: center;
    }
    .comment {
      color: #f99;
    }
  }
  .edit {
    display: inline-block;
    width: calc(20% - 4em);
    margin: 0 1em;
    padding: .5em;
    text-align: center;
    cursor: pointer;
    background: #444;
    color: white;
  }
  margin: 1em;
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
