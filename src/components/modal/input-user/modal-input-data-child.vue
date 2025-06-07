<script setup lang="ts">
import { useUserChildRegistration } from '@/services/child'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'

import { DateTime } from 'luxon'

// Mengambil fungsi mutate untuk pendaftaran anak
const { mutate, isPending } = useUserChildRegistration()

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

defineEmits(['close'])

// Referensi untuk form
const formRef = ref<FormInst>()
const message = useMessage()

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
      enum: [Gender.MALE, Gender.FEMALE], // Definisikan pilihan sebagai array dari nilai enum
      required: true,
      message: 'Wajib memilih gender'
    }
  ],
  childPicture: [{ type: 'string', required: false, message: 'Foto Anak wajib diisi' }],
  birthCertificate: [
    { type: 'string', required: false, message: 'Akte Kelahiran wajib diisi' }
  ],
  kiaCard: [{ type: 'string', required: false, message: 'Identitas Anak wajib diisi' }],
  familyCard: [{ type: 'string', required: false, message: 'Kartu Keluarga wajib diisi' }]
}

// Opsi untuk dropdown Golongan Darah
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
</script>

<template>
  <div class="flex items-center justify-center mt-6 mb-6">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <n-form
        class="space-y-2 mt-4"
        @submit.prevent="handleSubmit"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <!-- Nama -->
        <div>
          <div class="mt-2">
            <n-form-item label="Nama Lengkap" path="name">
              <n-input v-model:value="formData.name" placeholder="Masukan Nama Lengkap" />
            </n-form-item>
          </div>
        </div>

        <div class="flex justify-between items-center gap-4">
          <div class="w-1/2">
            <n-form-item label="Alamat" path="address">
              <n-input
                v-model:value="formData.address"
                name="Alamat"
                placeholder="Masukan Alamat Rumah"
                required
              />
            </n-form-item>
          </div>

          <div class="w-1/2">
            <n-form-item label="Jenis Kelamin" path="gender">
              <n-select
                v-model:value="formData.gender"
                :options="optionsGender"
                placeholder="Pilih Jenis Kelamin"
              />
            </n-form-item>
          </div>
        </div>

        <!-- Tempat Lahir dan Tanggal Lahir (Dibuat Sebaris) -->
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <!-- Tempat Lahir -->
          <div class="w-full md:w-1/2">
            <div class="flex items-center justify-between"></div>
            <div class="mt-2">
              <n-form-item label="Tempat Lahir" path="placeOfBirth">
                <n-input
                  v-model:value="formData.placeOfBirth"
                  size="large"
                  placeholder="Tempat Lahir"
                  filterable
                />
              </n-form-item>
            </div>
          </div>

          <!-- Tanggal Lahir -->
          <div class="w-full md:w-1/2">
            <div class="flex items-center justify-between"></div>
            <div class="mt-2">
              <n-form-item label="Tanggal Lahir" path="dateOfBirth">
                <n-date-picker
                  v-model:value="formData.dateOfBirth"
                  name="tanggal_lahir"
                  placeholder="Tanggal Lahir"
                  required
                  size="large"
                  class="w-full"
                />
              </n-form-item>
            </div>
          </div>

          <div class="w-full md:w-1/2">
            <div class="mt-2">
              <n-form-item label="Anak Ke" path="childOrder">
                <n-input-number
                  v-model:value="formData.childOrder"
                  placeholder="Anak Ke"
                  :min="1"
                  :max="99"
                  required
                  size="large"
                  class="w-full"
              /></n-form-item>
            </div>
          </div>
        </div>

        <!-- Golongan Darah, Tinggi Badan, dan Berat Badan (Dibuat Sebaris) -->
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <!-- Golongan Darah -->
          <div class="w-full md:w-1/3">
            <div class="mt-2">
              <n-form-item label="Golongan Darah" path="bloodType">
                <n-select
                  v-model:value="formData.bloodType"
                  :options="options"
                  placeholder="Golongan Darah"
                  size="large"
                />
              </n-form-item>
            </div>
          </div>

          <!-- Tinggi Badan -->
          <div class="w-full md:w-1/3">
            <div class="mt-2">
              <n-form-item label="Tinggi Badan (cm)" path="height">
                <n-input-number
                  v-model:value="formData.height"
                  placeholder="Tinggi Badan"
                  required
                  size="large"
                  class="w-full"
                />
              </n-form-item>
            </div>
          </div>

          <!-- Berat Badan -->
          <div class="w-full md:w-1/3">
            <div class="mt-2">
              <n-form-item label="Berat Badan (kg)" path="weight">
                <n-input-number
                  v-model:value="formData.weight"
                  placeholder="Berat Badan"
                  required
                  size="large"
                  class="w-full"
                />
              </n-form-item>
            </div>
          </div>
        </div>

        <div>
          <n-form-item label="Unggah Foto Anak" path="fotoanak">
            <n-upload
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  // file to base64
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.childPicture = result
                  })
                }
              "
            >
              <n-button v-model:value="formData.childPicture">Unggah File</n-button>
            </n-upload>
          </n-form-item>
        </div>
        <div>
          <n-form-item label="Unggah Akta Anak" path="aktaanak">
            <n-upload
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  // file to base64
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.birthCertificate = result
                  })
                }
              "
            >
              <n-button v-model:value="formData.birthCertificate">Unggah File</n-button>
            </n-upload>
          </n-form-item>
        </div>
        <div>
          <n-form-item label="Unggah Kartu Keluarga Anak" path="kartukeluarga">
            <n-upload
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  // file to base64
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.familyCard = result
                  })
                }
              "
            >
              <n-button v-model="formData.familyCard">Unggah File</n-button>
            </n-upload>
          </n-form-item>
        </div>
        <div>
          <n-form-item label="Unggah KIA" path="kia">
            <n-upload
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  // file to base64
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.kiaCard = result
                  })
                }
              "
            >
              <n-button v-modal:value="formData.kiaCard">Unggah File</n-button>
            </n-upload>
          </n-form-item>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" :loading="isPending" attr-type="submit">Simpan</n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>
