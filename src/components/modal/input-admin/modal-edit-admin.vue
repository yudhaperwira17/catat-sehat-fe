<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminEditAdmin, useReadAdminById, useReadHealthPost } from '@/services/admin'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    id: string
}>()

const queryClient = useQueryClient()
const { mutate, isPending } = useAdminEditAdmin(computed(() => props.id))
const emit = defineEmits<{
    close: []
}>()

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

// State for show/hide password
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// State for Health Posts data
const healthPosts = ref<{ id: string; name: string }[]>([])

// Fetch health posts from API using the hook
const { data: healthPostsData } = useReadHealthPost()

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
}, { immediate: true }); // Run immediately to load initial data

// Fetch admin details
const { data: adminData } = useReadAdminById(computed(() => props.id))

// Sync admin data to formData
watch(
  () => adminData.value,
  (newData) => {
    if (newData) {
      formData.value = {
        name: newData.name,
        email: newData.email,
        phone: newData.phone,
        type: newData.type,
        healthPostId: newData.healthPostId,
        password: newData.password,
        confirmPassword: newData.confirmPassword,
    }
    }
  },
  { immediate: true }
)

// Handle form submission
const submitForm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const payload: any = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        type: formData.value.type,
        password: formData.value.password,
      };

      if (formData.value.type === 'KADER' && formData.value.healthPostId) {
        payload.healthPostId = formData.value.healthPostId;
        console.log('Submitting Health Post ID:', payload.healthPostId); // Debug log
      }

      console.log('Final Payload:', payload); // Debug log

      mutate(
        payload,
        {
          onSuccess: () => {
            message.success('Admin berhasil diedit')
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ADMIN] })
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ADMIN_ID, props.id] })
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_POST_ADMIN] })
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_PUT_ADMIN] })
            emit('close')
          },
          onError: (error) => {
            console.error('Error updating admin:', error); // Debug log
            message.error(error.data?.message || 'Gagal mengedit admin')
          }
        }
      )
      return
    }
    message.error('Validasi Gagal')
  })
}

const rules: FormRules = {
  name: [{ type: 'string', required: true, message: 'Nama wajib diisi' }],
  email: [{ type: 'string', required: true, message: 'Email wajib diisi' }],
  phone: [{ type: 'string', required: true, message: 'Nomor WhatsApp wajib diisi' }],
  type: [{ type: 'string', required: true, message: 'Role wajib diisi' }],
  healthPostId: [
    { 
      message: 'Posyandu wajib diisi', 
      trigger: ['change'] ,
      validator: (_rule, value: string | undefined) => {
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
</script>

<template>
    <div class="flex items-center justify-center w-full max-w-xl">
      <div class="bg-white rounded-lg shadow-lg p-4 w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Ubah Admin</h2>
          <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <n-form @submit.prevent="submitForm" ref="formRef" :model="formData" :rules="rules">
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
          <div class="mb-4" v-if="formData.type === 'KADER'">
            <n-form-item label="Posyandu" path="healthPostId">
                <select v-model="formData.healthPostId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Posyandu</option>
                <option v-for="post in healthPosts" :key="post.id" :value="post.id">{{ post.name }}</option>
              </select>
              </n-form-item>
          </div>
          <div class="mb-4">
            <n-form-item label="Kata Sandi" path="password">
              <n-input
                :type="showPassword ? 'text' : 'password'"
                v-model:value="formData.password"
                placeholder="••••••••"
              >
                <template #suffix>
                  <button type="button" @click="showPassword = !showPassword" tabindex="-1" style="background:transparent;border:none;outline:none;cursor:pointer;padding:0 4px;">
                    <span v-if="showPassword">
                      <!-- Eye Off SVG -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1-2.1A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.925 5.925M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" /></svg>
                    </span>
                    <span v-else>
                      <!-- Eye SVG -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.67 1.664-1.175 2.393M15.5 15.5A5.978 5.978 0 0112 17c-2.21 0-4.21-.895-5.5-2.5" /></svg>
                    </span>
                  </button>
                </template>
              </n-input>
            </n-form-item>
          </div>
          <div class="mb-4">
            <n-form-item label="Konfirmasi Kata Sandi" path="confirmPassword">
              <n-input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model:value="formData.confirmPassword"
                placeholder="••••••••"
              >
                <template #suffix>
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1" style="background:transparent;border:none;outline:none;cursor:pointer;padding:0 4px;">
                    <span v-if="showConfirmPassword">
                      <!-- Eye Off SVG -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1-2.1A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.925 5.925M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" /></svg>
                    </span>
                    <span v-else>
                      <!-- Eye SVG -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.67 1.664-1.175 2.393M15.5 15.5A5.978 5.978 0 0112 17c-2.21 0-4.21-.895-5.5-2.5" /></svg>
                    </span>
                  </button>
                </template>
              </n-input>
            </n-form-item>
          </div>
          <div class="flex justify-end space-x-2">
            <n-button type="tertiary" class="custom-button" @click="$emit('close')">Kembali</n-button>
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
