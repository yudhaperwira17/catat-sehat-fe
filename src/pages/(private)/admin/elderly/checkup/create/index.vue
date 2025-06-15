<script setup lang="ts">
import { ref } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NDatePicker,
  NSelect,
  NUpload,
  NButton,
  type FormInst,
  type FormRules,
  type UploadFileInfo,
  useMessage
} from 'naive-ui'
import { DateTime } from 'luxon'
import { useCheckupCreate } from '@/services/checkup-elderly'
import { useElderlyAdminList } from '@/services/elderly'
import { useAuthProfileAdmin } from '@/services/auth-user'


const fileToBase64 = (file?: File): Promise<string> => {
  if (!file) return Promise.resolve('')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

const { data } = useAuthProfileAdmin()

const router = useRouter()
const message = useMessage()

const elderlyList = useElderlyAdminList(computed(() => ({})))

const elderlyOptions = computed(() => {
  return (
    elderlyList.data.value?.data.map((item) => ({
      label: item.name,
      value: item.id
    })) || []
  )
})

class CreateElderlyCheckupData {
  name?: string
  healthPostId?: string
  attend?: number
  adminId?: string
  month?: number
  height?: number
  weight?: number
  bmi?: number
  bloodTension?: number
  bloodSugar?: number
  bmiStatus?: string
  status?: string
  fileDiagnosed?: string
  elderlyId?: string
  lungsConclutionId?: string

  constructor(data: Partial<CreateElderlyCheckupData>) {
    Object.assign(this, data)
  }

  async toObject() {
    return {
      name: this.name,
      healthPostId: this.healthPostId,
      attend: DateTime.fromMillis((this.attend as number) || 0).toISO(),
      adminId: this.adminId,
      month: this.month,
      height: this.height,
      weight: this.weight,
      bmi: this.bmi,
      bloodTension: this.bloodTension,
      bloodSugar: this.bloodSugar,
      bmiStatus: this.bmiStatus,
      status: this.status,
      fileDiagnosed: await fileToBase64(fileList.value?.[0]?.file as File), 
      elderlyId: this.elderlyId,
      lungsConclutionId: this.lungsConclutionId
    }
  }
}

const formRef = ref<FormInst>()
const formData = ref(new CreateElderlyCheckupData({}))
const { mutate, isPending } = useCheckupCreate()

const rules: FormRules = {
  attend: [{ type: 'number', message: 'Tanggal wajib diisi', trigger: ['blur', 'input'] }],
  month: [{ type: 'number', message: 'Bulan wajib diisi', trigger: ['blur', 'input'] }],
  height: [{ type: 'number', message: 'Tinggi badan wajib diisi', trigger: ['blur', 'input'] }],
  weight: [{ type: 'number', message: 'Berat badan wajib diisi', trigger: ['blur', 'input'] }],
  bmi: [{ type: 'number', message: 'Indeks massa tubuh wajib diisi', trigger: ['blur', 'input'] }],
  bloodTension: [
    { type: 'number', message: 'Tekanan darah wajib diisi', trigger: ['blur', 'input'] }
  ],
  bloodSugar: [{ type: 'number', message: 'Gula darah wajib diisi', trigger: ['blur', 'input'] }],
  bmiStatus: [{ required: true, message: 'Status IMT wajib diisi', trigger: ['blur', 'input'] }],
  status: [{ required: true, message: 'Status wajib diisi', trigger: ['blur', 'input'] }]
}

const bmiStatusOptions = [
  // { label: 'MALNUTRITION', value: 'MALNUTRITION' },
  { label: 'UNDERNUTRITION', value: 'UNDERNUTRITION' },
  { label: 'NORMAL', value: 'NORMAL' },
  { label: 'OVERWEIGHT', value: 'OVERWEIGHT' },
  { label: 'OBESITY', value: 'OBESITY' }
]

const statusOptions = [
  { label: 'VERIFIED', value: 'VERIFIED' },
  { label: 'UNVERIFIED', value: 'UNVERIFIED' }
]

const fileList = ref<UploadFileInfo[]>()

async function handleSubmit() {
  const data = await formData.value.toObject()
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors || errors.length === 0) {
      mutate(data, {
        onSuccess: () => {
          message.success('Data pemeriksaan berhasil disimpan')
          router.push('/admin/checkup-elderly')
        },
        onError: () => {
          message.error('Gagal menyimpan data pemeriksaan')
        }
      })
    }
  })
}

const selectedElderly = computed(() => {
  return elderlyList.data.value?.data.find((item) => item.id === formData.value.elderlyId)
})

function calculateAgeFromISO(isoDateString: string): string {
  if (!isoDateString) {
    return '';
  }
  const birthDate = new Date(isoDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust age if the birthday hasn't occurred yet this year
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

return age.toString();
}

function calculateBmi(weight: number, height: number) {
  const bmi = weight / Math.pow(height / 100, 2)
  const bmiStatus = bmi < 18.4
    ? 'UNDERNUTRITION'
    : bmi < 24.9
      ? 'NORMAL'
      : bmi < 29.9
        ? 'OVERWEIGHT'
        : bmi < 30
          ? 'OBESITY'
          : 'OBESITY'
  formData.value.bmi = Math.round(bmi)
  formData.value.bmiStatus = bmiStatus
}

watchEffect(() => {
  if (formData.value.height && formData.value.weight) {
    calculateBmi(formData.value.weight, formData.value.height)
}
})
</script>

<template>
  <div class="p-4">
    <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
      <n-form-item label="Lansia" path="elderlyId">
        <n-select v-model:value="formData.elderlyId" :options="elderlyOptions" filterable placeholder="Pilih Data Lansia"/>
      </n-form-item>
      <n-form-item label="Nama" path="name">
        <n-input :value="selectedElderly?.name" disabled placeholder="Nama" />
      </n-form-item>
      <n-form-item label="Jenis Kelamin">
        <n-input :value="selectedElderly?.gender" disabled placeholder="Jenis Kelamin"/>
      </n-form-item>
      <n-form-item label="Umur">
        <n-input :value="calculateAgeFromISO(selectedElderly?.dateOfBirth as string)" disabled placeholder="Umur"/>
      </n-form-item>
      <n-form-item label="Posyandu" path="healthPostId">
        <n-input :value="data?.healthPost?.name" disabled placeholder="Posyandu"/>
      </n-form-item>
      <n-form-item label="Tinggi Badan" path="height">
        <n-input-number v-model:value="formData.height" placeholder="Masukkan Tinggi Badan"/>
      </n-form-item>
      <n-form-item label="Berat Badan" path="weight">
        <n-input-number v-model:value="formData.weight" placeholder="Masukkan Berat Badan"/>
      </n-form-item>
      <n-form-item label="Indeks Massa Tubuh" path="bmi">
        <n-input-number v-model:value="formData.bmi" placeholder="Masukkan Indeks Massa Tubuh"/>
      </n-form-item>
      <n-form-item label="Tekanan Darah" path="bloodTension">
        <n-input-number v-model:value="formData.bloodTension" placeholder="Masukkan Tekanan Darah"/>
      </n-form-item>
      <n-form-item label="Gula Darah" path="bloodSugar">
        <n-input-number v-model:value="formData.bloodSugar" placeholder="Masukkan Gula Darah"/>
      </n-form-item>
      <n-form-item label="Status IMT" path="bmiStatus">
        <n-select v-model:value="formData.bmiStatus" :options="bmiStatusOptions" placeholder="Status Indeks Massa Tubuh"/>
      </n-form-item>
      <n-form-item label="Status" path="status">
        <n-select v-model:value="formData.status" :options="statusOptions" placeholder="Pilih Status Pemeriksaan"/>
      </n-form-item>
      <!-- <n-form-item label="Surat Rujukan" path="fileDiagnosed">
        <n-upload v-model:file-list="fileList" :max="1">
          <n-button>Upload</n-button>
        </n-upload>
      </n-form-item> -->

      <n-button type="primary" attr-type="submit" :loading="isPending">Submit</n-button>
    </n-form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
</route>
