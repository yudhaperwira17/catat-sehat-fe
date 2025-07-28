<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPostCheckupChild } from '@/services/admin-checkup-child'
import { adminCheckupChildByCode } from '@/services/admin-child'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import { X, User, Ruler, Weight, Circle, Save, ArrowLeft } from 'lucide-vue-next'

const queryClient = useQueryClient()
const props = defineProps<{
  code: string
}>()

const { mutate, isPending } = useAdminPostCheckupChild()
const { data: child } = adminCheckupChildByCode(computed(() => props.code))

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
const emit = defineEmits(['close'])

const displayName = computed(() => child.value?.name ?? '')

watchEffect(() => {
  if (child.value) {
    console.log(child.value)
    formData.value.childrenId = child?.value?.id
    formData.value.height = child?.value?.height
    formData.value.weight = child?.value?.weight
  }
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
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
            message.success('Data pemeriksaan berhasil disimpan!')
            emit('close')
          },
          onError: (error) => {
            console.error('Error:', error)
            message.error('Gagal memproses data.')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

const rules: FormRules = {
  height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
  weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
  headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
  fileDiagnosed: [{ type: 'string', required: false, message: 'File wajib diisi' }],
  childrenId: [{ type: 'string', required: true, message: 'Anak wajib diisi' }]
}

const closeForm = () => {
  emit('close')
}
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <button
          @click="closeForm"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <User class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Pemeriksaan Anak</h2>
            <p class="text-sm text-gray-600 mt-1">Input data hasil pemeriksaan kesehatan</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6">
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
                <p class="text-lg font-semibold text-green-800">{{ displayName || 'Memuat...' }}</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <n-form
            class="space-y-6"
            @submit.prevent="handleSubmit"
            ref="formRef"
            :model="formData"
            :rules="rules"
          >
            <!-- Hidden field for childrenId -->
            <n-form-item path="childrenId" style="display: none">
              <n-input v-model:value="formData.childrenId" />
            </n-form-item>

            <!-- Measurement Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Ruler class="w-5 h-5 text-blue-600" />
                Data Pengukuran
              </h3>

              <!-- Height and Weight Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Height -->
                <n-form-item label="Tinggi Badan" path="height">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Ruler class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.height"
                        placeholder="Masukkan tinggi badan"
                        class="pl-10"
                        :min="0"
                        :max="200"
                        :precision="1"
                      >
                        <template #suffix>
                          <span class="text-gray-500 text-sm">cm</span>
                        </template>
                      </n-input-number>
                    </div>
                  </div>
                </n-form-item>

                <!-- Weight -->
                <n-form-item label="Berat Badan" path="weight">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Weight class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.weight"
                        placeholder="Masukkan berat badan"
                        class="pl-10"
                        :min="0"
                        :max="100"
                        :precision="1"
                      >
                        <template #suffix>
                          <span class="text-gray-500 text-sm">kg</span>
                        </template>
                      </n-input-number>
                    </div>
                  </div>
                </n-form-item>
              </div>

              <!-- Head Circumference -->
              <n-form-item label="Lingkar Kepala" path="headCircumference">
                <div class="w-full">
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Circle class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input-number
                      v-model:value="formData.headCircumference"
                      placeholder="Masukkan lingkar kepala"
                      class="pl-10"
                      :min="0"
                      :max="100"
                      :precision="1"
                    >
                      <template #suffix>
                        <span class="text-gray-500 text-sm">cm</span>
                      </template>
                    </n-input-number>
                  </div>
                </div>
              </n-form-item>
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
                  <p class="text-sm font-medium text-blue-800">Informasi Penting</p>
                  <p class="text-sm text-blue-700 mt-1">
                    Pastikan semua pengukuran dilakukan dengan akurat. Data ini akan digunakan untuk
                    menghitung BMI dan menentukan status gizi anak.
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
            @click="handleSubmit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Save v-if="!isPending" class="w-4 h-4" />
            <div
              v-if="isPending"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isPending ? 'Menyimpan...' : 'Simpan Data' }}
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

/* Custom styling for input number with icons */
:deep(.n-input-number .n-input__input-el) {
  padding-left: 2.5rem;
}
</style>
