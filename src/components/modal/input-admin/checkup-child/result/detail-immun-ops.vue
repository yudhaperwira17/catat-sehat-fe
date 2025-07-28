<script setup lang="ts">
import { formatDate } from '@/composable/http/utils'
import { useAdminReadImmunizationOptionalById } from '@/services/admin-immunization'
import { computed } from 'vue'
import { X, User, Syringe, Calendar, FileText, UserCheck, Clock } from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(['close'])

const { data: blood, isError, isLoading } = useAdminReadImmunizationOptionalById(ref(props.id))

const detail = computed(() => blood.value ?? {})

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div
        class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <Syringe class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Detail Imunisasi</h2>
            <p class="text-sm text-gray-600 mt-1">Informasi vaksinasi tambahan</p>
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
          <p class="text-gray-600">Memuat detail imunisasi...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="p-8 text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
          >
            <X class="w-8 h-8 text-red-600" />
          </div>
          <p class="text-red-600 font-medium">Gagal memuat data</p>
          <p class="text-gray-500 text-sm mt-1">Silakan coba lagi nanti</p>
        </div>

        <!-- Content when loaded -->
        <div v-else class="p-6">
          <!-- Child Profile -->
          <div
            class="text-center mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"
          >
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
            >
              <User class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">
              {{ detail.children?.name || 'Nama tidak tersedia' }}
            </h3>
            <p class="text-sm text-green-600 font-medium">Pasien Imunisasi</p>
          </div>

          <!-- Immunization Details -->
          <div class="space-y-4 mb-6">
            <h4 class="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Syringe class="w-5 h-5 text-blue-600" />
              Informasi Vaksinasi
            </h4>

            <div class="space-y-3">
              <!-- Vaccine Name -->
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <Syringe class="w-4 h-4 text-blue-600" />
                    </div>
                    <span class="text-gray-700 font-medium">Nama Vaksin</span>
                  </div>
                  <span class="text-blue-700 font-semibold">{{ detail?.name || '-' }}</span>
                </div>
              </div>

              <!-- Age Given -->
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar class="w-4 h-4 text-blue-600" />
                    </div>
                    <span class="text-gray-700 font-medium">Umur Pemberian</span>
                  </div>
                  <span class="text-blue-700 font-semibold"
                    >{{ detail?.dateGiven || '-' }} bulan</span
                  >
                </div>
              </div>

              <!-- Mother Name -->
              <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <UserCheck class="w-4 h-4 text-green-600" />
                    </div>
                    <span class="text-gray-700 font-medium">Nama Ibu</span>
                  </div>
                  <span class="text-green-700 font-semibold text-right">{{
                    detail?.children?.mother?.name || '-'
                  }}</span>
                </div>
              </div>

              <!-- Date -->
              <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <Clock class="w-4 h-4 text-orange-600" />
                    </div>
                    <span class="text-gray-700 font-medium">Tanggal Pencatatan</span>
                  </div>
                  <span class="text-orange-700 font-semibold">{{
                    formatDate(detail.createdAt) || '-'
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <FileText class="w-5 h-5 text-gray-600" />
              Catatan
            </h4>
            <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div class="flex items-start gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm">
                  <FileText class="w-4 h-4 text-gray-600" />
                </div>
                <div class="flex-1">
                  <p class="text-gray-700 leading-relaxed">
                    {{ detail?.note || 'Tidak ada catatan khusus untuk imunisasi ini.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <div class="p-1 bg-blue-100 rounded-full mt-0.5">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-blue-800">Informasi</p>
                <p class="text-sm text-blue-700 mt-1">
                  Data ini merupakan catatan imunisasi tambahan yang diberikan di luar jadwal
                  imunisasi dasar.
                </p>
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
            @click="closeModal"
          >
            Kembali
          </n-button>
          <n-button
            type="primary"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            @click="closeModal"
          >
            Selesai
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

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
