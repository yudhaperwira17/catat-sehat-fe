<script setup lang="ts">
import { useReadParentsCheckupById } from '@/services/checkup-parents';
import { computed } from 'vue';

const props = defineProps<{
  id: string
}>()

const { data: checkup } = useReadParentsCheckupById(computed(() => props.id))

const emit = defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-[335px] md:w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Hasil Pemeriksaan Ibu</h2>
        <button class="text-gray-400 hover:text-gray-600" @click="emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <hr class="py-4" />
      <div class="mb-4 text-primary">
        <div class="flex justify-between mb-2">
          <span class="text-black">Usia kehamilan</span>
          <span>{{ checkup?.month || 'Tidak Diketahui' }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-black">Tinggi Badan</span>
          <span>{{ checkup?.height }} Cm</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-black">Berat Badan</span>
          <span>{{ checkup?.weight }} KG</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-black">Fundus Uteri</span>
          <span>{{ checkup?.fundusMeasurement }} Cm</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-black">Lingkar Lengan</span>
          <span>{{ checkup?.upperArmCircumference }} cm</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-black">Angka BMI Ibu</span>
          <span>{{ Math.round(checkup?.bmi || 0) }} </span>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-black">Surat Rujukan Stunting</span>
          <a
            v-if="checkup?.fileDiagnosed?.path"
            class="flex items-center text-blue-500 hover:text-blue-700"
            :href="checkup.fileDiagnosed.path"
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
      <div class="flex justify-end">
        <n-button type="primary" class="text-white px-4 py-2 rounded" @click="$emit('close')">
          Selesai
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add any additional styles here if needed */
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
