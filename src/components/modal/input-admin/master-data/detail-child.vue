<script setup lang="ts">
import { adminReadChildById } from '@/services/admin-child'
import axios from 'axios'
import { DateTime } from 'luxon'
import { computed, onMounted, ref } from 'vue'


const props = defineProps<{
  id: string
}>()

const { data: child } = adminReadChildById(computed(() => props.id))
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

// Define the types for the data properties

const qrCode = ref<string>('') // Initialize QR code as an empty string

const show = ref(false)
// Function to fetch the QR code from the database
const fetchQRCode = async () => {
  try {
    const response = await axios.get('URL_API_ANDA') // Replace with your API URL
    qrCode.value = response.data.qrCode // Adjust according to the data structure received
  } catch (error) {
    console.error('Error fetching QR code:', error)
  }
}

// Lifecycle hook to call fetchQRCode when the component is mounted
onMounted(() => {
  fetchQRCode()
})


</script>

<template>
  <n-button @click="show = true">
    <i-flowbite:arrow-up-right-from-square-outline></i-flowbite:arrow-up-right-from-square-outline>
  </n-button>
  <n-modal v-model:show="show">
    <div class="flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">QR Pemeriksaan Anak</h2>
          <hr class="absolute left-0 right-0 top-full border-t border-gray-800" />
          <div class="relative">
            <i class="fas fa-times cursor-pointer" @click="closeModal"></i>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <n-image
            class="rounded-full mb-4"
            alt="Gambar Anak"
            :src="
              child?.childPicture?.path || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            "
            width="50"
            height="50"
          />
          <div class="flex items-center mr-6">
            <div class="flex flex-col items-center justify-center">
              <n-qr-code :value="child?.url" class="mb-2" />
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
          <div class="text-sm text-gray-600 mb-2">
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
          <div class="text-sm text-gray-600 mb-2">
            <span
              >Tempat Lahir <span class="text-pink-500">{{ child?.placeOfBirth }}</span></span
            >
          </div>
          <div class="text-sm text-gray-600 mb-6">
            <span>
              Tanggal Lahir
              <span class="text-pink-500">{{
                DateTime.fromISO(child?.dateOfBirth).toFormat('dd LLL yyyy')
              }}</span>
            </span>
            |
            <span>
              Anak ke
              <span class="text-pink-500">{{ child?.childOrder }}</span>
            </span>
          </div>

          <!-- Document Section -->
          <div class="flex justify-between mb-2 w-full">
            <span class="text-gray-600">Dokumen</span>
            <div class="flex space-x-2">
              <a
                v-if="child?.childPicture?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="child.childPicture.path"
                target="_blank"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                Foto Anak
              </a>
              <span v-else class="flex items-center text-gray-500 italic">
                <i class="fas fa-file-pdf mr-2"></i>
                -
              </span>

              <a
                v-if="child?.fileBirthCertificate?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="child.fileBirthCertificate.path"
                target="_blank"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                Akta Anak
              </a>
              <span v-else class="flex items-center text-gray-500 italic">
                <i class="fas fa-file-pdf mr-2"></i>
                -
              </span>

              <a
                v-if="child?.fileFamilyCard?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="child.fileFamilyCard.path"
                target="_blank"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                KK Anak
              </a>
              <span v-else class="flex items-center text-gray-500 italic">
                <i class="fas fa-file-pdf mr-2"></i>
                -
              </span>

              <a
                v-if="child?.fileChildIdentity?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="child.fileChildIdentity.path"
                target="_blank"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                KIA
              </a>
              <span v-else class="flex items-center text-gray-500 italic">
                <i class="fas fa-file-pdf mr-2"></i>
                -
              </span>
            </div>
          </div>

          <!-- <div class="flex flex-row w-full gap-4 justify-end mt-6">
            <n-button type="default" @click="closeModal">Kembali</n-button>
            <n-button type="primary" @click="finish">Selesai</n-button>
          </div> -->
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style scoped>
/* Jika ada gaya khusus, tambahkan di sini */
</style>
