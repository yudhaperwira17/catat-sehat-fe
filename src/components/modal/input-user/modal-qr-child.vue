<script setup lang="ts">
import { userReadChildById } from '@/services/child'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  id: string
}>()

const { data: child, refetch: refetchChild } = userReadChildById(computed(() => props.id))

const qrCode = ref<string>('') // Initialize QR code as an empty string

// Function to fetch the QR code from the database
const fetchQRCode = async () => {
  try {
    const response = await axios.get('URL_API_ANDA') // Replace with your API URL
    qrCode.value = response.data.qrCode // Adjust according to the data structure received
  } catch (error) {
    console.error('Error fetching QR code:', error)
  }
}

// Function to refresh child details when recreating the QR code
const refreshChildDetails = async () => {
  try {
    await refetchChild() // Call refetch function to reload child details
    console.log('Child details refreshed')
  } catch (error) {
    console.error('Error refreshing child details:', error)
  }
}

// Lifecycle hook to call fetchQRCode when the component is mounted
onMounted(() => {
  fetchQRCode()
})

// Additional methods as standalone functions

const goBack = () => {
  console.log('Go back')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">QR Pemeriksaan Anak</h2>
        <hr class="absolute left-0 right-0 top-full border-t border-gray-800" />
      </div>
      <div class="flex flex-col items-center">
        <img
          class="rounded-full mb-4"
          :src="
            child?.childPicture?.path || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          width="50"
          height="50"
        />
        <div class="flex items-center mr-6">
          <div class="flex flex-col items-center justify-center">
            <n-qr-code :value="child?.url" class="mb-2" />
            <!-- <p class="mt-4 ml-4">{{ child?.code }}</p> -->
          </div>
        </div>

        <h3 class="text-lg font-semibold mb-2 mt-4">{{ child?.name }}</h3>
        <div class="text-sm text-gray-600 mb-2">
          <span>
            Umur
            <span class="text-pink-500">{{ child?.age }}</span>
          </span>
          |
          <span>Golongan Darah {{ child?.bloodType }}</span>
        </div>
        <div class="text-sm text-gray-600 mb-4">
          <span>
            Tinggi Badan
            <span class="text-pink-500">{{ child?.height }}</span>
          </span>
          |
          <span>
            Berat Badan
            <span class="text-pink-500">{{ child?.weight }}</span>
          </span>
        </div>
        <div class="flex justify-between w-full">
          <n-button type="tertiary" @click="$emit('close')"> Kembali </n-button>

          <n-button type="primary" @click="refreshChildDetails"> Buat Ulang QR </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Jika ada gaya khusus, tambahkan di sini */
</style>
