<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import router from '@/router'
import {
  useAdminEditeCheckupChild,
  useAdminReadCheckupChild,
  useAdminReadCheckupChildById
} from '@/services/admin-checkup-child'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type UploadFileInfo } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()

const { data: checkupChild } = useAdminReadCheckupChildById(computed(() => props.id))
const { mutate, isPending } = useAdminEditeCheckupChild(computed(() => props.id))
const emit = defineEmits<{
  close: []
}>()

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
const queryClient = useQueryClient()

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
              queryKey: [API.ADMIN_GET_CHECKUP_CHILD]
            })
            emit('close')
            router.push('/admin/checkup-child')
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
  if (checkupChild.value) {
    formData.value.childrenId = checkupChild.value.children.name
    formData.value.height = checkupChild.value.height
    formData.value.weight = checkupChild.value.weight
    formData.value.headCircumference = checkupChild.value.headCircumference
  }
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <div class="flex justify-between items-center border-b pb-4 mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Anak</h2>
        <button class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form class="space-y-2 mt-4" @submit.prevent="submitForm" ref="formRef" :model="formData">
        <n-form-item label="Nama Anak" path="name">
          <div class="w-full">
            <n-input v-model:value="formData.childrenId" readonly placeholder="Nama Anak" />
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
          <n-form-item label="Lingkar Kepala" path="headCircumference">
            <n-input-number
              v-model:value="formData.headCircumference"
              placeholder="Input Lingkar Kepala"
            />
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
