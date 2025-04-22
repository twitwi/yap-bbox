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

function useLast(n: number) {
  return computed(() => {
    const logs = main.logs
    const log = logs[logs.length + n] ?? DUMMY_LOG
    const activity = main.activities.find((a) => a.id === log.activity) ?? DUMMY_ACTIVITY
    const time = log.end.length === 0 ? now.value.getTime() - log.start : Math.min(...log.end) - log.start
    const clickIt = () => {
      if (log.end.length == 0) {
        log.end.push(Date.now() - 500)
      } else {
        clickActivity(activity)
      }
    }
    return { log, activity, time, clickIt }
  })
}

const last = useLast(-1)
const beforeLast = useLast(-2)

function edit(log: Log) {
  router.push({ name: 'log', params: { logIndex: main.logs.indexOf(log) } })
}

function clickActivity(a: Activity) {
  if (last.value.log.end.length == 0) {
    last.value.log.end.push(Date.now() - 500)
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

  <div :class="{log:true, 'last-log': true, running: last.log.end.length == 0}" :style="{ ['--col']: last.activity.color }">
    <div class="time" @click="last.clickIt()">{{ showTime(last.time) }}</div>
    <div class="activity">
      <div class="name">{{ last.activity.name }}</div>
      <div class="comment">{{ last.log.comment }}</div>
    </div>
    <div class="edit" @click="edit(last.log)">edit</div>
  </div>

  <div :class="{log:true, 'beforelast-log': true, running: beforeLast.log.end.length == 0}" :style="{ ['--col']: beforeLast.activity.color }">
    <div class="time" @click="beforeLast.clickIt()">{{ showTime(beforeLast.time) }}</div>
    <div class="activity">
      <div class="name">{{ beforeLast.activity.name }}</div>
      <div class="comment">{{ beforeLast.log.comment }}</div>
    </div>
    <div class="edit" @click="edit(beforeLast.log)">edit</div>
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
      margin: 0 .5em;
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
