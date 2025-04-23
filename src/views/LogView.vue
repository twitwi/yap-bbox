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
import { computed } from 'vue'
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
        <NDatePicker v-model:value="log.start" type="datetime" />
      </NFormItem>
      <NFormItem label="End">
        <NDatePicker v-for="e,i in log.end" :key="i" v-model:value="log.end[i]" type="datetime" />
        <div style="width: 3em"></div>
        <NButton v-if="log.end.length == 0" @click="log.end.push(Date.now())">end now</NButton>
        <NButton v-else @click="log.end.splice(0, log.end.length)" type="error" tertiary>clear end(s)</NButton>
      </NFormItem>
      <NFormItem label="Comment">
        <NInput type="text" @change="router.go(-1)" v-model:value="log.comment" placeholder="Comment" />
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
