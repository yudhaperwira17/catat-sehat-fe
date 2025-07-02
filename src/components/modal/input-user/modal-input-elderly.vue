<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useElderlyCreate } from '@/services/elderly'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'
import { DateTime } from 'luxon'

const { mutate, isPending } = useElderlyCreate()
const queryClient = useQueryClient()

type FormData = {
  id?: string
  name?: string
  gender?: string
  placeOfBirth?: string
  dateOfBirth?: number
  bloodType?: string
  address?: string
  elderlyPicture?: string
  fileElderlyIdentity?: string
}
const formData = ref<FormData>({
  id: undefined,
  name: undefined,
  gender: undefined,
  placeOfBirth: undefined,
  dateOfBirth: undefined,
  bloodType: undefined,
  address: undefined,
  elderlyPicture: undefined,
  fileElderlyIdentity: undefined,
})

const formRef = ref<FormInst>()
const message = useMessage()

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

const emit = defineEmits(['close'])
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const payload: any = {
        name: formData.value.name,
        gender: formData.value.gender,
        placeOfBirth: formData.value.placeOfBirth,
        dateOfBirth: formData.value.dateOfBirth ? DateTime.fromMillis(formData.value.dateOfBirth).toISO() : undefined,
        bloodType: formData.value.bloodType,
        address: formData.value.address,
        elderlyPicture: formData.value.elderlyPicture,
        fileElderlyIdentity: formData.value.fileElderlyIdentity,
      }

      console.log('Final Payload:', payload) // Debug log

      mutate(
        payload,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.USER_GET_ELDERLY]
            })
            emit('close')
            message.success('Data lansia berhasil ditambahkan')
          },
          onError: (error) => {
            console.error('Error submitting admin:', error) // Debug log
            message.error(error.data?.message || 'Gagal menambahkan data lansia')
          }
        }
      )

      return
    }
    message.error('Validasi gagal')
  })
}
</script>

<template>
  <div class="flex items-center justify-center w-full max-w-xl">
    <!-- Eliminate max-w restriction for full width -->
    <div class="bg-white rounded-lg shadow-lg p-4 w-full">
      <!-- max-w-4xl makes it wider -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Tambah Data Lansia</h2>
        <button class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form @submit.prevent="handleSubmit" ref="formRef" :model="formData" :rules="rules">
        <div class="mb-4">
          <n-form-item label="Nama Lengkap" path="name">
                <n-input v-model:value="formData.name" placeholder="Masukkan Nama Lengkap"/>
              </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Jenis Kelamin" path="gender">
              <n-select
                v-model:value="formData.gender"
                :options="genderOptions"
                size="large"
                placeholder="Pilih Jenis Kelamin"
              />
            </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Tempat Lahir" path="placeOfBirth">
              <n-input v-model:value="formData.placeOfBirth" placeholder="Masukkan Tempat Lahir"/>
            </n-form-item>
        </div>
        <div class="mb-4">
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
        <div class="mb-4">
          <n-form-item label="Golongan Darah" path="bloodType">
              <n-select v-model:value="formData.bloodType" :options="bloodOptions" size="large" placeholder="Pilih Golongan Darah"/>
            </n-form-item>
        </div>
        <div class="mb-4">
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

        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="emit('close')">Kembali</n-button>
          <n-button type="primary" class="custom-button" :loading="isPending" attr-type="submit">Simpan</n-button>
        </div>
      </n-form>
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

.custom-button:hover {
  background-color: #0D4FA8 !important;
  border-color: #0D4FA8 !important;
}

.custom-button:active {
  background-color: #0B4390 !important;
  border-color: #0B4390 !important;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
