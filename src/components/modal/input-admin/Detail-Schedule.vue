<script setup lang="ts">
import { formatDate, formatTime } from '@/composable/http/utils';
import { useAdminReadScheduleById } from '@/services/admin-schedule';

const props = defineProps<{
  id: string
}>()

const { data } = useAdminReadScheduleById(computed(() => props.id))

defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center bg-white rounded-lg">
    <div class="bg-white p-9 w-[100%] rounded-lg md:w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Posyandu Pemeriksaan Ibu</h2>
        <i class="fas fa-times cursor-pointer"></i>
      </div>
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Tanggal</span>
          <span class="text-pink-500">{{ formatDate(data?.startAt) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Jam</span>
          <span class="text-pink-500">{{ formatTime(data?.startAt) }} - {{ formatTime(data?.endAt) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Petugas</span>
          <span class="text-pink-500">{{ data?.staff.name }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Alamat</span>
          <span class="text-pink-500">{{ data?.address || '-' }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Catatan</span>
          <span class="text-pink-500">{{ data?.note || '-' }} </span>
        </div>
        <div class="flex justify-end space-x-4">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" @click="$emit('close')">Selesai</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can include your additional styles here */
</style>
