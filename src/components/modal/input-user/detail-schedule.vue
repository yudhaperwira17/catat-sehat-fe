<script setup lang="ts">
import { useReadScheduleById } from '@/services/schedule';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{
  id: string
}>()

const { data: scheduleDetail } = useReadScheduleById(computed(() => props.id))

const formattedDate = computed(() => {
  return DateTime.fromISO(scheduleDetail.value?.startAt).toFormat('dd LLL yyyy')
})

const formattedTime = computed(() => {
  const openTime = DateTime.fromISO(scheduleDetail.value?.startAt).toFormat('HH:mm')
  const closeTime = DateTime.fromISO(scheduleDetail.value?.endAt).toFormat('HH:mm')
  return `${openTime} - ${closeTime}`
})
defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center bg-white rounded-lg">
    <div class="bg-white p-9 w-[100%] rounded-lg md:w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Detail Posyandu</h2>
        <i class="fas fa-times cursor-pointer"></i>
      </div>
      <h3 class="text-center text-xl font-semibold mb-6">
        {{ scheduleDetail?.healthPost?.name || 'Posyandu' }}
      </h3>
      <div class="mb-4 text-primary">
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Tanggal</span>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Jam</span>
          <span>{{ formattedTime }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Petugas</span>
          <span>{{ scheduleDetail?.staff?.name || '-' }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Alamat</span>
          <span>{{ scheduleDetail?.address || '-' }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700 ">Catatan</span>
          <span class="text-right">{{ scheduleDetail?.note || '-' }} </span>
        </div>
      </div>
      <div class="flex justify-end space-x-4">
        <n-button type="primary" @click="$emit('close')">Selesai</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can include your additional styles here */
</style>
