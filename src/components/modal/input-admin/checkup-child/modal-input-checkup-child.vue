<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPostCheckupChild } from '@/services/admin-checkup-child'
import { adminCheckupChildByCode } from '@/services/admin-child'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

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

// Menambahkan watchEffect untuk memantau perubahan pada setiap field
watchEffect(() => {
  if (child.value) {
    console.log(child.value)
    formData.value.childrenId = child?.value?.name
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
            // Panggil queryClient untuk invalidasi atau refetch data
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_CHECKUP_CHILD]
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

const rules: FormRules = {
  height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
  weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
  headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
  fileDiagnosed: [{ type: 'string', required: false, message: 'File wajib diisi' }],
  childrenId: [{ type: 'string', required: true, message: 'Anak wajib diisi' }]
}

const closeForm = () => {
  alert('Form closed')
  // Implement form closing logic if needed
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

// const options = ref([
//   {
//     label: 'Laki-laki',
//     value: 'MALE'
//   },
//   {
//     label: 'Perempuan',
//     value: 'FEMALE'
//   }
// ])
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Bayi</h2>
        <button class="text-gray-500" @click="closeForm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form
        class="space-y-2 mt-4"
        @submit.prevent="handleSubmit"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <n-form-item label="Nama Anak" path="childrenId">
          <div class="w-full">
            <n-input v-model:value="formData.childrenId" readonly placeholder="nama anak" />
          </div>
        </n-form-item>

        <!-- <n-form-item label="Jenis Kelamin" path="gender">
          <div class="w-full">
            <n-select
              v-model:value="formData.gender"
              :options="options"
              placeholder="Pilih Jenis Kelamin"
            />
          </div>
        </n-form-item> -->

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
        <div class="w-full">
          <n-form-item label="Lingkar Kepala" path="headCircumference">
            <div class="w-full">
              <n-input-number
                v-model:value="formData.headCircumference"
                placeholder="Input Lingkar Kepala"
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
