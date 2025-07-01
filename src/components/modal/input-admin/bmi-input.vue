<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
  adminCheckupMotherByCode,
  useAdminPostCheckupMother
} from '@/services/admin-checkup-mother'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type UploadFileInfo } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const queryClient = useQueryClient()
const props = defineProps<{
  code: string
}>()

const { mutate, isPending } = useAdminPostCheckupMother()
const { data: mother } = adminCheckupMotherByCode(computed(() => props.code))

type FormData = {
  month?: number
  weight?: number
  height?: number
  upperArmCircumference?: number
  fundusMeasurement?: number
  fileDiagnosed?: string
  motherId?: string
}

const formData = ref<FormData>({
  month: undefined,
  weight: undefined,
  height: undefined,
  upperArmCircumference: undefined,
  fundusMeasurement: undefined,
  fileDiagnosed: undefined,
  motherId: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])
const motherName = ref('')

watchEffect(() => {
  if (mother.value) {
     formData.value.motherId = mother.value.id
    motherName.value = mother.value.name
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
              queryKey: [API.ADMIN_GET_CHECKUP_MOTHER]
            })
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

// const rules: FormRules = {
//   name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
//   age: [{ type: 'number', required: true, message: 'Umur wajib diisi' }],
//   healthPostId: [{ type: 'string', required: true, message: 'Posyandu wajib diisi' }],
//   dateTime: [{ type: 'number', required: true, message: 'Waktu pemeriksaan wajib diisi' }],
//   adminStaffId: [{ type: 'string', required: true, message: 'Petugas wajib diisi' }],
//   height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
//   weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
//   headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
//   fileDiagnosed: [{ type: 'string', message: 'File wajib diisi' }]
// }

const closeForm = () => {
  emit('close')
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Ibu</h2>
        <button class="text-gray-500" @click="closeForm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form class="space-y-2 mt-4" @submit.prevent="handleSubmit" ref="formRef" :model="formData">
        <n-form-item label="Nama Ibu" path="name">
          <div class="w-full">
            <n-input v-model:value="motherName" readonly placeholder="Nama Ibu" />
          </div>
        </n-form-item>
        <n-form-item label="Usia Kehamilan " path="age">
          <div class="w-full">
            <n-input-number v-model:value="formData.month" placeholder="Input Usia Kehamilan" />
          </div>
        </n-form-item>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Tinggi badan" path="height">
            <div>
              <n-input-number v-model:value="formData.height" placeholder="Input Tinggi Badan" />
            </div>
          </n-form-item>
          <n-form-item label="Berat badan" path="weight">
            <div>
              <n-input-number v-model:value="formData.weight" placeholder="Input Berat Badan" />
            </div>
          </n-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Lingkar Lengan" path="headCircumference">
            <n-input-number
              v-model:value="formData.upperArmCircumference"
              placeholder="Input Lingkar Lengan"
            />
          </n-form-item>
          <n-form-item label="Fundus Uteri" path="weight">
            <div>
              <n-input-number v-model:value="formData.fundusMeasurement" placeholder="Input Berat Badan" />
            </div>
          </n-form-item>
        </div>
        <n-form-item label="Unggah Hasil Pemeriksaan" path="fileDiagnosed">
          <div class="mb-4">
            <span class="text-xs text-gray-600">
              *Hanya file berekstensi .pdf yang dapat diunggah
            </span>
            <n-upload
              accept=".pdf"
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  // file to base64
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.fileDiagnosed = result
                  })
                }
              "
            >
              <n-button v-model:value="formData.fileDiagnosed">Upload File</n-button>
            </n-upload>
          </div>
        </n-form-item>
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" :loading="isPending" attr-type="submit"
            >Simpan Perubahan</n-button
          >
        </div>
      </n-form>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
<route lang="yaml">
meta:
  layout: blank
</route>
