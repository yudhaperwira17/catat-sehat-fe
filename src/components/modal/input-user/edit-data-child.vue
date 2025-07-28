<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useUserPutChild, userReadChildById } from '@/services/child'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import {
  X,
  User,
  MapPin,
  Calendar,
  Hash,
  Droplets,
  Ruler,
  Weight,
  Save,
  ArrowLeft,
  Edit
} from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(['close'])

const queryClient = useQueryClient()
const formRef = ref<FormInst>()
const message = useMessage()

const { data: child } = userReadChildById(computed(() => props.id))
const { mutate, isPending } = useUserPutChild(computed(() => props.id))

// Definisikan tipe data untuk form
type FormData = {
  name?: string
  address?: string
  placeOfBirth?: string
  dateOfBirth?: number
  childOrder?: number
  bloodType?: string
  height?: number
  weight?: number
}

// Data form yang akan digunakan
const formData = ref<FormData>({
  name: undefined,
  address: undefined,
  placeOfBirth: undefined,
  dateOfBirth: undefined,
  childOrder: undefined,
  bloodType: undefined,
  height: undefined,
  weight: undefined
})

const options = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'AB', value: 'AB' },
  { label: 'O', value: 'O' }
]

const placeOfBirthOptions = ref([
  { label: 'Jakarta', value: 'Jakarta' },
  { label: 'Bandung', value: 'Bandung' },
  { label: 'Surabaya', value: 'Surabaya' }
])

const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value,
          dateOfBirth: DateTime.fromMillis(formData.value.dateOfBirth || 0).toISO()
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.USER_GET_CHILD]
            })
            message.success('Update Data anak sukses')
            emit('close')
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

watchEffect(() => {
  if (child.value) {
    formData.value.name = child.value.name
    formData.value.address = child.value.address
    formData.value.placeOfBirth = child.value.placeOfBirth
    formData.value.dateOfBirth = DateTime.fromISO(child.value.dateOfBirth).toMillis()
    formData.value.childOrder = child.value.childOrder
    formData.value.bloodType = child.value.bloodType
    formData.value.height = child.value.height
    formData.value.weight = child.value.weight
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
            <h2 class="text-xl font-semibold text-gray-900">Edit Data Anak</h2>
            <p class="text-sm text-gray-600 mt-1">Perbarui informasi data anak</p>
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
                <p class="text-sm font-medium text-blue-600">Data Anak</p>
                <p class="text-blue-800 font-semibold">{{ child?.name || 'Memuat...' }}</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <n-form ref="formRef" :model="formData" @submit.prevent="submitForm" class="space-y-6">
            <!-- Personal Information Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User class="w-5 h-5 text-orange-600" />
                Informasi Pribadi
              </h3>

              <!-- Name -->
              <n-form-item label="Nama Lengkap" path="name">
                <div class="w-full">
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <User class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input
                      v-model:value="formData.name"
                      placeholder="Masukkan nama lengkap anak"
                      class="pl-10"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Nama sesuai dengan dokumen resmi</p>
                </div>
              </n-form-item>

              <!-- Address -->
              <n-form-item label="Alamat" path="address">
                <div class="w-full">
                  <div class="relative">
                    <div class="absolute left-3 top-3">
                      <MapPin class="w-4 h-4 text-gray-400" />
                    </div>
                    <n-input
                      v-model:value="formData.address"
                      type="textarea"
                      placeholder="Masukkan alamat lengkap"
                      class="pl-10"
                      :rows="3"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Alamat tempat tinggal saat ini</p>
                </div>
              </n-form-item>
            </div>

            <!-- Birth Information Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar class="w-5 h-5 text-blue-600" />
                Informasi Kelahiran
              </h3>

              <!-- Desktop View -->
              <div class="hidden md:grid grid-cols-3 gap-6">
                <!-- Place of Birth -->
                <n-form-item label="Tempat Lahir" path="placeOfBirth">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <MapPin class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input
                        v-model:value="formData.placeOfBirth"
                        placeholder="Tempat lahir"
                        class="pl-10"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Kota/kabupaten tempat lahir</p>
                  </div>
                </n-form-item>

                <!-- Date of Birth -->
                <n-form-item label="Tanggal Lahir" path="dateOfBirth">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Calendar class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-date-picker
                        v-model:value="formData.dateOfBirth"
                        placeholder="Pilih tanggal lahir"
                        class="w-full pl-10"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Tanggal lahir anak</p>
                  </div>
                </n-form-item>

                <!-- Child Order -->
                <n-form-item label="Anak Ke" path="childOrder">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Hash class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.childOrder"
                        placeholder="Anak ke-"
                        :min="1"
                        :max="99"
                        class="w-full pl-10"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Urutan anak dalam keluarga</p>
                  </div>
                </n-form-item>
              </div>

              <!-- Mobile View -->
              <div class="md:hidden space-y-4">
                <!-- Place of Birth and Date of Birth Row -->
                <div class="grid grid-cols-2 gap-4">
                  <n-form-item label="Tempat Lahir" path="placeOfBirth">
                    <div class="w-full">
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <MapPin class="w-4 h-4 text-gray-400" />
                        </div>
                        <n-select
                          v-model:value="formData.placeOfBirth"
                          :options="placeOfBirthOptions"
                          placeholder="Tempat lahir"
                          class="pl-10"
                        />
                      </div>
                    </div>
                  </n-form-item>

                  <n-form-item label="Tanggal Lahir" path="dateOfBirth">
                    <div class="w-full">
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <Calendar class="w-4 h-4 text-gray-400" />
                        </div>
                        <n-date-picker
                          v-model:value="formData.dateOfBirth"
                          placeholder="Tanggal lahir"
                          class="w-full pl-10"
                        />
                      </div>
                    </div>
                  </n-form-item>
                </div>

                <!-- Child Order -->
                <n-form-item label="Anak Ke" path="childOrder">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Hash class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.childOrder"
                        placeholder="Anak ke-"
                        :min="1"
                        :max="99"
                        class="w-full pl-10"
                      />
                    </div>
                  </div>
                </n-form-item>
              </div>
            </div>

            <!-- Physical Information Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Ruler class="w-5 h-5 text-green-600" />
                Informasi Fisik
              </h3>

              <!-- Desktop View -->
              <div class="hidden md:grid grid-cols-3 gap-6">
                <!-- Blood Type -->
                <n-form-item label="Golongan Darah" path="bloodType">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Droplets class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-select
                        v-model:value="formData.bloodType"
                        :options="options"
                        placeholder="Pilih golongan darah"
                        class="pl-10"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Golongan darah anak</p>
                  </div>
                </n-form-item>

                <!-- Height -->
                <n-form-item label="Tinggi Badan (cm)" path="height">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Ruler class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input-number
                        v-model:value="formData.height"
                        placeholder="Tinggi badan"
                        class="w-full pl-10"
                        :min="0"
                        :max="200"
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
                        placeholder="Berat badan"
                        class="w-full pl-10"
                        :min="0"
                        :max="100"
                        :precision="2"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Berat badan dalam kilogram</p>
                  </div>
                </n-form-item>
              </div>

              <!-- Mobile View -->
              <div class="md:hidden space-y-4">
                <!-- Blood Type -->
                <n-form-item label="Golongan Darah" path="bloodType">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Droplets class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-select
                        v-model:value="formData.bloodType"
                        :options="options"
                        placeholder="Pilih golongan darah"
                        class="pl-10"
                      />
                    </div>
                  </div>
                </n-form-item>

                <!-- Height and Weight Row -->
                <div class="grid grid-cols-2 gap-4">
                  <n-form-item label="Tinggi Badan (cm)" path="height">
                    <div class="w-full">
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <Ruler class="w-4 h-4 text-gray-400" />
                        </div>
                        <n-input-number
                          v-model:value="formData.height"
                          placeholder="Tinggi"
                          class="w-full pl-10"
                          :min="0"
                          :max="200"
                        />
                      </div>
                    </div>
                  </n-form-item>

                  <n-form-item label="Berat Badan (kg)" path="weight">
                    <div class="w-full">
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <Weight class="w-4 h-4 text-gray-400" />
                        </div>
                        <n-input-number
                          v-model:value="formData.weight"
                          placeholder="Berat"
                          class="w-full pl-10"
                          :min="0"
                          :max="100"
                          :precision="2"
                        />
                      </div>
                    </div>
                  </n-form-item>
                </div>
              </div>
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

/* Custom styling for inputs with icons */
:deep(.n-input .n-input__input-el) {
  padding-left: 2.5rem;
}

:deep(.n-input-number .n-input .n-input__input-el) {
  padding-left: 2.5rem;
}

:deep(.n-select .n-base-selection .n-base-selection-label) {
  padding-left: 2.5rem;
}

:deep(.n-date-picker .n-input .n-input__input-el) {
  padding-left: 2.5rem;
}

:deep(.n-input--textarea .n-input__input-el) {
  padding-left: 2.5rem;
}
</style>
