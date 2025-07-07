<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import router from '@/router'
import {
  useAdminEditeCheckupChild,
  useAdminReadCheckupChildById
} from '@/services/admin-checkup-child'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type UploadFileInfo } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import {
  X,
  User,
  Ruler,
  Weight,
  Circle,
  FileText,
  Save,
  ArrowLeft,
  Edit,
  Upload,
  AlertCircle
} from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { data: checkupChild } = useAdminReadCheckupChildById(computed(() => props.id))
const { mutate, isPending } = useAdminEditeCheckupChild(computed(() => props.id))

type FormData = {
  childrenId?: string
  height?: number
  weight?: number
  headCircumference?: number
  fileDiagnosed?: string
}

const formData = ref<FormData>({
  childrenId: undefined,
  height: undefined,
  weight: undefined,
  headCircumference: undefined,
  fileDiagnosed: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const queryClient = useQueryClient()

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
              queryKey: [API.ADMIN_GET_CHECKUP_CHILD]
            })
            emit('close')
            router.push('/admin/checkup-child')
          },
          onError: () => {
            message.error('Update Data anak gagal')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

watchEffect(() => {
  if (checkupChild.value) {
    formData.value.childrenId = checkupChild.value.children.name
    formData.value.height = checkupChild.value.height
    formData.value.weight = checkupChild.value.weight
    formData.value.headCircumference = checkupChild.value.headCircumference
  }
})
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div
        class="relative bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-gray-100"
      >
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-full">
            <Edit class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Edit Pemeriksaan Anak</h2>
            <p class="text-sm text-gray-600 mt-1">Perbarui data hasil pemeriksaan kesehatan anak</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6">
          <!-- Child Info Card -->
          <div
            class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 mb-6 border border-blue-100"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <User class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium">Data Anak</p>
                <p class="text-blue-800 font-semibold">
                  {{ checkupChild?.children?.name || 'Memuat...' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <n-form @submit.prevent="submitForm" class="space-y-6" ref="formRef" :model="formData">
            <!-- Child Name (Read-only) -->
            <n-form-item label="Nama Anak" path="childrenId">
              <div class="w-full">
                <div class="relative">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <User class="w-4 h-4 text-gray-400" />
                  </div>
                  <n-input
                    v-model:value="formData.childrenId"
                    readonly
                    placeholder="Nama Anak"
                    class="pl-10 bg-gray-50"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1">Nama anak tidak dapat diubah</p>
              </div>
            </n-form-item>

            <!-- Measurements Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Ruler class="w-5 h-5 text-orange-600" />
                Pengukuran Fisik
              </h3>

              <!-- Height and Weight Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Height -->
                <n-form-item label="Tinggi Badan (cm)" path="height">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Ruler class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.height"
                        placeholder="Masukkan tinggi badan"
                        class="pl-10"
                        :min="0"
                        :max="200"
                        :precision="1"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Tinggi badan dalam sentimeter</p>
                  </div>
                </n-form-item>

                <!-- Weight -->
                <n-form-item label="Berat Badan (kg)" path="weight">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Weight class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.weight"
                        placeholder="Masukkan berat badan"
                        class="pl-10"
                        :min="0"
                        :max="100"
                        :precision="2"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Berat badan dalam kilogram</p>
                  </div>
                </n-form-item>
              </div>

              <!-- Head Circumference -->
              <n-form-item label="Lingkar Kepala (cm)" path="headCircumference">
                <div class="w-full">
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <Circle class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input-number
                      v-model:value="formData.headCircumference"
                      placeholder="Masukkan lingkar kepala"
                      class="pl-10"
                      :min="0"
                      :max="100"
                      :precision="1"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Lingkar kepala dalam sentimeter</p>
                </div>
              </n-form-item>
            </div>

            <!-- Document Upload Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText class="w-5 h-5 text-purple-600" />
                Dokumen Pendukung
              </h3>

              <n-form-item label="Unggah Surat Rujukan" path="fileDiagnosed">
                <div class="w-full">
                  <!-- Upload Info -->
                  <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div class="flex items-start gap-2">
                      <AlertCircle class="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p class="text-sm font-medium text-amber-800">Persyaratan File</p>
                        <p class="text-xs text-amber-700 mt-1">
                          Hanya file berekstensi .pdf yang dapat diunggah (maksimal 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Upload Component -->
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors duration-200"
                  >
                    <n-upload
                      accept=".pdf"
                      :max="1"
                      @update-file-list="
                        (options: Required<UploadFileInfo>[]) => {
                          const file = options[0]?.file
                          if (file) {
                            fileToBase64(file as File).then((result) => {
                              formData.fileDiagnosed = result
                            })
                          }
                        }
                      "
                    >
                      <div class="flex flex-col items-center space-y-3 text-center">
                        <!-- Ikon Upload -->
                        <div
                          class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full"
                        >
                          <Upload class="w-6 h-6 text-purple-600" />
                        </div>

                        <!-- Tombol Upload -->
                        <n-button type="primary">
                          <template #icon>
                            <Upload class="w-4 h-4" />
                          </template>
                          Pilih File PDF
                        </n-button>

                        <!-- Keterangan -->
                        <p class="text-sm text-gray-500">atau seret file ke sini</p>
                      </div>
                    </n-upload>
                  </div>
                </div>
              </n-form-item>
            </div>

            <!-- BMI Info Card (if height and weight available) -->
            <div
              v-if="formData.height && formData.weight"
              class="bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <div class="p-1 bg-green-100 rounded-full mt-0.5">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-green-800">Informasi BMI</p>
                  <p class="text-sm text-green-700 mt-1">
                    BMI: {{ (formData.weight / (formData.height / 100) ** 2).toFixed(1) }} kg/m²
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
            @click="$emit('close')"
          >
            <ArrowLeft class="w-4 h-4" />
            Kembali
          </n-button>
          <n-button
            type="primary"
            :loading="isPending"
            @click="submitForm"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
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
:deep(.n-input-number .n-input .n-input__input-el) {
  padding-left: 2.5rem;
}

:deep(.n-input .n-input__input-el) {
  padding-left: 2.5rem;
}

/* Upload area styling */
:deep(.n-upload-dragger) {
  border: none !important;
  background: transparent !important;
}
</style>
