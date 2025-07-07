<script setup lang="ts">
import { useUserChildRegistration } from '@/services/child'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import {
  X,
  User,
  MapPin,
  Calendar,
  Hash,
  Droplets,
  Ruler,
  Weight,
  Users,
  Camera,
  FileText,
  IdCard,
  Save,
  ArrowLeft,
  Baby,
  Upload,
  Eye
} from 'lucide-vue-next'

// Definisikan tipe data untuk form
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

type FormData = {
  name?: string
  placeOfBirth?: string
  address?: string
  dateOfBirth?: number
  childOrder?: number
  bloodType?: string
  height?: number
  weight?: number
  gender?: Gender
  childPicture?: string
  birthCertificate?: string
  kiaCard?: string
  familyCard?: string
}

// Data form yang akan digunakan
const formData = ref<FormData>({
  name: undefined,
  placeOfBirth: undefined,
  address: undefined,
  dateOfBirth: undefined,
  childOrder: undefined,
  bloodType: undefined,
  height: undefined,
  weight: undefined,
  gender: undefined,
  childPicture: undefined,
  birthCertificate: undefined,
  kiaCard: undefined,
  familyCard: undefined
})

// Referensi untuk form
const formRef = ref<FormInst>()
const message = useMessage()

// Mengambil fungsi mutate untuk pendaftaran anak
const { mutate, isPending } = useUserChildRegistration()

defineEmits(['close'])

// Fungsi untuk submit form
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate({
        ...formData.value,
        dateOfBirth: DateTime.fromMillis(formData.value.dateOfBirth || 0).toISO()
      })
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

// Aturan validasi
const rules: FormRules = {
  name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
  address: [{ type: 'string', required: true, message: 'Alamat wajib diisi' }],
  placeOfBirth: [{ type: 'string', required: true, message: 'Tempat Lahir wajib diisi' }],
  dateOfBirth: [{ type: 'number', required: true, message: 'Tanggal Lahir wajib diisi' }],
  childOrder: [
    { type: 'number', required: true, message: 'Urutan Anak wajib diisi' },
    { type: 'number', min: 1, max: 99, message: 'Urutan Anak harus antara 1 hingga 99' }
  ],
  bloodType: [{ type: 'string', required: false, message: 'Golongan Darah tidak wajib diisi' }],
  height: [{ type: 'number', required: true, message: 'Tinggi Badan wajib diisi' }],
  weight: [{ type: 'number', required: true, message: 'Berat Badan wajib diisi' }],
  gender: [
    {
      type: 'enum',
      enum: [Gender.MALE, Gender.FEMALE],
      required: true,
      message: 'Wajib memilih gender'
    }
  ],
  childPicture: [{ type: 'string', required: false, message: 'Foto Anak wajib diisi' }],
  birthCertificate: [{ type: 'string', required: false, message: 'Akte Kelahiran wajib diisi' }],
  kiaCard: [{ type: 'string', required: false, message: 'Identitas Anak wajib diisi' }],
  familyCard: [{ type: 'string', required: false, message: 'Kartu Keluarga wajib diisi' }]
}

// Opsi untuk dropdown
const options = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'AB', value: 'AB' },
  { label: 'O', value: 'O' }
]

const optionsGender = [
  { label: 'Laki-laki', value: Gender.MALE },
  { label: 'Perempuan', value: Gender.FEMALE }
]

// File upload handlers
const handleChildPictureUpload = (options: Required<UploadFileInfo>[]) => {
  const file = options[0]?.file
  if (file) {
    fileToBase64(file as File).then((result) => {
      formData.value.childPicture = result
    })
  }
}

const handleBirthCertificateUpload = (options: Required<UploadFileInfo>[]) => {
  const file = options[0]?.file
  if (file) {
    fileToBase64(file as File).then((result) => {
      formData.value.birthCertificate = result
    })
  }
}

const handleKiaCardUpload = (options: Required<UploadFileInfo>[]) => {
  const file = options[0]?.file
  if (file) {
    fileToBase64(file as File).then((result) => {
      formData.value.kiaCard = result
    })
  }
}

const openWindow = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div
        class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100"
      >
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <Baby class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Pendaftaran Anak</h2>
            <p class="text-sm text-gray-600 mt-1">Lengkapi data anak untuk mendaftar</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6">
          <n-form
            class="space-y-6"
            @submit.prevent="handleSubmit"
            ref="formRef"
            :model="formData"
            :rules="rules"
          >
            <!-- Personal Information Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User class="w-5 h-5 text-blue-600" />
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

              <!-- Address and Gender Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <!-- Gender -->
                <n-form-item label="Jenis Kelamin" path="gender">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Users class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-select
                        v-model:value="formData.gender"
                        :options="optionsGender"
                        placeholder="Pilih jenis kelamin"
                        class="pl-10"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Jenis kelamin anak</p>
                  </div>
                </n-form-item>
              </div>
            </div>

            <!-- Birth Information Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar class="w-5 h-5 text-blue-600" />
                Informasi Kelahiran
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            <!-- Physical Information Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Ruler class="w-5 h-5 text-orange-600" />
                Informasi Fisik
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <p class="text-xs text-gray-500 mt-1">Golongan darah anak (opsional)</p>
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
            </div>

            <!-- Documents Section -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText class="w-5 h-5 text-purple-600" />
                Dokumen Pendukung
              </h3>

              <!-- Child Picture -->
              <n-form-item label="Foto Anak" path="childPicture">
                <div class="w-full">
                  <!-- Preview if uploaded -->
                  <div v-if="formData.childPicture" class="mb-4">
                    <img
                      :src="formData.childPicture"
                      alt="Foto Anak"
                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                    <p class="text-xs text-blue-600 mt-2 font-medium">✓ Foto berhasil diunggah</p>
                  </div>

                  <!-- Upload Area -->
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-200"
                  >
                    <n-upload
                      accept="image/*"
                      :max="1"
                      @update-file-list="handleChildPictureUpload"
                    >
                      <div class="text-center">
                        <div
                          class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3"
                        >
                          <Camera class="w-6 h-6 text-blue-600" />
                        </div>
                        <n-button type="primary" class="mb-2">
                          <template #icon>
                            <Upload class="w-4 h-4" />
                          </template>
                          {{ formData.childPicture ? 'Ganti Foto' : 'Upload Foto Anak' }}
                        </n-button>
                        <p class="text-sm text-gray-500">Format: JPG, PNG (Max: 5MB)</p>
                      </div>
                    </n-upload>
                  </div>
                </div>
              </n-form-item>

              <!-- Birth Certificate -->
              <n-form-item label="Akta Kelahiran" path="birthCertificate">
                <div class="w-full">
                  <!-- Preview if uploaded -->
                  <div v-if="formData.birthCertificate" class="mb-4">
                    <div
                      class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div class="p-2 bg-blue-100 rounded-lg">
                        <FileText class="w-5 h-5 text-blue-600" />
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-blue-900">Akta Kelahiran</p>
                        <p class="text-xs text-blue-600">File berhasil diunggah</p>
                      </div>
                      <button
                        @click="openWindow(formData.birthCertificate)"
                        class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Upload Area -->
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-200"
                  >
                    <n-upload
                      accept=".pdf"
                      :max="1"
                      @update-file-list="handleBirthCertificateUpload"
                    >
                      <div class="text-center">
                        <div
                          class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3"
                        >
                          <FileText class="w-6 h-6 text-blue-600" />
                        </div>
                        <n-button type="primary" class="mb-2">
                          <template #icon>
                            <Upload class="w-4 h-4" />
                          </template>
                          {{ formData.birthCertificate ? 'Ganti Akta' : 'Upload Akta Kelahiran' }}
                        </n-button>
                        <p class="text-sm text-gray-500">Format: PDF (Max: 5MB)</p>
                      </div>
                    </n-upload>
                  </div>
                </div>
              </n-form-item>

              <!-- KIA Card -->
              <n-form-item label="Kartu Identitas Anak (KIA)" path="kiaCard">
                <div class="w-full">
                  <!-- Preview if uploaded -->
                  <div v-if="formData.kiaCard" class="mb-4">
                    <div
                      class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <div class="p-2 bg-purple-100 rounded-lg">
                        <IdCard class="w-5 h-5 text-purple-600" />
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-purple-900">Kartu Identitas Anak</p>
                        <p class="text-xs text-purple-600">File berhasil diunggah</p>
                      </div>
                      <button
                        @click="openWindow(formData.kiaCard)"
                        class="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Upload Area -->
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors duration-200"
                  >
                    <n-upload accept=".pdf" :max="1" @update-file-list="handleKiaCardUpload">
                      <div class="text-center">
                        <div
                          class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3"
                        >
                          <IdCard class="w-6 h-6 text-purple-600" />
                        </div>
                        <n-button type="primary" class="mb-2">
                          <template #icon>
                            <Upload class="w-4 h-4" />
                          </template>
                          {{ formData.kiaCard ? 'Ganti KIA' : 'Upload KIA' }}
                        </n-button>
                        <p class="text-sm text-gray-500">Format: PDF (Max: 5MB)</p>
                      </div>
                    </n-upload>
                  </div>
                </div>
              </n-form-item>

              <!-- BMI Info Card (if height and weight available) -->
              <div
                v-if="formData.height && formData.weight"
                class="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
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
                    <p class="text-sm font-medium text-blue-800">Informasi BMI</p>
                    <p class="text-sm text-blue-700 mt-1">
                      BMI: {{ (formData.weight / (formData.height / 100) ** 2).toFixed(1) }} kg/m²
                    </p>
                  </div>
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
            @click="handleSubmit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Save v-if="!isPending" class="w-4 h-4" />
            <div
              v-if="isPending"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isPending ? 'Menyimpan...' : 'Daftar Anak' }}
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

/* Upload area styling */
:deep(.n-upload-dragger) {
  border: none !important;
  background: transparent !important;
}
</style>
