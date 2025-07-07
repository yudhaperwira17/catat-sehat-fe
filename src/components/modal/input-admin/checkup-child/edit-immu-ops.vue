<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import router from '@/router'
import {
  useAdminPutImmunizationOptional,
  useAdminReadImmunizationOptionalById
} from '@/services/admin-immunization'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import { X, User, Syringe, Calendar, FileText, Save, ArrowLeft, Edit } from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { data: checkupChild, isLoading } = useAdminReadImmunizationOptionalById(
  computed(() => props.id)
)
const { mutate, isPending } = useAdminPutImmunizationOptional(computed(() => props.id))

type FormData = {
  childrenId?: string
  name?: string
  dateGiven?: number
  note?: string
}

const formData = ref<FormData>({
  childrenId: undefined,
  name: undefined,
  dateGiven: undefined,
  note: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const queryClient = useQueryClient()
const childName = ref('')

const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_OPTIONAL_IMMUNIZATION]
            })
            message.success('Data imunisasi berhasil diperbarui!')
            emit('close')
            router.push('/admin/immunization-optional')
          },
          onError: () => {
            message.error('Update Data gagal')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

const rules: FormRules = {
  name: [{ required: true, message: 'Nama vaksin wajib diisi' }],
  dateGiven: [{ type: 'number', required: true, message: 'Umur pemberian wajib diisi' }],
  childrenId: [{ required: true, message: 'Data anak diperlukan' }]
}

const closeForm = () => {
  emit('close')
}

watchEffect(() => {
  if (checkupChild.value) {
    formData.value.childrenId = checkupChild.value.children.id
    childName.value = checkupChild.value.children.name
    formData.value.name = checkupChild.value.name
    formData.value.dateGiven = checkupChild.value.dateGiven
    formData.value.note = checkupChild.value.note
  }
})

// Common vaccine options for better UX
const commonVaccines = [
  'Varicella (Cacar Air)',
  'Influenza',
  'Meningokokus',
  'Tifoid',
  'DTP (Difteri, Tetanus, Pertusis)'
]
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div
        class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100"
      >
        <button
          @click="closeForm"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <Edit class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Edit Imunisasi Tambahan</h2>
            <p class="text-sm text-gray-600 mt-1">Perbarui data vaksinasi tambahan untuk anak</p>
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
          <p class="text-gray-600">Memuat data imunisasi...</p>
        </div>

        <!-- Content when loaded -->
        <div v-else class="p-6">
          <!-- Child Info Card -->
          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <User class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-green-600 font-medium">Nama Anak</p>
                <p class="text-lg font-semibold text-green-800">{{ childName || 'Memuat...' }}</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <n-form
            class="space-y-6"
            @submit.prevent="submitForm"
            ref="formRef"
            :model="formData"
            :rules="rules"
          >
            <!-- Hidden field for childrenId -->
            <n-form-item path="childrenId" style="display: none">
              <n-input v-model:value="formData.childrenId" />
            </n-form-item>

            <!-- Immunization Details Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Syringe class="w-5 h-5 text-blue-600" />
                Detail Imunisasi
              </h3>

              <!-- Vaccine Name -->
              <n-form-item label="Nama Vaksin" path="name">
                <div class="w-full space-y-3">
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Syringe class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input
                      v-model:value="formData.name"
                      placeholder="Masukkan nama vaksin"
                      class="pl-10"
                    />
                  </div>

                  <!-- Common Vaccines Quick Select -->
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-2 font-medium">Vaksin Umum:</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="vaccine in commonVaccines"
                        :key="vaccine"
                        type="button"
                        @click="formData.name = vaccine"
                        class="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors duration-200"
                      >
                        {{ vaccine }}
                      </button>
                    </div>
                  </div>
                </div>
              </n-form-item>

              <!-- Age Given -->
              <n-form-item label="Umur Pemberian" path="dateGiven">
                <div class="w-full">
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Calendar class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input-number
                      v-model:value="formData.dateGiven"
                      placeholder="Masukkan umur pemberian"
                      class="pl-10"
                      :min="0"
                      :max="216"
                      :precision="0"
                    >
                      <template #suffix>
                        <span class="text-gray-500 text-sm">bulan</span>
                      </template>
                    </n-input-number>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Umur anak saat vaksin diberikan (dalam bulan)
                  </p>
                </div>
              </n-form-item>

              <!-- Notes -->
              <n-form-item label="Catatan" path="note">
                <div class="w-full">
                  <div class="relative">
                    <div class="absolute left-3 top-3">
                      <FileText class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input
                      v-model:value="formData.note"
                      type="textarea"
                      placeholder="Tambahkan catatan khusus (opsional)"
                      class="pl-10"
                      :rows="3"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Contoh: reaksi setelah vaksin, lokasi pemberian, dll.
                  </p>
                </div>
              </n-form-item>
            </div>

            <!-- Info Box -->
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="p-1 bg-orange-100 rounded-full mt-0.5">
                  <svg class="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-orange-800">Perhatian</p>
                  <p class="text-sm text-orange-700 mt-1">
                    Pastikan data yang diperbarui sudah benar. Perubahan ini akan mempengaruhi rekam
                    medis anak dan tidak dapat dibatalkan dengan mudah.
                  </p>
                </div>
              </div>
            </div>
          </n-form>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 p-6 bg-gray-50">
        <div class="flex justify-between gap-3">
          <n-button
            type="tertiary"
            class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
            @click="closeForm"
          >
            <ArrowLeft class="w-4 h-4" />
            Kembali
          </n-button>
          <n-button
            type="primary"
            :loading="isPending"
            @click="submitForm"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Save v-if="!isPending" class="w-4 h-4" />
            <div
              v-if="isPending"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isPending ? 'Menyimpan...' : 'Simpan Perubahan' }}
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

/* Custom styling for input with icons */
:deep(.n-input .n-input__input-el) {
  padding-left: 2.5rem;
}

:deep(.n-input-number .n-input__input-el) {
  padding-left: 2.5rem;
}

:deep(.n-input--textarea .n-input__input-el) {
  padding-left: 2.5rem;
}
</style>
