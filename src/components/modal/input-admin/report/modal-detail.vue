<script setup lang="ts">
import { useAdminReadDetailReportById } from '@/services/admin-report'
import { computed } from 'vue'
import { X, User, Phone, Baby, MapPin, FileText, Image, Home, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(['close'])

const { data: report, isLoading } = useAdminReadDetailReportById(computed(() => props.id))
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <FileText class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Detail Laporan Stunting</h2>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <div
            class="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-600">Memuat detail laporan...</p>
        </div>

        <!-- Content when loaded -->
        <div v-else class="p-6">
          <!-- Jika status PENDING -->
          <div
            v-if="report.status === 'PENDING'"
            class="text-center mb-8 p-6 bg-yellow-50 rounded-xl border border-yellow-100"
          >
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4"
            >
              <CheckCircle class="w-8 h-8 text-yellow-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Laporan Diterima</h3>
            <p class="text-sm text-gray-600">
              Laporan dari user telah diterima, mohon segera ditindaklanjuti.
            </p>
          </div>

          <!-- Jika status RESOLVED -->
          <div
            v-else-if="report.status === 'RESOLVED'"
            class="text-center mb-8 p-6 bg-green-50 rounded-xl border border-green-100"
          >
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
            >
              <CheckCircle class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Laporan Diselesaikan</h3>
            <p class="text-sm text-gray-600">
              Laporan telah selesai ditangani. Terima kasih atas tindak lanjutnya.
            </p>
          </div>

          <!-- Tambahan: Jika status lain / tidak dikenal -->
          <div v-else class="text-center mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
            >
              <CheckCircle class="w-8 h-8 text-gray-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Status Tidak Dikenal</h3>
            <p class="text-sm text-gray-600">
              Status laporan tidak dapat dikenali. Silakan periksa kembali.
            </p>
          </div>

          <!-- Report Details -->
          <div class="space-y-6">
            <!-- Reporter Information -->
            <div class="bg-gray-50 rounded-xl p-5">
              <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User class="w-4 h-4 text-gray-600" />
                Informasi Pelapor
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between items-start">
                  <span class="text-gray-600 text-sm font-medium">Nama Pelapor</span>
                  <span class="text-blue-600 font-medium text-right">{{
                    report?.reporter || '-'
                  }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-gray-600 text-sm font-medium flex items-center gap-1">
                    <Phone class="w-3 h-3" />
                    Nomor Telepon
                  </span>
                  <span class="text-blue-600 font-medium text-right">{{
                    report?.phoneNumber || '-'
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Child Information -->
            <div class="bg-blue-50 rounded-xl p-5">
              <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Baby class="w-4 h-4 text-blue-600" />
                Informasi Anak
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between items-start">
                  <span class="text-gray-600 text-sm font-medium">Nama Anak</span>
                  <span class="text-blue-600 font-medium text-right">{{
                    report?.childName || '-'
                  }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-gray-600 text-sm font-medium flex items-center gap-1">
                    <MapPin class="w-3 h-3" />
                    Alamat
                  </span>
                  <span class="text-blue-600 font-medium text-right max-w-xs">{{
                    report?.childAddress || '-'
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Observation -->
            <div class="bg-orange-50 rounded-xl p-5">
              <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FileText class="w-4 h-4 text-orange-600" />
                Hasil Observasi
              </h4>
              <div class="bg-white rounded-lg p-4 border border-orange-100">
                <p class="text-gray-700 leading-relaxed">
                  {{ report?.observation || 'Tidak ada observasi' }}
                </p>
              </div>
            </div>

            <!-- Documents -->
            <div class="bg-purple-50 rounded-xl p-5">
              <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Image class="w-4 h-4 text-purple-600" />
                Dokumen Pendukung
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- House Picture -->
                <div class="bg-white rounded-lg p-4 border border-purple-100">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Home class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-medium text-gray-700">Foto Rumah</span>
                    </div>
                    <a
                      v-if="report?.fileHousePicture?.path"
                      :href="report.fileHousePicture.path"
                      target="_blank"
                      class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      <Image class="w-3 h-3" />
                      Lihat
                    </a>
                    <span v-else class="text-gray-400 text-sm italic">Tidak ada</span>
                  </div>
                </div>

                <!-- Child Picture -->
                <div class="bg-white rounded-lg p-4 border border-purple-100">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Baby class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-medium text-gray-700">Foto Anak</span>
                    </div>
                    <a
                      v-if="report?.fileChildPicture?.path"
                      :href="report.fileChildPicture.path"
                      target="_blank"
                      class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      <Image class="w-3 h-3" />
                      Lihat
                    </a>
                    <span v-else class="text-gray-400 text-sm italic">Tidak ada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 p-6 bg-gray-50">
        <div class="flex justify-between gap-3">
          <n-button
            type="tertiary"
            class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            @click="emit('close')"
          >
            Kembali
          </n-button>
          <n-button
            type="primary"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            @click="emit('close')"
          >
            Selesai
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-white {
  animation: fadeIn 0.3s ease-out;
}
</style>

