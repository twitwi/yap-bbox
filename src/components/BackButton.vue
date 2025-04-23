<script setup lang="ts">
import router from '@/router';
import { NButton } from 'naive-ui';


</script>
<template>
  <NButton @click="router.go(-1)" type="primary" style="width: 100%;">Back</NButton>
</template>
