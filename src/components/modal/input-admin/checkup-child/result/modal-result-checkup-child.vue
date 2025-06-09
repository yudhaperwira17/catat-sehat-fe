<script setup lang="ts">
import { useAdminReadCheckupChildById } from '@/services/admin-checkup-child'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

const { data: checkup } = useAdminReadCheckupChildById(computed(() => props.id))
const emit = defineEmits(['close'])

interface Detail {
  label: string
  value: string
  valueClass: string
}

// Dynamically map details based on checkup data
const details = computed<Detail[]>(() => [
  {
    label: 'Umur anak',
    value: `${checkup.value?.children.age ?? 'N/A'}`,
    valueClass: 'text-primary'
  },
  {
    label: 'Tinggi Badan',
    value: `${checkup.value?.height ?? 'N/A'} cm`,
    valueClass: 'text-primary'
  },
  {
    label: 'Berat Badan',
    value: `${checkup.value?.weight ?? 'N/A'} kg`,
    valueClass: 'text-primary'
  },
  {
    label: 'Lingkar Kepala',
    value: `${checkup.value?.headCircumference ?? 'N/A'} cm`,
    valueClass: 'text-primary'
  }
])

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 sm:[335px] md:w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Hasil Pemeriksaan</h2>
        <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="flex flex-col items-center mb-4">
        <img
          alt="Profile picture of Yaqub Qamar"
          class="w-20 h-20 rounded-full mb-2"
          :src="
            checkup?.child?.childPicture?.path ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
        />
        <h3 class="text-lg font-semibold">{{ checkup?.name }}</h3>
      </div>
      <div class="mb-4 border-t border-gray-300 pt-2">
        <div class="flex justify-between mb-2" v-for="(detail, index) in details" :key="index">
          <span class="text-gray-600">{{ detail.label }}</span>
          <span :class="detail.valueClass">{{ detail.value }}</span>
        </div>
        <div class="border-t border-gray-300 pt-2 mb-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Angka BMI Anak</span>
            <a class="text-gray-600 flex items-center">
              <i class="fas fa-file-pdf mr-2"></i>
              {{ checkup?.bmi }}
            </a>
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
      </div>
      <div class="flex justify-between">
        <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
        <n-button type="primary" @click="$emit('close')">Selesai</n-button>
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
