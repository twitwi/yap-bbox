import { createRouter, createWebHashHistory } from 'vue-router'
import ActivitiesView from '@/views/ActivitiesView.vue'
import ActivityView from '@/views/ActivityView.vue'
import LogsView from '@/views/LogsView.vue'
import LogView from '@/views/LogView.vue'
import ConfigView from '@/views/ConfigView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LogsView,
    },
    {
      path: '/l/:logIndex',
      name: 'log',
      component: LogView,
      props: true,
    },
    {
      path: '/a',
      name: 'activities',
      component: ActivitiesView
    },
    {
      path: '/a/:activityId',
      name: 'activity',
      component: ActivityView,
      props: true,
    },
    {
      path: '/cfg',
      name: 'config',
      component: ConfigView,
    },
  ],
})

export default router
