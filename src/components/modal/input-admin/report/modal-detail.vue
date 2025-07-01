<script setup lang="ts">
import { useAdminReadDetailReportById } from '@/services/admin-report'
import { computed, ref } from 'vue'

const props = defineProps<{
  id: string
}>()

const { data: report } = useAdminReadDetailReportById(computed(() => props.id))

const emit = defineEmits(['close'])

const show = ref(false)
const openModal = () => {
  show.value = true
}

const closeModal = () => {
  show.value = false
  emit('close')
}
</script>

<template>
  <n-button @click="openModal()">
    <i-flowbite:arrow-up-right-from-square-outline></i-flowbite:arrow-up-right-from-square-outline>
  </n-button>
  <n-modal v-model:show="show">
    <div class="flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-80 md:w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Laporan Stunting</h2>
        </div>
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold">Terimakasih atas Laporan Anda</h3>
          <div class="my-4">
            <img
              class="mx-auto"
              width="100"
              height="100"
              src="https://storage.googleapis.com/a1aa/image/l9zBSXvpwJaoFN5Fvfn2DLz2Qeg7d5tLxsxnKlrC1eSX7pGnA.jpg"
              alt="Shield with check mark icon"
            />
          </div>
        </div>
        <div class="mb-4">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Nama Pelapor</span>
            <span class="text-pink-500">{{ report?.reporter }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Nomor Telepon</span>
            <span class="text-pink-500">{{ report?.phoneNumber }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Nama Anak</span>
            <span class="text-pink-500">{{ report?.childName }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Alamat Anak</span>
            <span class="text-pink-500">{{ report?.childAddress }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Hasil Observasi</span>
            <span class="text-pink-500 text-right">{{ report?.observation }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Dokumen</span>
            <div class="flex space-x-2">
              <a
                v-if="report?.fileHousePicture?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="report.fileHousePicture.path"
                target="_blank"
                ><i class="fas fa-file-pdf mr-2"></i>
                Foto Rumah
              </a>
              <span v-else class="flex items-center text-gray-500 italic">
                <i class="fas fa-file-pdf mr-2"></i>
                -
              </span>
              <a
                v-if="report?.fileChildPicture?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="report.fileChildPicture.path"
                target="_blank"
                ><i class="fas fa-file-pdf mr-2"></i>
                Foto Anak
              </a>
              <span v-else class="flex items-center text-gray-500 italic">
                <i class="fas fa-file-pdf mr-2"></i>
                -
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <n-button
            type="tertiary"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            @click="closeModal"
          >
            Kembali
          </n-button>
          <n-button
            type="primary"
            class="bg-pink-500 text-white px-4 py-2 rounded"
            @click="closeModal"
          >
            Selesai
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style scoped>
/* Custom styling jika diperlukan */
</style>
<route lang="yaml">
meta:
  layout: blank
</route>
