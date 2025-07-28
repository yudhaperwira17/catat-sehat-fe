<script setup lang="ts">
import { PublicCode, usePublicPostCheckup } from '@/services/public-mother'
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const { data: mother } = PublicCode(computed(() => route.params.id as string))
const { mutate, isPending } = usePublicPostCheckup()

type FormData = {
  month?: number
  weight?: number
  height?: number
  upperArmCircumference?: number
  fundusMeasurement?: number
  fileDiagnosed?: string
  motherId?: string
  location?: string
  publicStaff?: string
}

const formData = ref<FormData>({
  month: undefined,
  weight: undefined,
  height: undefined,
  upperArmCircumference: undefined,
  fundusMeasurement: undefined,
  fileDiagnosed: undefined,
  motherId: undefined,
  location: undefined,
  publicStaff: undefined
})

const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])
const motherName = ref('')

watchEffect(() => {
  if (mother.value) {
    formData.value.motherId = mother?.value?.id
    motherName.value = mother?.value?.name
  }
})

const router = useRouter()
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            message.success('Data berhasil disimpan')
            router.push('/success')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

const rules: FormRules = {
  location: [{ type: 'string', required: true, message: 'Lokasi wajib diisi' }],
  publicStaff: [{ type: 'number', required: true, message: 'Petugas wajib diisi' }],
  month: [{ type: 'string', required: true, message: 'Bulan kehamilan wajib diisi' }],
  height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
  weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
  upperArmCircumference: [
    { type: 'number', required: true, message: 'Lingkar lengan atas wajib diisi' }
  ],
  fundusMeasurement: [{ type: 'number', required: true, message: 'Fundus uteri wajib diisi' }]
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
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
        <n-form-item label="Nama Ibu">
          <n-input v-model:value="motherName" placeholder="Nama Ibu" readonly />
        </n-form-item>

        <n-form-item label="Lokasi" path="location">
          <n-input v-model:value="formData.location" placeholder="lokasi" />
        </n-form-item>

        <n-form-item label="Petugas" path="publicStaff">
          <n-input v-model:value="formData.publicStaff" placeholder="petugas" />
        </n-form-item>

        <n-form-item label="Usia Kehamilan (bulan)" path="month">
          <n-input-number
            v-model:value="formData.month"
            :min="0"
            placeholder="Input Usia Kehamilan"
          />
        </n-form-item>
        <div class="flex md:flex-row flex-col gap 2 md:justify-between">
          <n-form-item label="Tinggi badan (cm)" path="height">
            <n-input-number
              v-model:value="formData.height"
              :min="0"
              placeholder="Input Tinggi Badan"
            />
          </n-form-item>
          <n-form-item label="Berat badan (kg)" path="weight">
            <n-input-number
              v-model:value="formData.weight"
              :min="0"
              placeholder="Input Berat Badan"
            />
          </n-form-item>
        </div>
        <div class="flex md:flex-row flex-col gap 2 md:justify-between">
          <n-form-item label="Lingkar Lengan (cm)" path="upperArmCircumference">
            <n-input-number
              v-model:value="formData.upperArmCircumference"
              placeholder="Input Lingkar Lengan"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Fundus Uteri (cm)" path="fundusMeasurement">
            <n-input-number
              v-model:value="formData.fundusMeasurement"
              :min="0"
              placeholder="Input Berat Badan"
            />
          </n-form-item>
        </div>

        <n-form-item label="Unggah Hasil Pemeriksaan">
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
</route>
