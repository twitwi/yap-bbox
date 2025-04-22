import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import ActivityView from '@/views/ActivityView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
