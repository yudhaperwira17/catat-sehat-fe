<script setup lang="ts">
// import { API } from '@/composables/http/api-constant'
// import { PublicCode, usePublicPostCheckup } from '@/services/public'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
// const { data: child } = PublicCode(computed(() => route.params.id as string))
// const { mutate, isPending } = usePublicPostCheckup()

type FormData = {
  childId?: string
  age?: number
  gender?: string
  healthFacility?: string
  dateTime?: number
  responsiblePerson?: string
  height?: number
  weight?: number
  headCircumference?: number
  fileDiagnosed?: string
  name?: string
}

const formData = ref<FormData>({
  childId: undefined,
  age: undefined,
  gender: undefined,
  healthFacility: undefined,
  dateTime: undefined,
  responsiblePerson: undefined,
  height: undefined,
  weight: undefined,
  headCircumference: undefined,
  fileDiagnosed: undefined,
  name: undefined
})
const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])

// Menambahkan watchEffect untuk memantau perubahan pada setiap field
// watchEffect(() => {
//   if (child.value) {
//     console.log(child.value)
//     formData.value.childId = child?.value?.id
//     formData.value.name = child?.value?.name
//     formData.value.age = child?.value?.age
//     formData.value.gender = child?.value?.gender
//     formData.value.height = child?.value?.height
//     formData.value.weight = child?.value?.weight
//   }
// })
export interface HealthPost {
  id: string
  name: string
  address: string
  coordinator: string
  provinceId: string
  regencyId: string
  districtId: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

const queryClient = useQueryClient()
const router = useRouter()
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value,
          dateTime: DateTime.fromMillis(formData.value.dateTime || 0).toISO()
        },
        {
          onSuccess: () => {
            // Panggil queryClient untuk invalidasi atau refetch data
            queryClient.invalidateQueries({
              queryKey: [API.ADMIN_GET_CHECKUP_CHILD]
            })
            emit('close')
            message.success('Data berhasil disimpan')
            router.push('/public/success-checkup')
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
  age: [{ type: 'number', required: true, message: 'Umur wajib diisi' }],
  healthPostId: [{ type: 'string', required: true, message: 'Posyandu wajib diisi' }],
  dateTime: [{ type: 'number', required: true, message: 'Waktu pemeriksaan wajib diisi' }],
  healthFacility: [{ type: 'string', required: true, message: 'Petugas wajib diisi' }],
  height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
  weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
  headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
  fileDiagnosed: [{ type: 'string', message: 'File wajib diisi' }]
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
const options = ref([
  {
    label: 'Laki-laki',
    value: 'MALE'
  },
  {
    label: 'Perempuan',
    value: 'FEMALE'
  }
])
const healthFacilityOptions = ref([
  {
    label: 'Posyandu',
    value: 'posyandu'
  },
  {
    label: 'Puskesmas',
    value: 'puskesmas'
  },
  {
    label: 'Klinik',
    value: 'hospital'
  },
  {
    label: 'Lainnya',
    value: 'others'
  }
])
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100 min-h-screen">
    <div class="bg-white rounded-lg shadow-lg p-6 w-[606px] max-w-lg">
      <div class="flex justify-center flex-col items-center mb-4">
        <img
          src="/src/assets/images/Logo transparan catatsehat.png"
          alt="Logo"
          width="150"
          height="40"
        />

        <h2 class="text-lg font-semibold">Tambah Pencatatan TTD Ibu Hamil</h2>
      </div>

      <n-form
        class="space-y-2 mt-4"
        ref="formRef"
        @submit.prevent="handleSubmit"
        :model="formData"
        :rules="rules"
      >
        <n-form-item label="Nama Ibu" path="name">
          <n-input v-model:value="formData.name" placeholder="nama anak" readonly />
        </n-form-item>

        <n-form-item label="Bulan" path="location">
          <n-select
            v-model:value="value"
            :options="[
              { label: 'Bulan 1', value: '1' },
              { label: 'Bulan 2', value: '2' }
            ]"
            placeholder="Bulan"
          />
        </n-form-item>

        <n-form-item label="Nama Pengontrol" path="officer">
          <n-input v-model:value="formData.officer" placeholder="petugas" readonly />
        </n-form-item>

        <n-form-item label="Status Pengontrol" path="pregnancyAge">
          <n-input v-model:value="formData.pregnancyAge" placeholder="usia kehamilan" readonly />
        </n-form-item>
        <n-form-item label="Catatan" path="pregnancyAge">
          <n-input
            v-model:value="formData.pregnancyAge"
            type="textarea"
            placeholder="usia kehamilan"
            readonly
          />
        </n-form-item>

        <n-button type="primary" :loading="isPending" attr-type="submit" class="w-full">
          Kirim
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
