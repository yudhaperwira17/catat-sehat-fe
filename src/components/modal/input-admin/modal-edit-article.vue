<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPutArticle, useAdminGetArticleById } from '@/services/admin-article'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  id: string
}>()

const queryClient = useQueryClient()
const { mutate: updateArticle, isPending } = useAdminPutArticle()
const emit = defineEmits<{
  close: []
}>()

interface ArticlePayload {
  title: string
  content: string
  newsMaker: string
  filePicture?: string
}

const formData = ref<ArticlePayload>({
  title: '',
  content: '',
  newsMaker: '',
  filePicture: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()

// Fetch article details
const { data: articleData } = useAdminGetArticleById(computed(() => props.id))

// Sync article data to formData
watch(
  () => articleData.value,
  (newData) => {
    if (newData) {
      formData.value = {
        title: newData.data.title,
        content: newData.data.content,
        newsMaker: newData.data.newsMaker,
        filePicture: newData.data.image?.path
      }
    }
  },
  { immediate: true }
)

// Handle form submission
const submitForm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const payload: ArticlePayload = {
        title: formData.value.title.trim(),
        content: formData.value.content.trim(),
        newsMaker: formData.value.newsMaker.trim(),
        filePicture: formData.value.filePicture
      }

      updateArticle(
        { id: props.id, payload },
        {
          onSuccess: () => {
            message.success('Artikel berhasil diedit')
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ARTICLE] })
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ARTICLE_ID, props.id] })
            emit('close')
          },
          onError: (error: any) => {
            message.error(error?.response?.data?.message || 'Artikel gagal diedit')
          }
        }
      )
      return
    }
    message.error('Validasi Gagal')
  })
}

// Convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Pastikan format base64 sesuai
      if (!result.startsWith('data:')) {
        reject(new Error('Invalid base64 format'))
        return
      }
      resolve(result)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

const handleFileUpload = async (options: Required<UploadFileInfo>[]) => {
  try {
    const file = options[0]?.file
    if (!file) {
      message.error('Pilih file terlebih dahulu')
      return
    }

    // Validate file type sesuai dengan yang diizinkan di backend
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/heic',
      'image/heif',
      'application/pdf'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      message.error('Format file tidak didukung. Gunakan JPG, PNG, GIF, HEIC, HEIF, atau PDF')
      return
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      message.error('Ukuran file terlalu besar. Maksimal 2MB')
      return
    }

    const base64 = await fileToBase64(file as File)
    formData.value.filePicture = base64
    message.success('File berhasil diunggah')
  } catch (error) {
    message.error('Gagal mengunggah file')
    console.error('File upload error:', error)
  }
}

const rules: FormRules = {
  title: [{ type: 'string', required: true, message: 'Judul artikel wajib diisi' }],
  content: [{ type: 'string', required: true, message: 'Deskripsi wajib diisi' }],
  newsMaker: [{ type: 'string', required: true, message: 'Pembuat wajib diisi' }],
  filePicture: [{ type: 'string', required: false, message: 'File wajib diisi' }]
}
</script>

<template>
  <div class="flex items-center justify-center w-full max-w-xl">
    <div class="bg-white rounded-lg shadow-lg p-4 w-full">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Edit Artikel</h2>
        <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form @submit.prevent="submitForm" ref="formRef" :model="formData" :rules="rules">
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
              @update-file-list="handleFileUpload"
              :max="1"
              accept=".jpg,.jpeg,.png,.gif,.heic,.heif,.pdf"
            >
              <n-button class="custom-button">Unggah Gambar</n-button>
            </n-upload>
          </n-form-item>
        </div>
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
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
    layout: admin
    requiresAuth: true
</route>
