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
import { useMessage, type FormInst } from 'naive-ui'
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

// const rules: FormRules = {
//   name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
//   age: [{ type: 'number', required: true, message: 'Umur wajib diisi' }],
//   healthPostId: [{ type: 'string', required: true, message: 'Posyandu wajib diisi' }],
//   dateTime: [{ type: 'number', required: true, message: 'Waktu pemeriksaan wajib diisi' }],
//   adminStaffId: [{ type: 'string', required: true, message: 'Petugas wajib diisi' }],
//   height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
//   weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
//   headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
//   fileDiagnosed: [{ type: 'string', message: 'File wajib diisi' }]
// }
const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value,
          startAt: DateTime.fromMillis(formData.value.startAt || 0).toISO(),
          endAt: DateTime.fromMillis(formData.value.endAt || 0).toISO()
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
      <n-form class="space-y-2 mt-4" @submit.prevent="submitForm" ref="formRef" :model="formData">
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
        <n-form-item label="Nama Petugas " path="age">
          <div class="w-full">
            <n-select
              v-model:value="formData.staffId"
              :options="adminStaffOption"
              placeholder="Pilih Posyandu"
              filterable
              required
            />
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
<route lang="yaml">
meta:
  layout: blank
</route>
