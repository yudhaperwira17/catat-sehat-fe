<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPostHealthpost } from '@/services/admin-healthpost'
import { useReadLocationSubDistrict } from '@/services/location'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref } from 'vue'

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

const { mutate, isPending } = useAdminPostHealthpost()
const { data } = useReadLocationSubDistrict()
const queryClient = useQueryClient()
const emit = defineEmits(['close'])
const formRef = ref<FormInst>()
const message = useMessage()

const subDistrictOptions = computed(() => {
  return data.value?.map((subDistrictId) => {
    return {
      label: subDistrictId.name,
      value: subDistrictId.id
    }
  })
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
        <n-form-item label="Kelurahan" path="age">
          <div class="w-full">
            <n-select
              v-model:value="formData.subDistrictId"
              :options="subDistrictOptions"
              filterable
              placeholder="pilih Kelurahan"
            >
            </n-select>
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
