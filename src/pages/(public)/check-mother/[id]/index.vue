<!-- <script setup lang="ts">
// import { API } from '@/composables/http/api-constant'
// import { PublicCode, usePublicPostCheckup } from '@/services/public'
import { useQueryClient } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
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

        <h2 class="text-lg font-semibold">Pemeriksaan Ibu Hamil</h2>
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

        <n-form-item label="Lokasi" path="location">
          <n-input v-model:value="formData.location" placeholder="lokasi" readonly />
        </n-form-item>

        <n-form-item label="Petugas" path="officer">
          <n-input v-model:value="formData.officer" placeholder="petugas" readonly />
        </n-form-item>

        <n-form-item label="Usia Kehamilan" path="pregnancyAge">
          <n-input v-model:value="formData.pregnancyAge" placeholder="usia kehamilan" readonly />
        </n-form-item>
        <div class="flex md:flex-row flex-col gap 2 md:justify-between">
          <n-form-item label="Tinggi badan" path="height">
            <n-input-number v-model:value="formData.height" placeholder="Input Tinggi Badan" />
          </n-form-item>

          <n-form-item label="Berat badan" path="weight">
            <n-input-number v-model:value="formData.weight" placeholder="Input Berat Badan" />
          </n-form-item>
        </div>
        <div class="flex md:flex-row flex-col gap 2 md:justify-between">
          <n-form-item label="Lingkar lengan" path="armCircumference">
            <n-input-number
              v-model:value="formData.armCircumference"
              placeholder="Input Lingkar Lengan"
            />
          </n-form-item>

          <n-form-item label="Fundus Uteri" path="uterusFundus">
            <n-input-number
              v-model:value="formData.uterusFundus"
              placeholder="Input Fundus Uteri"
            />
          </n-form-item>
        </div>

        <n-form-item label="Unggah Hasil Pemeriksaan" path="fileDiagnosed">
          <div class="mb-4">
            <span class="text-xs text-gray-600">
              *Hanya file berekstensi .pdf yang dapat diunggah
            </span>
            <n-upload
              accept=".pdf"
              @update-file-list="
                (options: Required<UploadFileInfo>[]) => {
                  const file = options[0]?.file
                  fileToBase64(file as File).then((result) => {
                    formData.fileDiagnosed = result
                  })
                }
              "
            >
              <n-button class="text-white">Upload File</n-button>
            </n-upload>
          </div>
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
</route> -->
<script setup lang="ts">
console.log('test')
</script>