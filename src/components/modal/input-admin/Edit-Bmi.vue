<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
  useAdminEditCheckupMother,
  useAdminReadCheckupMotherById
} from '@/services/admin-checkup-mother'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type UploadFileInfo } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()

const { data: checkupMother } = useAdminReadCheckupMotherById(computed(() => props.id))
const { mutate, isPending } = useAdminEditCheckupMother(computed(() => props.id))
const motherName = ref('')
const emit = defineEmits<{
  close: []
}>()

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
const queryClient = useQueryClient()

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
              queryKey: [API.ADMIN_GET_CHECKUP_MOTHER]
            })
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
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

watchEffect(() => {
  if (checkupMother.value) {
    formData.value.month = checkupMother.value.month
    formData.value.weight = checkupMother.value.weight
    formData.value.height = checkupMother.value.height
    formData.value.upperArmCircumference = checkupMother.value.upperArmCircumference
    formData.value.fundusMeasurement = checkupMother.value.fundusMeasurement
    formData.value.motherId = checkupMother.value.mother.id
    motherName.value = checkupMother.value.mother.name
  }
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <div class="flex justify-between items-center border-b pb-4 mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Ibu</h2>
        <button class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form class="space-y-2 mt-4" @submit.prevent="submitForm" ref="formRef" :model="formData">
        <n-form-item label="Nama Ibu" path="name">
          <div class="w-full">
            <n-input v-model:value="motherName" readonly placeholder="Nama Ibu" />
          </div>
        </n-form-item>
        <n-form-item label="Usia Kehamilan (bulan)" path="age">
          <div class="w-full">
            <n-input-number v-model:value="formData.month" :min=0 placeholder="Input Usia Kehamilan" />
          </div>
        </n-form-item>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Tinggi badan (cm)" path="height">
            <div>
              <n-input-number v-model:value="formData.height" :min=0 placeholder="Input Tinggi Badan" />
            </div>
          </n-form-item>
          <n-form-item label="Berat badan (kg)" path="weight">
            <div>
              <n-input-number v-model:value="formData.weight" :min=0 placeholder="Input Berat Badan" />
            </div>
          </n-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Lingkar Lengan (cm)" path="headCircumference">
            <n-input-number
              v-model:value="formData.upperArmCircumference"
              placeholder="Input Lingkar Lengan"
              :min=0
            />
          </n-form-item>
          <n-form-item label="Fundus Uteri (cm)" path="weight">
            <div>
              <n-input-number
                v-model:value="formData.fundusMeasurement"
                placeholder="Input Berat Badan"
                :min=0
              />
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
<route lang="yaml">
meta:
  layout: blank
</route>
