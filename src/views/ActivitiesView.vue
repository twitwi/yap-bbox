<script setup lang="ts">
import { useMainStore } from '@/stores/simple'
const main = useMainStore()

function addActivity() {
  const name = prompt('Enter activity name:')
  const description = prompt('Enter activity description:')
  const color = prompt('Enter activity color:')
  if (!name || !description || !color) {
    alert('All fields are required')
    return
  }
  const id = name.toLowerCase().replace(/\s+/g, '-')
  if (Object.keys(main.activities).some((i) => i === id)) {
    alert('Activity with this ID already exists')
    return
  }
  if (Object.values(main.activities).some((a) => a.name === name)) {
    alert('Activity with this name already exists')
    return
  }
  const newActivity = { id, name, description, color }
  main.activities.push(newActivity)
}
</script>

<template>
  <h3>Activites</h3>

  <div class="activities">
    <div v-for="a in main.activities" :key="a.id" class="activity" :style="{ ['--col']: a.color }">
      <h4>{{ a.name }}</h4>
      <p>{{ a.description }}</p>
    </div>
  </div>
  <button @click="addActivity()">Add Activity</button>

  <pre>{{ JSON.stringify(main.activities, null, 2) }}</pre>
</template>

<style>
.activities {
  .activity {
    border-left: 1em solid var(--col);
    padding-left: 1em;
    margin-top: 1em;
  }
}
</style>
