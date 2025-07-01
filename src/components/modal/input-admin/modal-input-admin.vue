<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPostAdmin, useReadHealthPost } from '@/services/admin'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref, onMounted, watch } from 'vue'

const { mutate, isPending } = useAdminPostAdmin()
const queryClient = useQueryClient()

type FormData = {
  name?: string
  email?: string
  phone?: string
  type?: string
  healthPostId?: string
  password?: string
  confirmPassword?: string
}
const formData = ref<FormData>({
  name: undefined,
  email: undefined,
  phone: undefined,
  type: undefined,
  healthPostId: undefined,
  password: undefined,
  confirmPassword: undefined,
})

const formRef = ref<FormInst>()
const message = useMessage()

// State for Health Posts data
const healthPosts = ref<{ id: string; name: string }[]>([])

// Fetch health posts from API using the hook
const { data: healthPostsData, isLoading: isLoadingHealthPosts } = useReadHealthPost()

// Watch for changes in healthPostsData and update healthPosts ref
watch(healthPostsData, (newData) => {
  console.log('Health Posts Data:', newData); // Debug log
  if (newData && newData.data) {
    // Assuming newData.data contains the array of health posts
    healthPosts.value = newData.data;
    console.log('Processed Health Posts:', healthPosts.value); // Debug log
  } else {
    healthPosts.value = [];
  }
}, { immediate: true }) // Run immediately to load initial data

const rules: FormRules = {
  name: [{ type: 'string', required: true, message: 'Nama wajib diisi' }],
  email: [{ type: 'string', required: true, message: 'Email wajib diisi' }],
  phone: [{ type: 'string', required: true, message: 'Nomor WhatsApp wajib diisi' }],
  type: [{ type: 'string', required: true, message: 'Role wajib diisi' }],
  healthPostId: [
    { 
      message: 'Posyandu wajib diisi', 
      trigger: ['change'] ,
      validator: (rule, value: string | undefined) => {
        if (formData.value.type === 'KADER' && !value) {
          return new Error('Health post is required for KADER type')
        }
        return true
      },
    }
  ],
  password: [{ type: 'string', required: true, message: 'Password wajib diisi' }],
  confirmPassword: [{ type: 'string', required: true, message: 'Konfirmasi Password wajib diisi' }],
}

const emit = defineEmits(['close'])
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const payload: any = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        type: formData.value.type,
        password: formData.value.password,
      }

      if (formData.value.type === 'KADER' && formData.value.healthPostId) {
        payload.healthPostId = formData.value.healthPostId
        console.log('Submitting Health Post ID:', payload.healthPostId) // Debug log
      }

      console.log('Final Payload:', payload) // Debug log

      mutate(
        payload,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_ADMIN]
            })
            emit('close')
            message.success('Admin berhasil ditambahkan')
          },
          onError: (error) => {
            console.error('Error submitting admin:', error) // Debug log
            message.error(error.data?.message || 'Gagal menambahkan admin')
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
        <h2 class="text-lg font-semibold">Tambah Admin</h2>
        <button class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form @submit.prevent="handleSubmit" ref="formRef" :model="formData" :rules="rules">
        <div class="mb-4">
          <n-form-item label="Nama" path="name">
              <n-input
                type="text"
                v-model:value="formData.name"
                placeholder="Masukkan Nama"
                />
            </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Email" path="email">
              <n-input
                type="text"
                v-model:value="formData.email"
                placeholder="Masukkan Email"
                />
            </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Nomor WhatsApp" path="phone">
              <n-input
                type="text"
                v-model:value="formData.phone"
                placeholder="Masukkan Nomor WhatsApp"
                />
            </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Role" path="type">
              <select v-model="formData.type" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="SUPER_ADMIN">Admin Puskesmas</option>
              <option value="KADER">Kader Posyandu</option>
              <!-- Add more roles as needed -->
            </select>
            </n-form-item>
        </div>
        <!-- Posyandu Dropdown (Conditional) -->
        <div class="mb-4" v-if="formData.type === 'KADER'">
          <n-form-item label="Posyandu" path="healthPostId">
              <select v-model="formData.healthPostId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Posyandu</option> 
              <!-- Use fetched data here -->
              <option v-for="post in healthPosts" :key="post.id" :value="post.id">{{ post.name }}</option>
            </select>
            </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Kata Sandi" path="password">
              <n-input
                type="password"
                v-model:value="formData.password"
                placeholder="••••••••"
                />
            </n-form-item>
        </div>
        <div class="mb-4">
          <n-form-item label="Konfirmasi Kata Sandi" path="confirmPassword">
              <n-input
                type="password"
                v-model:value="formData.confirmPassword"
                placeholder="••••••••"
                />
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
