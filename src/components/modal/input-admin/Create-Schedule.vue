<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
    useAdminPostSchedule,
    useAdminReadHealthpost,
    useReadStaff
} from '@/services/admin-schedule'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref } from 'vue'

type FormData = {
  healthPostId?: string
  address?: string
  staffId?: string
  startAt?: number
  endAt?: number
  note?: string
}

const formData = ref<FormData>({
  healthPostId: undefined,
  address: undefined,
  staffId: undefined,
  startAt: undefined,
  endAt: undefined,
  note: undefined
})

const { mutate, isPending } = useAdminPostSchedule()
const { data: healthPost } = useAdminReadHealthpost()
const healthPostId = computed(() => formData.value.healthPostId)
const { data: staff } = useReadStaff(healthPostId)
const queryClient = useQueryClient()
const emit = defineEmits(['close'])
const formRef = ref<FormInst>()
const message = useMessage()

interface HealthPost {
  id: string
  name: string
  address: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  subDistrict: SubDistrict
}

interface SubDistrict {
  id: string
  name: string
  districtId: string
  createdAt: string
  updatedAt: string
}

const healthPostOptions = computed(() => {
  const options =
    healthPost.value?.data?.map((item: HealthPost) => ({
      label: item.name,
      value: item.id
    })) || []

  return [
    { label: 'Pilih Posyandu', disabled: true, value: undefined },
    ...options
  ]
})
const adminStaffOption = computed(() => {
  return staff.value?.map((healthPostId) => {
    return {
      label: healthPostId.name,
      value: healthPostId.id
    }
  })
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value,
          startAt: DateTime.fromMillis(formData.value.startAt || 0).toISO(),
          endAt: DateTime.fromMillis(formData.value.endAt || 0).toISO()
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_SCHEDULE] })
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
            <n-select
              v-model:value="formData.healthPostId"
              :options="healthPostOptions"
              placeholder="Pilih Posyandu"
              filterable
              required
            />
          </div>
        </n-form-item>
        <n-form-item label="Nama Petugas" path="age">
          <div class="w-full">
            <n-select
              v-model:value="formData.staffId"
              :options="adminStaffOption"
              filterable
              placeholder="pilih petugas"
            >
            </n-select>
          </div>
        </n-form-item>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Waktu Mulai" path="open">
            <n-date-picker
              v-model:value="formData.startAt"
              type="datetime"
              clearable
              placeholder="Waktu Mulai"
            />
          </n-form-item>
          <n-form-item label="Waktu Mulai" path="open">
            <!-- <label class="block text-sm font-medium text-gray-700">Waktu Mulai</label> -->
            <n-date-picker
              v-model:value="formData.endAt"
              type="datetime"
              clearable
              placeholder="Waktu Mulai"
            />
          </n-form-item>
        </div>
        <n-form-item label="Alamat Posyandu" path="address">
          <n-input
            v-model:value="formData.address"
            type="textarea"
            placeholder="Masukan Alamat"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></n-input>
        </n-form-item>
        <n-form-item label="Catatan" path="address">
          <n-input
            v-model:value="formData.note"
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
