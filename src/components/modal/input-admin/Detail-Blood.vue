<script setup lang="ts">
import { formatDate } from '@/composable/http/utils';
import { useAdminReadBloodRecordById } from '@/services/admin-bloodRecord';

const props = defineProps<{
  id: string
}>()

const { data: blood, isError, isLoading } = useAdminReadBloodRecordById(computed(() => props.id))

const detail = computed(() => blood.value ?? {})

defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center bg-white rounded-lg">
    <div class="bg-white p-9 w-[100%] rounded-lg md:w-96">
      <div v-if="isLoading" class="text-center py-8">
        <p>Loading data pantau ibu hamil...</p>
      </div>
      <div v-else-if="isError" class="text-center py-8 text-red-500">Gagal memuat data.</div>

      <div v-else-if="detail" class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Detail TTD Ibu Hamil</h2>
        <i class="fas fa-times cursor-pointer"></i>
      </div>
      <h3 class="text-center text-xl font-semibold mb-6">
        {{ detail.mother?.name }}
      </h3>
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Bulan</span>
          <span class="text-primary">{{ detail?.monthBlood?.name }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Tanggal</span>
          <span class="text-primary">{{ formatDate(detail?.date) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Nama Pengontrol</span>
          <span class="text-primary">{{ detail?.admin?.name || detail.staffName }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Status Pengontrol</span>
          <span class="text-primary">{{ detail.admin?.type || detail?.staffJob }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Catatan</span>
          <span class="text-primary">{{ detail?.note || '-' }} </span>
        </div>
      </div>
      <div class="flex justify-end space-x-4">
        <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
        <n-button type="primary" @click="$emit('close')">Selesai</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can include your additional styles here */
</style>
