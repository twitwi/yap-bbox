import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Activity, Log } from '@/typing'

export const useLocalStore = defineStore(
  'local',
  () => {
    // like setup() in a component
    const userName = ref('bob')
    return { userName }
  },
  {
    persist: true, // persisted in localStorage
  },
)

export const useMainStore = defineStore(
  'main',
  () => {
    // like setup() in a component
    const logs = ref([] as Log[])
    const activities = ref([] as Activity[])
    return { logs, activities }
  },
  {
    sharing: true, // shared through yjs (+ local IDB)
  },
)
