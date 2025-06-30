<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
  useReadLocationSubDistrict
} from '@/services/location'
import { useReadParentsById, useUserPutParent } from '@/services/parents'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: string
}>()
const { data: parent } = useReadParentsById(computed(() => props.id))
const { mutate, isPending } = useUserPutParent(computed(() => props.id))
// Definisikan tipe data untuk form
type FormData = {
  id?: string
  name?: string
  dateOfBirth?: number
  placeOfBirth?: string
  address?: string
  subDistrictId?: string
  districtId?: string
  regencyId?: string
  provinceId?: string
}

// Data form yang akan digunakan
const formData = ref<FormData>({
  id: undefined,
  name: undefined,
  dateOfBirth: undefined,
  placeOfBirth: undefined,
  address: undefined,
  subDistrictId: undefined,
  districtId: undefined,
  regencyId: undefined,
  provinceId: undefined
})

// const provinceId = computed(() => formData.value.provinceId)
// const regencyId = computed(() => formData.value.regencyId)
// const districtId = computed(() => formData.value.districtId)

// const { data: regencies } = useReadLocationRegency(provinceId)
// const { data: districts } = useReadLocationDistrict(regencyId)
const { data: subDistricts } = useReadLocationSubDistrict()


// const regencyOptions = computed(() => {
//   return regencies.value?.map((regencyId) => {
//     return {
//       label: regencyId.name,
//       value: regencyId.id
//     }
//   })
// })
// const districtOptions = computed(() => {
//   return districts.value?.map((districtId) => {
//     return {
//       label: districtId.name,
//       value: districtId.id
//     }
//   })
// })
const subDistrictOptions = computed(() => {
  return subDistricts.value?.map((subDistrictId) => {
    return {
      label: `${subDistrictId.name} - ${subDistrictId.district.name}`,
      value: subDistrictId.id
    }
  })
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
// const rules: FormRules = {
//   name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
//   placeOfBirth: [{ type: 'string', required: true, message: 'Tempat Lahir wajib diisi' }],
//   dateOfBirth: [{ type: 'number', required: true, message: 'Tanggal Lahir wajib diisi' }],
//   address: [{ type: 'string', required: true, message: 'Alamat wajib diisi' }],
//   provinceId: [{ type: 'string', required: true, message: 'Provinsi wajib diisi' }],
//   subDistrictId: [{ type: 'string', required: true, message: 'Kecamatan wajib diisi' }],
//   districtId: [{ type: 'string', required: true, message: 'Kabupaten wajib diisi' }],
//   regencyId: [{ type: 'string', required: true, message: 'Kelurahan wajib diisi' }]
// }
watchEffect(() => {
  if (parent.value) {
    formData.value.id = parent.value.id
    formData.value.name = parent.value.name
    formData.value.dateOfBirth = DateTime.fromISO(parent.value.dateOfBirth).toMillis()
    formData.value.placeOfBirth = parent.value.placeOfBirth
    formData.value.address = parent.value.address
    formData.value.provinceId = parent.value.provinceId
    formData.value.subDistrictId = parent.value.subDistrictId
    formData.value.districtId = parent.value.districtId
    formData.value.regencyId = parent.value.regencyId
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="flex items-center justify-center w-full">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Edit Data Orang tua</h2>
      </div>

      <!-- Form -->
      <n-form ref="formRef" :model="formData" @submit.prevent="submitForm">
        <!-- Nama Anak -->
        <div class="mb-4">
          <n-form-item label="Nama Orang Tua" path="name">
            <n-input v-model:value="formData.name" />
          </n-form-item>
        </div>
        <!-- NIK -->

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

          <!-- <div>
            <n-form-item label="Provinsi" path="provinceId">
              <n-select
                v-model:value="formData.provinceId"
                :options="provinceOptions"
                filterable
                placeholder="Cari Provinsi"
              />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Kabupaten" path="regencyId">
              <n-select
                v-model:value="formData.regencyId"
                :options="regencyOptions"
                filterable
                placeholder="Cari Kabupaten"
              />
            </n-form-item>
          </div>
          <div>
            <n-form-item label="Kecamatan" path="districtId">
              <n-select
                v-model:value="formData.districtId"
                :options="districtOptions"
                filterable
                placeholder="Cari Kecamatan"
              />
            </n-form-item>
          </div> -->
          <div>
            <n-form-item label="Kelurahan" path="subDistrictId">
              <n-select
                v-model:value="formData.subDistrictId"
                :options="subDistrictOptions"
                filterable
                placeholder="Cari Kecamatan"
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
