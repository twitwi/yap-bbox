import { createRouter, createWebHashHistory } from 'vue-router'
import ActivitiesView from '@/views/ActivitiesView.vue'
import ActivityView from '@/views/ActivityView.vue'
import LogsView from '@/views/LogsView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LogsView,
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
  ],
})

export default router
