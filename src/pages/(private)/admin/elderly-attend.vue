<script setup lang="ts">
import { computed } from 'vue'
import { useAttendList } from '@/services/elder-attend'

const { data } = useAttendList(computed(() => ({})))
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Daftar Kehadiran Lansia</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <router-link to="/admin/dashboard" class="hover:underline">Dashboard</router-link>

        <span class="mx-1">></span>
        <span>Daftar Kehadiran Lansia</span>
      </nav>
    </div>

    <n-table>
      <thead>
        <n-tr>
          <n-th> Nama </n-th>
          <n-th v-for="m in Object.keys(data?.elderlyCheckupByMonth || {})" :key="m">
            {{ m }}
          </n-th>
        </n-tr>
      </thead>
      <tbody>
        <n-tr v-for="elder in data?.elders || []" :key="elder.id">
          <n-td> {{ elder.name }} </n-td>
          <n-td
            v-for="m in Object.keys(data?.elderlyCheckupByMonth || {})"
            :key="m"
            class="text-center text-xl"
          >
            <div
              v-if="
                data?.elderlyCheckupByMonth[m].find((item) => item.elderlyId === elder.id)?.id &&
                true
              "
            >
              <span class="text-green-500">✅</span>
            </div>
            <div v-else-if="new Date(m).getMonth() <= new Date().getMonth()">
              <span class="text-red-500">❌</span>
            </div>
            <div v-else>
              <span class="text-gray-500">-</span>
            </div>
          </n-td>
        </n-tr>
      </tbody>
    </n-table>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>

<style scoped>
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
  font-weight: normal !important;
  font-size: 14px !important;
  text-transform: capitalize !important;
  color: inherit !important;
}

:deep(.n-data-table-td) {
  font-size: 14px !important;
  color: inherit !important;
  padding: 12px 16px !important;
}

:deep(.n-data-table) {
  --n-merged-th-color: #a6c9f5 !important;
  --n-merged-td-color: #ffffff !important;
  --n-th-padding: 12px 16px !important;
  --n-td-padding: 12px 16px !important;
}

.search-btn {
  background-color: #0f5bc0;
  border-color: #0f5bc0;
}

.search-btn:hover {
  background-color: #0d4fa8;
}

.search-input :deep(.n-input) {
  border-radius: 8px;
}

.search-input :deep(.n-input-wrapper) {
  padding-left: 12px;
}

.search-input :deep(.n-input__prefix) {
  margin-right: 8px;
  color: #8e8e8e;
}

.search-input :deep(.n-input__input-el) {
  font-size: 14px;
}

:deep(.custom-table) {
  width: 100%;
}
</style>
