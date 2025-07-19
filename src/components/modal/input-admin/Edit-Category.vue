<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useAdminPutCategory, useAdminReadCategoryById } from '@/services/bmi-category'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()

type FormData = {
  gender?: string
  minAge?: number
  maxAge?: number
  minBMI?: number
  maxBMI?: number
  status?: string
}

const formData = ref<FormData>({
  gender: undefined,
  minAge: undefined,
  maxAge: undefined,
  minBMI: undefined,
  maxBMI: undefined,
  status: undefined
})

const { mutate, isPending } = useAdminPutCategory(computed(() => props.id))
const { data: schedule } = useAdminReadCategoryById(computed(() => props.id))

const emit = defineEmits<{
  close: []
}>()

const formRef = ref<FormInst>()
const message = useMessage()
const queryClient = useQueryClient()

const rules: FormRules = {
  gender: [{ type: 'string', required: true, message: 'Jenis Kelamin wajib diisi' }],
  minAge: [{ type: 'number', required: true, message: 'Usia minimum wajib diisi' }],
  maxAge: [{ type: 'number', required: true, message: 'Usia maksimum wajib diisi' }],
  minBMI: [{ type: 'number', required: true, message: 'BMI minimum wajib diisi' }],
  maxBMI: [{ type: 'number', required: true, message: 'BMI maksimum wajib diisi' }],
  status: [{ type: 'string', required: true, message: 'Status wajib diisi' }]
}

const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_BMI_CATEGORY]
            })
            emit('close')
          }
        }
      )

      return
    }
    message.error('Validasi gagal')
  })
}

watchEffect(() => {
  const data = schedule.value
  if (data) {
    console.log('Loaded data:', data)
    formData.value.gender = data.gender
    formData.value.minAge = data.minAge
    formData.value.maxAge = data.maxAge
    formData.value.minBMI = data.minBMI
    formData.value.maxBMI = data.maxBMI
    formData.value.status = data.status
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
        <n-form-item label="Jenis Kelamin" path="gender">
          <div class="w-full">
            <n-select
              v-model:value="formData.gender"
              :options="[
                { label: 'Perempuan', value: 'FEMALE' },
                { label: 'Laki-laki', value: 'MALE' }
              ]"
              placeholder="Pilih Jenis Kelamin"
              required
            />
          </div>
        </n-form-item>
        <n-form-item label="Usia Minimum" path="minAge">
          <div class="w-full">
            <n-input-number
              v-model:value="formData.minAge"
              placeholder="Usia Minimum"
              :min="0"
              required
            />
          </div>
        </n-form-item>
        <n-form-item label="Usia Maksimum" path="maxAge">
          <div class="w-full">
            <n-input-number
              v-model:value="formData.maxAge"
              placeholder="Usia Maksimum"
              :min="0"
              required
            />
          </div>
        </n-form-item>
        <n-form-item label="BMI Minimum" path="minBMI">
          <div class="w-full">
            <n-input-number
              v-model:value="formData.minBMI"
              placeholder="BMI Minimum"
              :min="0"
              required
            />
          </div>
        </n-form-item>
        <n-form-item label="BMI Maksimum" path="maxBMI">
          <div class="w-full">
            <n-input-number
              v-model:value="formData.maxBMI"
              placeholder="BMI Maksimum"
              :min="0"
              required
            />
          </div>
        </n-form-item>
        <n-form-item label="Status" path="status">
          <div class="w-full">
            <n-select
              v-model:value="formData.status"
              :options="[
                { label: 'Malnutrisi', value: 'MALNUTRITION' },
                { label: 'Normal', value: 'NORMAL' },
                { label: 'Kelebihan Berat Badan', value: 'OVERWEIGHT' },
                { label: 'Obesitas', value: 'OBESITY' },
                { label: 'Kurang Gizi', value: 'UNDERNUTRITION' }
              ]"
              placeholder="Pilih Status"
              required
            />
          </div>
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
