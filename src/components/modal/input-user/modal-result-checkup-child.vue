<script setup lang="ts">
import { useReadChildCheckupById } from '@/services/checkup-children'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

// Route and ID handling
const route = useRoute()
const checkupId = ref(route.params.id as string)

// Props definition
const props = defineProps<{
  id: string
}>()

// Fetch checkup data using service
const { data: checkup } = useReadChildCheckupById(computed(() => props.id))

// Emit event for modal close
defineEmits(['close'])

// Mapper for BMI categories
const bmiCategoryMapper: Record<string, string> = {
  MALNUTRITION: 'Malnutrisi',
  UNDERNUTRITION: 'Kurang Gizi',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Kelebihan Berat Badan',
  OBESITY: 'Obesitas'
}

// Function to handle modal close
const closeModal = () => {
  console.log('Modal closed')
}

// Function to style BMI status
function bmiStyle(bmiCategory: string | undefined) {
  const colorMap: Record<string, string> = {
    MALNUTRITION: '#F87171', // Red
    UNDERNUTRITION: '#F87171', // Red
    NORMAL: '#34D399', // Green
    OVERWEIGHT: '#FBBF24', // Yellow
    OBESITY: '#FBBF24' // Yellow
  }

  return {
    backgroundColor: colorMap[bmiCategory || ''] || 'gray', // Default color
    color: 'black', // Text contrast
    padding: '5px',
    borderRadius: '4px',
    textAlign: 'center' as 'center' // Explicit type for text alignment
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-screen max-w-2xl">
      <div class="flex justify-between items-center border-b pb-4 mb-4">
        <h2 class="text-lg font-semibold">Hasil Pemeriksaan</h2>
        <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="text-center mb-4">
        <img
          alt="Profile picture of {{ checkup?.childName }}"
          class="w-20 h-20 rounded-full mx-auto mb-2"
          :src="
            checkup?.child?.childPicture?.path ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          width="100"
          height="100"
        />
        <h3 class="text-xl font-semibold">{{ checkup?.childName }}</h3>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-500">Umur Anak</span>
          <span class="text-pink-500">{{ checkup?.age }} tahun</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Tinggi Badan</span>
          <span class="text-pink-500">{{ checkup?.height }} Cm</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Berat Badan</span>
          <span class="text-pink-500">{{ checkup?.weight }} KG</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Lingkar Kepala</span>
          <span class="text-pink-500">{{ checkup?.headCircumference }} Cm</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Angka BMI Anak</span>
          <div :style="bmiStyle(checkup?.bmiStatus)" class="px-2 py-1 rounded text-center w-auto">
            {{ Math.round(checkup?.bmi || 0) }} -
            {{ bmiCategoryMapper[checkup?.bmiStatus] || 'Tidak Diketahui' }}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Surat Rujukan Stunting</span>
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
      <div class="flex justify-between mt-6">
        <n-button class="bg-gray-200 text-gray-700 px-4 py-2 rounded" @click="$emit('close')">
          Kembali
        </n-button>
        <n-button class="bg-pink-500 text-white px-4 py-2 rounded" @click="$emit('close')">
          Selesai
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
