<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useUserPutChild, userReadChildById } from '@/services/child'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()
const { data: child } = userReadChildById(computed(() => props.id))

const { mutate, isPending } = useUserPutChild(computed(() => props.id))
// Definisikan tipe data untuk form
type FormData = {
  name?: string
  // identityNumber?: string
  placeOfBirth?: string
  dateOfBirth?: number
  childOrder?: number
  bloodType?: string
  height?: number
  weight?: number
  // childPicture?: string
  // fileBirthCertificate?: string
  // fileChildIdentity?: string
  // fileFamilyCard?: string
}

// Data form yang akan digunakan
const formData = ref<FormData>({
  name: undefined,
  // identityNumber: undefined,
  placeOfBirth: undefined,
  dateOfBirth: undefined,
  childOrder: undefined,
  bloodType: undefined,
  height: undefined,
  weight: undefined
  // childPicture: undefined,
  // fileBirthCertificate: undefined,
  // fileChildIdentity: undefined,
  // fileFamilyCard: undefined
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
  // Tambahkan opsi lainnya sesuai kebutuhan
])

const queryClient = useQueryClient()
const formRef = ref<FormInst>()
const message = useMessage()

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
    // formData.value.identityNumber = child.value.identityNumber
    formData.value.placeOfBirth = child.value.placeOfBirth
    formData.value.dateOfBirth = DateTime.fromISO(child.value.dateOfBirth).toMillis()
    formData.value.childOrder = child.value.childOrder
    formData.value.bloodType = child.value.bloodType
    formData.value.height = child.value.height
    formData.value.weight = child.value.weight
    // formData.value.childPicture = child.value.childPicture
    // formData.value.fileBirthCertificate = child.value.fileBirthCertificate
    // formData.value.fileChildIdentity = child.value.fileChildIdentity
    // formData.value.fileFamilyCard = child.value.fileFamilyCard
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Edit Data Anak</h2>
      </div>

      <!-- Form -->
      <n-form ref="formRef" :model="formData" @submit.prevent="submitForm">
        <!-- Nama Anak -->
        <div class="mb-4">
          <n-form-item label="Nama Lengkap" path="name">
            <n-input v-model:value="formData.name" />
          </n-form-item>
        </div>

        <!-- NIK -->
        <!-- <div class="mb-4">
          <n-form-item label="NIK" path="NIK">
            <n-input v-model:value="formData.identityNumber" name="NIK" required />
          </n-form-item>
        </div> -->

        <!-- Tempat Lahir, Tanggal Lahir, Anak Ke -->
        <div class="hidden md:grid grid-cols-3 gap-4 mb-4">
          <div>
            <n-form-item label="Tempat Lahir" path="TTL">
              <n-input v-model:value="formData.placeOfBirth" size="large" filterable />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Tanggal Lahir" path="tanggal_lahir">
              <n-date-picker
                v-model:value="formData.dateOfBirth"
                name="tanggal_lahir"
                required
                size="large"
              />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Anak Ke" path="anak_ke">
              <n-input-number
                v-model:value="formData.childOrder"
                :min="1"
                :max="99"
                required
                size="large"
              />
            </n-form-item>
          </div>
        </div>

        <!-- Mobile View -->
        <div class="grid grid-cols-2 gap-4 mb-4 md:hidden">
          <div>
            <n-form-item label="Tempat Lahir" path="TTL">
              <n-select
                v-model:value="formData.placeOfBirth"
                :options="placeOfBirthOptions"
                size="large"
              />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Tanggal Lahir" path="tanggal_lahir">
              <n-date-picker
                v-model:value="formData.dateOfBirth"
                name="tanggal_lahir"
                required
                size="large"
              />
            </n-form-item>
          </div>
        </div>
        <div class="block md:hidden">
          <n-form-item label="Anak Ke" path="anak_ke">
            <n-input-number v-model:value="formData.childOrder" required size="large" class="w-full" />
          </n-form-item>
        </div>

        <!-- Golongan Darah, Tinggi Badan, Berat Badan mobile -->
        <div class="block md:hidden">
          <n-form-item label="Golongan Darah" path="bloodType">
            <n-select v-model:value="formData.bloodType" :options="options" size="large" />
          </n-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4 md:hidden">
          <div>
            <n-form-item label="Tinggi Badan (cm)" path="TinggiBadan">
              <n-input-number v-model:value="formData.height" required size="large" />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Berat Badan (kg)" path="BeratBadan">
              <n-input-number v-model:value="formData.weight" required size="large" />
            </n-form-item>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden md:grid grid-cols-3 gap-4 mb-4">
          <div>
            <n-form-item label="Golongan Darah" path="bloodType">
              <n-select v-model:value="formData.bloodType" :options="options" size="large" />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Tinggi Badan (cm)" path="TinggiBadan">
              <n-input-number v-model:value="formData.height" required size="large" />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Berat Badan (kg)" path="BeratBadan">
              <n-input-number v-model:value="formData.weight" required size="large" />
            </n-form-item>
          </div>
        </div>

        <!-- Unggah Dokumen -->
        <!-- <div class="mb-4">
          <n-form-item label="Unggah file" path="file">
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              :headers="{ 'naive-info': 'hello!' }"
              :data="{ 'naive-data': 'cool! naive!' }"
            >
              <n-button v-model:value="formData.childPicture">Upload File</n-button>
            </n-upload>
          </n-form-item>
        </div> -->

        <!-- Dynamically Uploaded Files -->
        <!-- <div class="flex flex-wrap mt-2">
          <span
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md mr-2 mb-2"
          >
            {{ file.name }}
            <i class="fas fa-times ml-1 cursor-pointer" @click="removeFile(index)"></i>
          </span>
        </div> -->

        <!-- Buttons -->
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" :loading="isPending" attr-type="submit">Simpan</n-button>
        </div>
      </n-form>
      <!-- End tag n-form ditambahkan di sini -->
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
