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
import { useCheckupCreate } from '../../_services/checkup'
import { useElderlyList } from '../../_services/elderly'

const fileToBase64 = (file?: File): Promise<string> => {
  if (!file) return Promise.resolve('')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

const router = useRouter()
const message = useMessage()

const elderlyList = useElderlyList(computed(() => ({})))

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
  name: [{ required: true, message: 'Nama wajib diisi', trigger: ['blur', 'input'] }],
  healthPostId: [{ required: true, message: 'Poskesdes wajib diisi', trigger: ['blur', 'input'] }],
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
  { label: 'MALNUTRITION', value: 'MALNUTRITION' },
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
          message.success('Data berhasil disimpan')
          router.push('/admin/elderly/checkup')
        },
        onError: () => {
          message.error('Data gagal disimpan')
        }
      })
    }
  })
}
</script>

<template>
 <div class="p-4">
   <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item label="Name" path="name">
      <n-input v-model:value="formData.name" />
    </n-form-item>
    <n-form-item label="Health Post ID" path="healthPostId">
      <n-input v-model:value="formData.healthPostId" />
    </n-form-item>
    <n-form-item label="Attend" path="attend">
      <n-date-picker v-model:value="formData.attend" type="datetime" />
    </n-form-item>
    <n-form-item label="Admin ID" path="adminId">
      <n-input v-model:value="formData.adminId" />
    </n-form-item>
    <n-form-item label="Month" path="month">
      <n-input-number v-model:value="formData.month" />
    </n-form-item>
    <n-form-item label="Height" path="height">
      <n-input-number v-model:value="formData.height" />
    </n-form-item>
    <n-form-item label="Weight" path="weight">
      <n-input-number v-model:value="formData.weight" />
    </n-form-item>
    <n-form-item label="BMI" path="bmi">
      <n-input-number v-model:value="formData.bmi" />
    </n-form-item>
    <n-form-item label="Blood Tension" path="bloodTension">
      <n-input-number v-model:value="formData.bloodTension" />
    </n-form-item>
    <n-form-item label="Blood Sugar" path="bloodSugar">
      <n-input-number v-model:value="formData.bloodSugar" />
    </n-form-item>
    <n-form-item label="BMI Status" path="bmiStatus">
      <n-select v-model:value="formData.bmiStatus" :options="bmiStatusOptions" />
    </n-form-item>
    <n-form-item label="Status" path="status">
      <n-select v-model:value="formData.status" :options="statusOptions" />
    </n-form-item>
    <n-form-item label="File Diagnosed" path="fileDiagnosed">
      <n-upload v-model:file-list="fileList" :max="1">
        <n-button>Upload</n-button>
      </n-upload>
    </n-form-item>
    <n-form-item label="Elderly ID" path="elderlyId">
      <n-select v-model:value="formData.elderlyId" :options="elderlyOptions" filterable />
    </n-form-item>
    <n-form-item label="Lungs Conclusion ID" path="lungsConclutionId">
      <n-input v-model:value="formData.lungsConclutionId" />
    </n-form-item>
    <n-button type="primary" attr-type="submit" :loading="isPending">Submit</n-button>
  </n-form>
 </div>
</template>
