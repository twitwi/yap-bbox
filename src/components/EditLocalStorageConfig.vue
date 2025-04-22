<script lang="ts" setup>
import { APP_LOCAL_STORAGE_KEY } from '@/main-yjs';
import { computed } from 'vue';

const lsvalue = computed({
  get: () => localStorage.getItem(APP_LOCAL_STORAGE_KEY) ?? '',
  set: (value) => {
    localStorage.setItem(APP_LOCAL_STORAGE_KEY, value);
  },
})
</script>
<template>
  <input type="text" v-model="lsvalue" placeholder="sv:path:token" />
</template>
