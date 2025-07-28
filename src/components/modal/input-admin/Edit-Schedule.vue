<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
  useAdminPutSchedule,
  useAdminReadHealthpost,
  useAdminReadScheduleById,
  useReadStaff
} from '@/services/admin-schedule'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()
type FormData = {
  healthPostId?: string
  address?: string
  staffId?: string
  startAt?: number
  endAt?: number
  date?: number
  note?: string
}

const formData = ref<FormData>({
  healthPostId: undefined,
  address: undefined,
  staffId: undefined,
  startAt: undefined,
  endAt: undefined,
  date: undefined,
  note: undefined
})

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

const { data: healthPost } = useAdminReadHealthpost()
const { data: schedule } = useAdminReadScheduleById(computed(() => props.id))
const healthPostId = computed(() => formData.value.healthPostId)
const { data: staff } = useReadStaff(healthPostId)
const { mutate, isPending } = useAdminPutSchedule(computed(() => props.id))
const emit = defineEmits<{
  close: []
}>()

const formRef = ref<FormInst>()
const message = useMessage()
const healthpostdrop = ref('')
const queryClient = useQueryClient()

const healthPostOptions = computed(() => {
  const options =
    healthPost.value?.data.map((item: HealthPost) => {
      return { label: item.name, value: item.id }
    }) || []
  return [
    { label: 'Pilih Posyandu', disabled: true, selectedOption: '', value: undefined },
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

const rules: FormRules = {
  healthPostId: [{ type: 'string', required: true, message: 'Bulan wajib diisi' }],
  staffId: [{ type: 'string', required: true, message: 'Nama Petugas wajib diisi' }],
  startAt: [{ type: 'number', required: true, message: 'Waktu Mulai wajib diisi' }],
  endAt: [{ type: 'number', required: true, message: 'Waktu Selesai wajib diisi' }],
  date: [{ type: 'number', required: true, message: 'Tanggal wajib diisi' }],
  address: [{ type: 'string', required: true, message: 'Alamat wajib diisi' }]
}

const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value,
          startAt: DateTime.fromMillis(formData.value.startAt || 0).toISO(),
          endAt: DateTime.fromMillis(formData.value.endAt || 0).toISO(),
          date: DateTime.fromMillis(formData.value.date || 0).toISO()
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_SCHEDULE]
            })
            emit('close')
          },

          onError: () => {
            message.error('Update Data Posyandu gagal')
          }
        }
      )

      return
    }
    message.error('Validasi gagal')
  })
}

watchEffect(() => {
  if (schedule.value) {
    formData.value.healthPostId = schedule.value.healthPost.id
    healthpostdrop.value = schedule.value.healthPost.name
    formData.value.address = schedule.value.address
    formData.value.staffId = schedule.value.staff.id
    formData.value.startAt = DateTime.fromISO(schedule.value?.startAt || '').toMillis() || undefined
    formData.value.endAt = DateTime.fromISO(schedule.value?.endAt || '').toMillis() || undefined
    formData.value.date = DateTime.fromISO(schedule.value?.date || '').toMillis() || undefined
    formData.value.note = schedule.value.note
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
      <n-form
        class="space-y-2 mt-4"
        @submit.prevent="submitForm"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <n-form-item label="Nama Posyandu" path="healthPostId">
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
        <n-form-item label="Nama Petugas" path="staffId">
          <div class="w-full">
            <n-select
              v-model:value="formData.staffId"
              :options="adminStaffOption"
              placeholder="Pilih Petugas"
              filterable
              required
            />
          </div>
        </n-form-item>
       <n-form-item label="Tanggal" path="date">
          <div class="w-full">
            <n-date-picker
              v-model:value="formData.date"
              :options="adminStaffOption"
              filterable
              placeholder="Pilih Tanggal"
            >
            </n-date-picker>
          </div>
        </n-form-item>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Waktu Mulai" path="startAt">
            <n-time-picker
              v-model:value="formData.startAt"
              clearable
              placeholder="Waktu Mulai"
            />
          </n-form-item>
          <n-form-item label="Waktu Selesai" path="endAt">
            <n-time-picker
              v-model:value="formData.endAt"
              clearable
              placeholder="Waktu Selesai"
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
        <n-form-item label="Catatan">
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
<route lang="yaml">
meta:
  layout: blank
</route>
