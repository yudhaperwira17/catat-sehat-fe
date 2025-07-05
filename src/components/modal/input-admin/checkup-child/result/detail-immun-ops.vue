<script setup lang="ts">
import { formatDate } from '@/composable/http/utils';
import { useAdminReadImmunizationOptionalById } from '@/services/admin-immunization';

const props = defineProps<{
  id: string
}>()

const { data: blood, isError, isLoading } = useAdminReadImmunizationOptionalById(computed(() => props.id))

const detail = computed(() => blood.value ?? {})

defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center bg-white rounded-lg">
    <div class="bg-white p-9 w-full rounded-lg md:w-96">
      <div v-if="isLoading" class="text-center py-8">
        <p>Loading data...</p>
      </div>
      <div v-else-if="isError" class="text-center py-8 text-red-500">Gagal memuat data.</div>

      <div v-else-if="detail" class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Detail TTD Ibu Hamil</h2>
        <i class="fas fa-times cursor-pointer"></i>
      </div>
      <h3 class="text-center text-xl font-semibold mb-6">
        {{ detail.children?.name }}
      </h3>
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Nama Vaksin</span>
          <span class="text-primary">{{ detail?.name }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Umur</span>
          <span class="text-primary">{{ detail?.dateGiven }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Nama Ibu</span>
          <span class="text-primary text-right">{{ detail?.children?.mother?.name }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Tanggal</span>
          <span class="text-primary">{{ formatDate(detail.createdAt) }}</span>
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
