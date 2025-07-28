<script setup lang="ts">
import { useAdminPutReport } from '@/services/admin-report'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { CheckCircle, X, AlertCircle, FileText } from 'lucide-vue-next'

const message = useMessage()
const queryClient = useQueryClient()

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  close: []
}>()

// State untuk note
const note = ref('')
const isNoteValid = computed(() => note.value.trim().length > 0)

// Gunakan mutation untuk update status
const { mutate, isPending } = useAdminPutReport(computed(() => props.id))

const submitForm = async () => {
  if (!isNoteValid.value) {
    message.warning('Mohon isi tindakan yang dilakukan')
    return
  }

  try {
    // Kirim request dengan body { "status": "RESOLVED", "note": "..." }
    mutate(
      {
        status: 'RESOLVED',
        note: note.value.trim()
      },
      {
        onSuccess: () => {
          message.success('Laporan berhasil ditindaklanjuti!')
          // Invalidate queries untuk refresh data
          queryClient.invalidateQueries({
            queryKey: ['admin-reports'] // sesuaikan dengan query key yang digunakan
          })
          emit('close')
        },
        onError: (error) => {
          console.error('Error updating report:', error)
          message.error('Gagal memperbarui status laporan. Silakan coba lagi.')
        }
      }
    )
  } catch (error) {
    console.error('Submit form error:', error)
    message.error('Terjadi kesalahan. Silakan coba lagi.')
  }
}
</script>

<template>
  <div>
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100"
    >
      <!-- Header -->
      <div class="relative p-6 pb-4">
        <button
          @click="$emit('close')"
          :disabled="isPending"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
        <div class="flex items-center gap-3 mb-2">
          <div class="p-3 bg-orange-100 rounded-full">
            <AlertCircle class="w-6 h-6 text-orange-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Tindak Lanjuti Laporan</h2>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6">
        <div class="mb-6">
          <p class="text-gray-600 text-base leading-relaxed">
            Silakan isi tindakan yang telah dilakukan untuk menyelesaikan laporan ini.
          </p>
        </div>

        <!-- Note Input Field -->
        <div class="mb-6">
          <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <FileText class="w-4 h-4" />
            Tindakan yang Dilakukan
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="note"
            :disabled="isPending"
            placeholder="Jelaskan tindakan yang telah dilakukan untuk menyelesaikan laporan ini..."
            rows="4"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50"
            :class="{
              'border-red-300 focus:ring-red-500': note.length > 0 && !isNoteValid,
              'border-green-300 focus:ring-green-500': isNoteValid
            }"
          ></textarea>
          <div class="flex justify-between items-center mt-2">
            <p v-if="note.length > 0 && !isNoteValid" class="text-xs text-red-500">
              Tindakan yang dilakukan wajib diisi
            </p>
            <p class="text-xs text-gray-500 ml-auto">{{ note.length }}/500 karakter</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="$emit('close')"
            :disabled="isPending"
            class="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
            Batal
          </button>
          <button
            @click="submitForm"
            :disabled="isPending || !isNoteValid"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            :class="{
              'bg-gray-400 hover:bg-gray-400': !isNoteValid && !isPending
            }"
          >
            <CheckCircle v-if="!isPending" class="w-5 h-5" />
            <div
              v-if="isPending"
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isPending ? 'Memproses...' : 'Selesaikan Laporan' }}
          </button>
        </div>

        <!-- Info Text -->
        <p class="text-xs text-gray-500 text-center mt-4">
          Tindakan ini akan mengubah status laporan menjadi "Ditangani" dan menyimpan catatan
          tindakan
        </p>
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

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
