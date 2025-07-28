<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { useUserElderlyRegistration } from '@/services/elderly'
import { DateTime } from 'luxon'

// Retrieve the mutate function for elderly registration
const { mutate, isPending } = useUserElderlyRegistration()

const queryClient = useQueryClient()

// Define the data type for the form
type FormData = {
  name?: string
  gender?: string
  placeOfBirth?: string
  dateOfBirth?: number
  bloodType?: string
  address?: string
  elderlyPicture?: string
  fileElderlyIdentity?: string
}

// Form data to be used
const formData = ref<FormData>({
  name: undefined,
  gender: undefined,
  placeOfBirth: undefined,
  dateOfBirth: undefined,
  bloodType: undefined,
  address: undefined,
  elderlyPicture: undefined,
  fileElderlyIdentity: undefined
})

// Reference to form
const formRef = ref<FormInst>()
const message = useMessage()

// Function to submit form
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value,
          // Convert dateOfBirth to ISO string if it exists and is a number
          dateOfBirth: formData.value.dateOfBirth ? DateTime.fromMillis(formData.value.dateOfBirth).toISO() : undefined
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.USER_GET_ELDERLY]
            })
            message.success('Data lansia berhasil ditambahkan')
          },
          onError: (error) => {
              console.error('Error submitting form:', error);
              message.error(error.data?.message || 'Gagal menambahkan data lansia');
          }
        }
      )

      return
    }
    message.error('Validasi gagal')
  })
}

// Validation rules
const rules: FormRules = {
  name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
  gender: [{ type: 'string', required: true, message: 'Jenis kelamin wajib diisi' }],
  placeOfBirth: [{ type: 'string', required: true, message: 'Tempat lahir wajib diisi' }],
  dateOfBirth: [{ type: 'number', required: true, message: 'Tanggal lahir wajib diisi' }],
  bloodType: [{ type: 'string', required: true, message: 'Golongan darah wajib diisi' }],
  address: [{ type: 'string', required: true, message: 'Alamat wajib diisi' }],
  elderlyPicture: [{ type: 'string', required: false, message: 'Foto lansia wajib diisi' }],
  fileElderlyIdentity: [{ type: 'string', required: false, message: 'Identitas lansia wajib diisi' }],
}

// Option for Gender dropdown
const genderOptions = [
  { label: 'Laki-laki', value: 'MALE' },
  { label: 'Perempuan', value: 'FEMALE' }
]

// Option for Blood Type dropdown
const bloodOptions = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'AB', value: 'AB' },
  { label: 'O', value: 'O' }
]
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left Side (Form) -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center bg-white">
      <div class="flex justify-center items-center space-x-4 mb-4 mt-6 md:hidden">
        <!-- Logo -->
        <img src="@/assets/images/LOGO.png" alt="Logo" class="h-12 w-auto">
      </div>
      <div class="bg-white p-8 rounded-lg w-full shadow-lg max-w-xl">
        <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Data Lansia
        </h2>
        <p class="text-center font-medium leading-9 text-gray-900">
          Masukkan Data Diri Lansia
        </p>

        <n-form
          class="space-y-6 mt-4"
          @submit.prevent="handleSubmit"
          ref="formRef"
          :model="formData"
          :rules="rules"
        >
          <div>
            <div class="mt-2">
              <n-form-item label="Nama Lengkap" path="name">
                <n-input v-model:value="formData.name" placeholder="Masukkan Nama Lengkap"/>
              </n-form-item>
            </div>
          </div>
          <div>
            <n-form-item label="Jenis Kelamin" path="gender">
              <n-select
                v-model:value="formData.gender"
                :options="genderOptions"
                size="large"
                placeholder="Pilih Jenis Kelamin"
              />
            </n-form-item>
          </div>
          <div class="mt-2">
            <n-form-item label="Tempat Lahir" path="placeOfBirth">
              <n-input v-model:value="formData.placeOfBirth" placeholder="Masukkan Tempat Lahir"/>
            </n-form-item>
          </div>
          <div class="mt-2">
            <n-form-item label="Tanggal Lahir" path="dateOfBirth">
              <n-date-picker
                v-model:value="formData.dateOfBirth"
                name="tanggal_lahir"
                required
                size="large"
                placeholder="Pilih Tanggal Lahir"
              />
            </n-form-item>
          </div>
          <div class="mt-2">
            <n-form-item label="Golongan Darah" path="bloodType">
              <n-select v-model:value="formData.bloodType" :options="bloodOptions" size="large" placeholder="Pilih Golongan Darah"/>
            </n-form-item>
          </div>
          <div class="mt-2">
            <n-form-item label="Alamat" path="address">
              <n-input v-model:value="formData.address" type="textarea" placeholder="Masukkan Alamat Lengkap"/>
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Unggah Foto Lansia" path="elderlyPicture">
              <n-upload
                action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                :headers="{
                  'naive-info': 'hello!'
                }"
                :data="{
                  'naive-data': 'cool! naive!'
                }"
              >
                <n-button class="custom-button">Unggah Gambar</n-button>
              </n-upload>
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Unggah Identitas Lansia" path="fileElderlyIdentity">
              <n-upload
                action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                :headers="{
                  'naive-info': 'hello!'
                }"
                :data="{
                  'naive-data': 'cool! naive!'
                }"
              >
                <n-button class="custom-button">Unggah Gambar</n-button>
              </n-upload>
            </n-form-item>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <n-button type="primary" class="custom-button" :loading="isPending" attr-type="submit">Simpan</n-button>
          </div>
        </n-form>
      </div>
    </div>

    <!-- Right Side (Image) -->
    <div class="w-0 md:w-1/2 hidden md:block fixed top-0 right-0 h-full">
      <img src="@/assets/images/LOGO.png" alt="Placeholder Image" class="h-full w-full object-cover" />
    </div>
  </div>
</template>

<style scoped>
/* Additional styles can be added here if needed */
.custom-button {
  background-color: #0F5BC0 !important;
  border-color: #0F5BC0 !important;
  color: white !important;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
