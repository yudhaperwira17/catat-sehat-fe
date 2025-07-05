<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
  useAdminPutImmunization,
  useAdminReadImmunizationById,
  useAdminReadVaccine
} from '@/services/admin-immunization'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules, type SelectOption } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
  children?: string
  mother?: string
}>()

const { data: vaccines } = useAdminReadVaccine()
const { data: immunization } = useAdminReadImmunizationById(computed(() => props.id))
const { mutate: updateImmunization, isPending } = useAdminPutImmunization(computed(() => props.id))

const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])

type FormData = {
  vaccineStageId?: string
  dateGiven?: number
  note?: string
}
const formData = ref<FormData>({
  vaccineStageId: undefined,
  dateGiven: undefined,
  note: undefined
})
const queryClient = useQueryClient()
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      // Konversi field open, close, dan date ke format ISO 8601
      updateImmunization(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_IMMUNIZATION] })
            // message.success('Update Data jadwal berhasil')
            emit('close') // Menutup modal setelah submit berhasil
          },
          onError: () => {
            message.error('Gagal memperbarui data imunisasi')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}



const vaccineOptions = computed(() => {
  const rawData = vaccines.value?.data ?? vaccines.value ?? []

  const safeArray = Array.isArray(rawData) ? rawData : rawData.data ?? []

  return [
    { label: 'Pilih Vaksin', disabled: true, value: undefined },
    ...safeArray.map((item: any) => ({
      label: `${item.name} ${item.suggestedAge ? `(${item.suggestedAge})` : ''}`,
      value: item.id, // PASTIKAN item.id ADA!
      suggestedAge: item.suggestedAge
    }))
  ]
})

// Mock options for dates
const dateOptions = ref<SelectOption[]>([
  { label: 'Bulan 0', value: 0 },
  { label: 'Bulan 1', value: 1 },
  { label: 'Bulan 2', value: 2 },
  { label: 'Bulan 3', value: 3 },
  { label: 'Bulan 4', value: 4 },
  { label: 'Bulan 5', value: 5 },
  { label: 'Bulan 6', value: 6 },
  { label: 'Bulan 7', value: 7 },
  { label: 'Bulan 8', value: 8 },
  { label: 'Bulan 9', value: 9 },
  { label: 'Bulan 10', value: 10 },
  { label: 'Bulan 11', value: 11 },
  { label: 'Bulan 12', value: 12 },
  { label: 'Bulan 18', value: 18 },
  { label: 'Bulan 23', value: 23 },
  { label: 'Bulan 24-59 ', value: 24 }
])

const rules: FormRules = {
  vaccineStageId: [{ type: 'string', required: true, message: 'Jenis Vaksin wajib diisi' }],
  dateGiven: [{ type: 'number', required: true, message: 'Tanggal Pemberian wajib diisi' }],
  note: [{ type: 'string', required: true, message: 'Catatn wajib diisi' }]
}

const closeForm = () => {
  emit('close')
}

watchEffect(() => {
  try {
    if (immunization.value) {
      formData.value.vaccineStageId = immunization.value?.vaccineStageId
      formData.value.dateGiven = immunization.value?.dateGiven
      formData.value.note = immunization.value?.note
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">Tambah Daftar Vaksin</h2>
        <button class="text-gray-500" @click="closeForm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <hr />
      <n-form
        @submit.prevent="handleSubmit"
        class="space-y-2 mt-4"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <div class="flex flex-row justify-between gap-2">
          <n-form-item label="Jenis Vaksin" class="w-full" path="vaccineStageId" >
            <n-select
              v-model:value="formData.vaccineStageId"
              :options="vaccineOptions"
              placeholder="Pilih Vaksin"
              filterable
              required
              :disabled=true
            />
          </n-form-item>
          <n-form-item label="Tanggal Pemberian" class="w-full" path="dateGiven">
            <n-select
              v-model:value="formData.dateGiven"
              :options="dateOptions"
              placeholder="Pilih Tanggal"
              filterable
              required
            />
          </n-form-item>
        </div>
        <n-form-item label="Catatan" class="w-full" path="note">
          <n-input placeholder="Catatan" type="textarea" v-model:value="formData.note" required />
        </n-form-item>
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" :loading="isPending" attr-type="submit">Simpan</n-button>
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
