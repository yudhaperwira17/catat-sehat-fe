<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { http } from '@/composable/http/http'; // pastikan ini axios instance kamu
import { useAdminPostHealthpost } from '@/services/admin-healthpost'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst } from 'naive-ui'
import { onMounted, ref } from 'vue'

type FormData = {
  name?: string
  address?: string
  subDistrictId?: string
}

const formData = ref<FormData>({
  name: undefined,
  address: undefined,
  subDistrictId: undefined
})

const queryClient = useQueryClient()
const emit = defineEmits(['close'])
const formRef = ref<FormInst>()
const message = useMessage()
const { mutate, isPending } = useAdminPostHealthpost()

const isLoading = ref(false)
const subDistrictOptions = ref<{ label: string; value: string }[]>([])

const fetchSubDistrict = async (query = '') => {
  isLoading.value = true
  try {
    const response = await http.get(API.LOCATION_GET_SUBDISTRICTS, {
      params: { search: query }
    })
    const result = response.data.data.data // ambil array dari data
    subDistrictOptions.value = result.map((item: any) => ({
      label: `${item.name} - ${item.district.name}`,
      value: item.id
    }))
  } catch (e) {
    subDistrictOptions.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async (query: string) => {
  await fetchSubDistrict(query)
}

// fetch awal saat mounted
onMounted(() => {
  fetchSubDistrict()
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
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_HEALTH_POST] })
            message.success('Update Data jadwal berhasil')
            emit('close')
          },
          onError: () => {
            message.error('Gagal memperbarui data jadwal')
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
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Jadwal Posyandu</h2>
        <button class="text-gray-500" @click="emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form class="space-y-2 mt-4" @submit.prevent="handleSubmit" ref="formRef" :model="formData">
        <n-form-item label="Nama Posyandu" path="name">
          <div class="w-full">
            <n-input
              v-model:value="formData.name"
              placeholder="Masukan nama posyandu"
              size="small"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></n-input>
          </div>
        </n-form-item>
        <n-form-item label="Kelurahan" path="subDistrictId">
          <div class="w-full">
            <n-select
              v-model:value="formData.subDistrictId"
              :options="subDistrictOptions"
              :loading="isLoading"
              filterable
              remote
              placeholder="Pilih Kelurahan"
              @search="handleSearch"
            />
          </div>
        </n-form-item>

        <n-form-item label="Alamat Posyandu" path="address">
          <n-input
            v-model:value="formData.address"
            type="textarea"
            placeholder="Masukan Alamat"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></n-input>
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
