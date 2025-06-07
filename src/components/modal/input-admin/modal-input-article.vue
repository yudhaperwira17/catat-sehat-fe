<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPostArticle } from '@/services/admin-article'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'

const { mutate, isPending } = useAdminPostArticle()
const queryClient = useQueryClient()

type FormData = {
  title?: string
  content?: string
  newsMaker?: string
  filePicture?: string
}
const formData = ref<FormData>({
  title: undefined,
  content: undefined,
  newsMaker: undefined,
  filePicture: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()

const rules: FormRules = {
  title: [{ type: 'string', required: true, message: 'Judul artikel wajib diisi' }],
  content: [{ type: 'string', required: true, message: 'Deskripsi wajib diisi' }],
  newsMaker: [{ type: 'string', required: true, message: 'Pembuat wajib diisi' }],
  filePicture: [{ type: 'string', required: false, message: 'File wajib diisi' }] // While required is false, because the File service is not yet available
}
const emit = defineEmits(['close'])
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
              queryKey: [API.USER_GET_ARTICLE]
            })
            emit('close')
            message.success('Artikel berhasil ditambahkan')
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
</script>

<template>
  <div class="flex items-center justify-center w-full max-w-xl">
    <!-- Eliminate max-w restriction for full width -->
    <div class="bg-white rounded-lg shadow-lg p-4 w-full">
      <!-- max-w-4xl makes it wider -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Tambah Artikel</h2>
        <button class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form @submit.prevent="handleSubmit" ref="formRef" :model="formData" :rules="rules">
        <div class="mb-4">
          <n-form-item label="Judul Artikel" path="title">
            <n-input
              type="text"
              v-model:value="formData.title"
              placeholder="Masukkan Judul Artikel"
            />
          </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Pembuat Artikel" path="newsMaker">
            <n-input v-model:value="formData.newsMaker" placeholder="Masukkan Pembuat Artikel" />
          </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Deskripsi Artikel" path="content">
            <div class="relative w-full">
              <n-input
                v-model:value="formData.content"
                type="textarea"
                placeholder="Masukkan Deskripsi Artikel"
              />
            </div>
          </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Gambar Artikel" path="filePicture">
            <n-upload
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.filePicture = result
                  })
                }
              "
            >
              <n-button class="custom-button">Unggah Gambar</n-button>
            </n-upload>
          </n-form-item>
        </div>
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" class="custom-button" @click="emit('close')">Kembali</n-button>
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
