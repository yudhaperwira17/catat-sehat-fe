<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
    adminCheckupMotherByCode,
    useAdminPostBloodRecord,
    useAdminReadMonthBlood
} from '@/services/admin-bloodRecord'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const queryClient = useQueryClient()
const props = defineProps<{
  code: string
}>()

const { mutate, isPending } = useAdminPostBloodRecord()
const { data: mother } = adminCheckupMotherByCode(computed(() => props.code))
const { data: months, isError, isLoading } = useAdminReadMonthBlood()

type FormData = {
  motherId?: string
  monthId?: number
  date?: number
  note?: string
}

const formData = ref<FormData>({
  motherId: undefined,
  monthId: undefined,
  date: undefined,
  note: undefined
})

interface Month {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])
const motherName = ref('')

const monthOption = computed(() => {
    const options =
    months.value?.map((item: Month) => ({
        label: item.name,
        value: item.id
    })) || []

  return [{ label: 'Pilih Bulan', disabled: true, value: undefined }, ...options]
})

watchEffect(() => {
  if (mother.value) {
    formData.value.motherId = mother.value.id
    motherName.value = mother.value.name
  }
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value,
          date: DateTime.fromMillis(formData.value.date || 0).toISO()
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_BLOOD_SUPLEMENT]
            })
            message.success('Data berhasil disimpan')
            emit('close')
          },
          onError: () => {
            message.error('Gagal memproses data.')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

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

const closeForm = () => {
  emit('close')
}
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Pemeriksaan Ibu</h2>
        <button class="text-gray-500" @click="closeForm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <n-form class="space-y-2 mt-4" @submit.prevent="handleSubmit" ref="formRef" :model="formData">
        <n-form-item label="Nama Ibu" path="name">
          <div class="w-full">
            <n-input v-model:value="motherName" readonly placeholder="Nama Ibu" />
          </div>
        </n-form-item>
        <n-form-item label="Bulan" path="age">
          <div class="w-full">
            <n-select
              v-if="!isLoading && !isError"
              v-model:value="formData.monthId"
              :options="monthOption"
              placeholder="Pilih Bulan"
              filterable
              required
            />
          </div>
        </n-form-item>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <n-form-item label="Tanggal" path="height">
            <div>
              <n-date-picker
                v-model:value="formData.date"
                type="datetime"
                clearable
                placeholder="Tanggal"
              />
            </div>
          </n-form-item>
          <!-- <n-form-item label="Nama Pengontrol" path="weight">
            <div>
              <n-input v-model:value="formData.staffName" placeholder="Input Nama Pengontrol" />
            </div>
          </n-form-item> -->
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <!-- <n-form-item label="Status Pengontrol" path="headCircumference">
            <n-input
              v-model:value="formData.staffJob"
              placeholder="Input Status Pengontrol"
            />
          </n-form-item> -->
          <n-form-item label="Catatan" path="weight">
            <div>
              <n-input
                v-model:value="formData.note"
                placeholder="Input Berat Badan"
                type="textarea"
              />
            </div>
          </n-form-item>
        </div>
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
