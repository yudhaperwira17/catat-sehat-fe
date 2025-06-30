<script setup lang="ts">
import { useReadDetailReportById } from '@/services/report-stunting';
import { computed } from 'vue';

// Define props for the component
const props = defineProps<{
  id: string
}>()

const { data: report } = useReadDetailReportById(computed(() => props.id))

defineEmits(['close'])

// Fungsi untuk menutup laporan (misalnya kembali ke halaman sebelumnya)


// Fungsi untuk tombol kembali
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-screen max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Laporan Stunting</h2>
        <!-- Tombol close dihapus sementara -->
      </div>
      <div class="text-center mb-6">
        <h3 class="text-xl font-semibold">Terimakasih atas laporan Anda</h3>
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
          <span class="text-gray-600">No Telepon</span>
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
          <span class="text-pink-500">{{ report?.observation }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Dokumen</span>
          <div class="flex space-x-2">
            <div>
              <a
                v-if="report?.fileChildPicture?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="report.fileChildPicture.path"
                target="_blank"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                Foto Anak
              </a>
            </div>
            <div>
              <a
                v-if="report?.fileHousePicture?.path"
                class="flex items-center text-blue-500 hover:text-blue-700"
                :href="report.fileHousePicture.path"
                target="_blank"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                Foto Rumah
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <n-button
          type="tertiary"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          @click="$emit('close')"
        >
          Kembali
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styling jika diperlukan */
</style>
<route lang="yaml">
meta:
  layout: blank
</route>
