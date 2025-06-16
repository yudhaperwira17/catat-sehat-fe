<script setup lang="ts">
import { useAdminPostImmunization, useAdminReadVaccine } from '@/services/admin-immunization'
import { useMessage, type FormInst, type FormRules, type SelectOption } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  childrenId?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: EmitSubmit): void
}>()

const { isPending } = useAdminPostImmunization()
const { data: vaccines } = useAdminReadVaccine()
// const { data: child } = adminCheckupChildByCode(computed(() => props.code))

type EmitSubmit = {
  vaccineStageId?: Vaccine
  childrenId?: string
  dateGiven?: number
  note?: string
}
type FormData = {
  childrenId?: string
  vaccineStage?: {
    label: string
    value: string
  }
  dateGiven?: number
  note?: string
}
type VaccineOption = {
  label: string
  value: string
}
const formData = ref<FormData>({
  childrenId: props.childrenId,
  vaccineStage: undefined,
  dateGiven: undefined,
  note: undefined
})
watchEffect(() => {
  if (props.childrenId) {
    formData.value.childrenId = props.childrenId
  }
})

const formRef = ref<FormInst>()
const message = useMessage()

const submittedData = ref<FormData[]>([])
interface Vaccine {
  id: string
  name: string
  suggestedAge: string
  vaccineId: string
  createdAt: string
  updatedAt: string
}

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      // Simpan data ke array lokal
      submittedData.value.push({ ...formData.value })

      // Tampilkan pesan sukses
      message.success('Data berhasil disimpan.')

      emit('submit', { ...formData.value })
      // Reset form setelah submit
      // Tutup form setelah submit berhasil
      emit('close')
      formData.value = {
        childrenId: props.childrenId,
        vaccineStage: undefined,

        dateGiven: undefined,
        note: undefined
      }
    } else {
      message.error('Validasi gagal')
    }
  })
}

const vaccineOptions = computed(() => {
  const options =
    vaccines.value?.data?.map((item: Vaccine) => {
      return { label: item.name, value: item.id, suggestedAge: item.suggestedAge }
    }) || []
  return [
    { label: 'Pilih Vaksin', disabled: true, selectedOption: '', value: undefined },
    ...options
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
  childrenId: [{ type: 'string', required: true, message: 'ID Anak wajib diisi' }],
  vaccineStage: [{ type: 'string', required: true, message: 'Jenis Vaksin wajib diisi' }],
  dateGiven: [{ type: 'number', required: true, message: 'Tanggal Pemberian wajib diisi' }],
  note: [{ type: 'string', required: true, message: 'Catatan wajib diisi' }]
}

const closeForm = () => {
  emit('close')
}
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
          <n-form-item label="Jenis Vaksin" class="w-full" path="vaccineStageId">
            <n-select
              @update:value="
                (k: VaccineOption) => {
                  formData.vaccineStage = k
                }
              "
              :options="vaccineOptions"
              placeholder="Pilih Vaksin"
              filterable
              required
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
