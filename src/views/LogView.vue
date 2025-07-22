<script setup lang="ts">
import { NButton, NDatePicker, NForm, NFormItem, NInput, NSelect } from 'naive-ui'

const props = defineProps({
  logIndex: {
    type: String,
    required: true,
  },
})

import router from '@/router'
import { useMainStore } from '@/stores/simple'
import { computed, ref, watch, type Ref } from 'vue'
import { DUMMY_ACTIVITY } from '@/typing'
import BackButton from '@/components/BackButton.vue'
const main = useMainStore()
const log = computed(() => {
  return main.logs[parseInt(props.logIndex)]
})
const activity = computed(() => {
  return main.activities.find((a) => a.id === log.value.activity) ?? DUMMY_ACTIVITY
})
const activityOptions = computed(() => {
  return main.activities.map((a) => ({
    label: a.name,
    value: a.id,
    key: a.id,
    color: a.color,
  }))
})

function promptConfirmDelete() {
  const confirm = window.confirm('Are you sure you want to delete this log?')
  if (confirm) {
    main.logs.splice(parseInt(props.logIndex), 1)
    router.go(-1)
  }
}

const focused = ref<HTMLElement | null>(null)
watch(focused, (el) => {
  if (el) {
    el.focus()
  }
}, { immediate: true })

const wrapDate = <K extends number|string>(k: K) => (it: () => Record<K, number>) => computed({
  get: () => new Date(it()[k] - new Date().getTimezoneOffset() * 60000).toISOString().replace(/Z/, ''),
  set: (value: string) => {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      it()[k] = date.getTime()
    }
  },
})
const wrapStart = wrapDate('start')(() => log.value)
const wrapEnd = computed(() => {
  return log.value.end.map((e, i) => wrapDate(i)(() => log.value.end))
})

</script>

<template>
  <BackButton/>

  <template v-if="log">
    <NForm>
      <NFormItem label="Activity">
        <div :style="{'--col': activity.color}" class="activity-color"></div>
        <NSelect v-model:value="log.activity" :options="activityOptions" />
      </NFormItem>
      <NFormItem label="Start">
        <input type="datetime-local" v-model="wrapStart" />
      </NFormItem>
      <NFormItem label="End">
        <input v-for="(e,i) in log.end" :key="i" type="datetime-local" v-model="wrapEnd[i].value" />
        <div style="width: 3em"></div>
        <NButton v-if="log.end.length == 0" @click="log.end.push(Date.now())">end now</NButton>
        <NButton v-else @click="log.end.splice(0, log.end.length)" type="error" tertiary>clear end(s)</NButton>
      </NFormItem>
      <NFormItem label="Comment">
        <NInput ref="focused" type="text" @change="router.go(-1)" v-model:value="log.comment" placeholder="Comment" />
      </NFormItem>
    </NForm>
    <NButton @click="promptConfirmDelete" type="error">Delete</NButton>
  </template>
</template>

<style>
.activity-color {
  width: 1em;
  height: 2em;
  background-color: var(--col);
}
</style>
