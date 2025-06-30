<script setup lang="ts">
import Table from '@/components/mother/MonitorBlood.vue';
</script>
<template>
  <div class="bg-white p-6 rounded-lg overflow-auto">
    <div>
      <n-breadcrumb separator=">" class="mb-2">
        <div class="flex items-center space-x-1">
          <i-material-symbols:home class="text-lg"></i-material-symbols:home>
          <n-breadcrumb-item href="dashboard">Dashboard</n-breadcrumb-item>
          <n-breadcrumb-item>Kesehatan Ibu</n-breadcrumb-item>
        </div>
      </n-breadcrumb>
    </div>
    <div class=" bg-white rounded-lg overflow-auto">
      <Table />
    </div>

    <div class="flex justify-center items-center mt-4"></div>
  </div>
</template>
<style scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
