<script setup lang="ts">
import { useReadParentsById } from '@/services/parents';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

// Define properties
const props = defineProps<{
  id: string
}>()

// Use the service to get parent data by ID
const { data: parent , refetch: refetch } = useReadParentsById(computed(() => props.id))


// State for storing the QR code
const qrCode = ref<string>('')

// Function to fetch the QR code from the database
// async function fetchQRCode() {
//   try {
//     const response = await axios.get('YOUR_API_URL') // Replace with your actual API URL
//     qrCode.value = response.data.qrCode // Adjust based on your data structure
//   } catch (error) {
//     console.error('Error fetching QR code:', error)
//   }
// }

const fetchQRCode = async () => {
  try {
    const response = await axios.get('YOUR_API_URL') // Replace with your actual API URL
    qrCode.value = response.data.qrCode // Adjust based on your data structure
  } catch (error) {
    console.error('Error fetching QR code:', error)
  }
}

const refreshMotherDetails = async () => {
  try {
    await refetch(); // Call refetch function to reload child details
    console.log('Child details refreshed');
  } catch (error) {
    console.error('Error refreshing child details:', error);
  }
};

const formattedDateOfBirth = computed(() => {
  if (parent?.value?.dateOfBirth) {
    const date = new Date(parent.value.dateOfBirth)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return ''
})
// Lifecycle hook to fetch the QR code when the component is mounted
onMounted(() => {
  fetchQRCode()
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">QR Pemeriksaan Ibu</h2>
        <hr class="absolute left-0 right-0 top-full border-t border-gray-800" />
        <div class="relative">
          <i class="fas fa-times cursor-pointer" @click="$emit('close')"></i>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <h3 class="text-lg font-semibold mb-2 mt-4">{{ parent?.name }}</h3>

        <div class="flex items-center mr-6">
          <div class="flex flex-col items-center justify-center">
            <n-qr-code :value="parent?.url" class="mb-2" />
          </div>
        </div>

        <div class="text-sm text-gray-600 mb-2 mt-4">
          <span>
            Tempat Lahir
            <span class="text-primary">{{ parent?.placeOfBirth }}</span>
          </span>
        </div>
        <div class="text-sm text-gray-600 mb-4">
          <span>
            Tanggal Lahir
            <span class="text-primary">{{ formattedDateOfBirth }}</span>
          </span>
        </div>
         <div class="flex justify-between w-full">
          <n-button type="tertiary" @click="$emit('close')"> Kembali </n-button>

          <n-button type="primary" @click="refreshMotherDetails"> Buat Ulang QR </n-button>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Jika ada gaya khusus, tambahkan di sini */
</style>
