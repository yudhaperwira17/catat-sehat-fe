<script setup lang="ts">
import {
    useAdminReadCheckupMotherById
} from '@/services/admin-checkup-mother';

const props = defineProps<{
  id: string
}>()

const { data: mother } = useAdminReadCheckupMotherById(computed(() => props.id))

defineEmits(['close'])

</script>

<template>
  <div class="flex items-center justify-center bg-white rounded-lg">
    <div class="bg-white p-9 w-[100%] rounded-lg md:w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Hasil Pemeriksaan Ibu</h2>
        <i class="fas fa-times cursor-pointer"></i>
      </div>
      <h3 class="text-center text-xl font-semibold mb-6">
        {{ mother?.name }}
      </h3>
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Usia Kehamilan</span>
          <span class="text-pink-500">{{ mother?.month }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Tinggi Badan</span>
          <span class="text-pink-500">{{ mother?.height }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Berat Badan</span>
          <span class="text-pink-500">{{ mother?.weight || '-' }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Fundus Uteri</span>
          <span class="text-pink-500">{{ mother?.fundusMeasurement || '-' }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-700">Lingkar Lengan</span>
          <span class="text-pink-500">{{ mother?.upperArmCircumference || '-' }} </span>
        </div>
         <div class="flex justify-between mb-2">
          <span class="text-gray-700">Angka Bmi Ibu</span>
          <span class="text-pink-500">{{ mother?.bmi }} {{ mother?.bmiStatus }} </span>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span>Surat Rujukan Stunting</span>
          <a
            v-if="mother?.fileDiagnosed?.path"
            class="flex items-center text-blue-500 hover:text-blue-700"
            :href="mother.fileDiagnosed.path"
            target="_blank"
          >
            <i class="fas fa-file-pdf mr-2"></i>
            Surat Rujukan
          </a>
          <span v-else class="flex items-center text-gray-500 italic">
            <i class="fas fa-file-pdf mr-2"></i>
            Surat Rujukan tidak tersedia
          </span>
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
