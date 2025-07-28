<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { http } from '@/composable/http/http'
import { useUserParentAddData } from '@/services/parents'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'

const { mutate, isPending } = useUserParentAddData()

type FormData = {
  name?: string
  dateOfBirth?: number
  placeOfBirth?: string
  address?: string
  subDistrictId?: string
}

const formData = ref<FormData>({
  name: undefined,
  dateOfBirth: undefined,
  placeOfBirth: undefined,
  address: undefined,
  subDistrictId: undefined,
})


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

const queryClient = useQueryClient()
const formRef = ref<FormInst>()
const message = useMessage()

const submitForm = () => {
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors) {
      mutate(
        {
          ...formData.value,
          dateOfBirth: DateTime.fromMillis(formData.value.dateOfBirth || 0).toISO()
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.USER_GET_PARENT]
            })
            emit('close')
          },
          onError: () => {
            message.error('Update Data orang tua gagal')
          }
        }
      )

      return
    }
    message.error('Validasi gagal')
  })
}
const rules: FormRules = {
  name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
  placeOfBirth: [{ type: 'string', required: true, message: 'Tempat Lahir wajib diisi' }],
  dateOfBirth: [{ type: 'number', required: true, message: 'Tanggal Lahir wajib diisi' }],
  address: [{ type: 'string', required: true, message: 'Alamat wajib diisi' }],
  subDistrictId: [{ type: 'string', required: true, message: 'Kecamatan wajib diisi' }],
}
const emit = defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center w-full">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Tambah Data Orang tua</h2>
      </div>
      <!-- Form -->
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="submitForm">
        <!-- Nama Orang Tua -->
        <div class="mb-4">
          <n-form-item label="Nama Orang Tua" path="name">
            <n-input v-model:value="formData.name" />
          </n-form-item>
        </div>

        <div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <n-form-item label="Tempat Lahir" path="placeOfBirth">
              <n-input v-model:value="formData.placeOfBirth" size="large" filterable />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Tanggal Lahir" path="dateOfBirth">
              <n-date-picker
                v-model:value="formData.dateOfBirth"
                name="tanggal_lahir"
                required
                size="large"
              />
            </n-form-item>
          </div>

          <div>
            <n-form-item label="Kelurahan" path="subDistrictId">
              <n-select
              v-model:value="formData.subDistrictId"
              :options="subDistrictOptions"
              :loading="isLoading"
              filterable
              remote
              placeholder="Pilih Kelurahan"
              @search="handleSearch"
            />
            </n-form-item>
          </div>
          <div class="md:col-span-2 lg:col-span-3">
            <n-form-item label="Alamat" path="address">
              <n-input
                v-model:value="formData.address"
                placeholder="Input Alamat"
                type="textarea"
              />
            </n-form-item>
          </div>
        </div>
        <!-- Buttons -->
        <div class="flex justify-end space-x-2">
          <n-button type="tertiary" @click="$emit('close')">Kembali</n-button>
          <n-button type="primary" :loading="isPending" attr-type="submit">Simpan</n-button>
        </div>
      </n-form>
      <!-- End tag n-form ditambahkan di sini -->
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
