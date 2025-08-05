<script setup lang="ts">
import router from '@/router'
import { useMainStore } from '@/stores/simple'
import { logDuration, showTime } from '@/tools'
import { DUMMY_ACTIVITY, DUMMY_LOG, type Activity, type Log } from '@/typing'
import { useNow } from '@vueuse/core'
import { NButton, NSwitch, useNotification } from 'naive-ui'
import { computed, h, ref } from 'vue'
const main = useMainStore()

const now = useNow({ interval: 500 })
const notification = useNotification()

const showLogs = ref(false)
const nRawLogs = ref(500)

const logs = computed(() => {
  const aMap = main.activities.reduce((acc, a) => {
    acc[a.id] = a
    return acc
  }, {} as Record<string, Activity>)

  return main.logs.map((l, index) => {
    return { ...l, index, original: l, act: aMap[l.activity] }
  }).reverse()
})

function useLast(n: number) {
  return computed(() => {
    const logs = main.logs
    const log = logs[logs.length + n] ?? DUMMY_LOG
    const activity = main.activities.find((a) => a.id === log.activity) ?? DUMMY_ACTIVITY
    const time = logDuration(log, now.value.getTime())
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
  const options = [... new Set(logs.value.filter(l => l.activity === a.id && l.comment).map(l => l.comment))]
  if (options.length > 0) {
    const timeout = setTimeout(() => n.destroy(), 5000)
    const selectedComment = ref(options[0])
    const clearTimeoutOnEvents = {
      onClick: () => clearTimeout(timeout), // for mobile?
      onMousemove: () => clearTimeout(timeout),
    }
    const text = (t:string) => () => h('span', clearTimeoutOnEvents, t)
    const n = notification.success({
      avatar: text('⭐'),
      title: text('Quick-add a comment?'),
      description: text('Based on latest comments for this type of activity.'),
      content: () => h('select', {
        value: selectedComment.value,
        onInput: (ev) => selectedComment.value = (ev.target as HTMLSelectElement).value,
        ...clearTimeoutOnEvents,
      }, options.map(c => h('option', { value: c }, c))),
      action: () => h(NButton, {
        disabled: selectedComment.value == '',
        text: true,
        type: 'primary',
        ...clearTimeoutOnEvents,
        onClick: () => {
          const lastLog = main.logs.slice(-1)[0]
          if (lastLog.start !== newLog.start || lastLog.comment !== newLog.comment) {
            notification.error({ title: 'Log changed in the meantime, aborting.', duration: 3000 })
            return
          }
          lastLog.comment = selectedComment.value
          n.destroy()
        }
      }, { default: () => 'Add' }),
    })
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

  <h3><NSwitch v-model:value="showLogs"></NSwitch><label><input type="checkbox" v-model="showLogs" style="display: none">  All Logs (unpaginated! last {{ Math.min(nRawLogs, main.logs.length) }})</label></h3>
  <div v-if="showLogs" class="all-logs beforelast-log">
    <div v-for="log in logs.slice(0, nRawLogs)" :key="log.start" class="log"
    :style="{ ['--col']: log.act.color }"
    @click="router.push({ name: 'log', params: { logIndex: log.index } })">
      <div class="time">{{ showTime(logDuration(log)) }}</div>
      <div class="activity">
        <div class="name">{{ log.act.name }}</div>
        <div class="comment">{{ log.comment }}</div>
      </div>
      <div class="edit" @click.stop="edit(log.original)">edit</div>
    </div>
  </div>
</template>

<style>
.all-logs {
  font-size: .75em;
}
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
