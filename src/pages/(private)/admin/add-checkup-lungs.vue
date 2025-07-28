<script setup lang="ts">
import { ref } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  type FormInst,
  type FormRules,
  useMessage
} from 'naive-ui'
import { useElderlyAdminList } from '@/services/elderly'
import { useAuthProfileAdmin } from '@/services/auth-user'
import { useLungQuestionList } from '@/services/lung'
import { useLungConclusionList } from '@/services/lung-conclusion'
import { calculateAge } from '@/helpers/age.helper'
import { useCreateLungs } from '@/services/lungs'

const { data } = useAuthProfileAdmin()

const { mutate, isPending } = useCreateLungs()

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
  elderlyId?: string
  responses: Record<string, number> = {}
  score: number = 0
  conclusionId?: string

  constructor(data: Partial<CreateElderlyCheckupData>) {
    Object.assign(this, data)
  }

  toObject() {
    return {
      elderlyId: this.elderlyId,
      responses: Object.entries(this.responses)
        .filter(([id]) =>
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
        )
        .map(([id, value]) => ({ id, value })),
      score: Object.values(this.responses).reduce((a, b) => a + b, 0),
      conclusionId: status.value?.id
    }
  }
}

const formRef = ref<FormInst>()
const formData = ref(new CreateElderlyCheckupData({}))

const rules: FormRules = {
  elderlyId: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
  responses: [{ type: 'any', required: true, message: 'Jawaban wajib diisi', trigger: ['blur', 'input'] }],
  score: [{ type: 'number', required: true, message: 'Skor wajib diisi' }],
  conclusionId: [{ type: 'string', required: true, message: 'Kesimpulan wajib diisi' }],
}

const status = computed(() => {
  const totalScore = Object.values(formData.value.responses).reduce((a, b) => a + b, 0)

  return conclusions.value?.data?.find(
    (item) => totalScore >= item.from && totalScore <= item.to
  )
})

async function handleSubmit() {
  const data = await formData.value.toObject()
  formRef.value?.validate((errors) => {
    console.log(errors)
    if (!errors || errors.length === 0) {
      mutate(data, {
        onSuccess: () => {
          message.success('Data pemeriksaan berhasil disimpan')
          router.push('/admin/checkup-lungs')
        },
        onError: () => {
          message.error('Gagal menyimpan data pemeriksaan')
        }
      })
    } else {
      message.error('Semua field wajib diisi')
    }
  })
}

const selectedElderly = computed(() => {
  return elderlyList.data.value?.data.find((item) => item.id === formData.value.elderlyId)
})

function calculateAgeFromISO(isoDateString: string): string {
  if (!isoDateString) {
    return ''
  }
  const birthDate = new Date(isoDateString)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()

  // Adjust age if the birthday hasn't occurred yet this year
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) {
    age--
  }

  return age.toString()
}

const { data: questions } = useLungQuestionList(
  computed(() => {
    return {
      limit: 100,
      search: ''
    }
  })
)

const { data: conclusions } = useLungConclusionList(
  computed(() => {
    return {
      limit: 100,
      search: ''
    }
  })
)

watchEffect(() => {
  if (selectedElderly.value) {
    const countAgeScore = (age: number) => {
      if (age < 60) {
        return 0
      }
      if (age > 60) {
        return 1
      }
    }

    formData.value.responses = {
      ...formData.value.responses,
      age: countAgeScore(calculateAge(selectedElderly?.value?.dateOfBirth as string)) as number,
      gender: selectedElderly?.value?.gender === 'FEMALE' ? 0 : 1
    }
  }
})
</script>

<template>
  <div class="p-4 max-w-md">
    <div class="mb-5">
      <h1 class="text-xl font-semibold">Tambah Pemeriksaan Paru Lansia</h1>
    </div>
    <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
      <div class="grid gap-3">
        <n-form-item label="Lansia" path="elderlyId">
          <n-select
            v-model:value="formData.elderlyId"
            :options="elderlyOptions"
            filterable
            placeholder="Pilih Data Lansia"
          />
        </n-form-item>
        <n-form-item label="Nama" path="name">
          <n-input :value="selectedElderly?.name" disabled placeholder="Nama" />
        </n-form-item>
        <n-form-item label="Jenis Kelamin">
          <n-input
            :value="
              selectedElderly?.gender &&
              (selectedElderly?.gender == 'MALE' ? 'Laki-laki' : 'Perempuan')
            "
            disabled
            placeholder="Jenis Kelamin"
          />
        </n-form-item>
        <n-form-item label="Umur">
          <div class="flex items-center gap-3 w-full">
            <n-input
              :value="calculateAgeFromISO(selectedElderly?.dateOfBirth as string)"
              disabled
              placeholder="Umur"
            />
            <div>
              <span>Tahun</span>
            </div>
          </div>
        </n-form-item>
        <n-form-item label="Posyandu" path="healthPostId">
          <n-input :value="data?.healthPost?.name" class="w-full" disabled placeholder="Posyandu" />
        </n-form-item>
      </div>

      <div v-for="q in questions?.data" :key="q?.id">
        <n-form-item :label="q.question" :path="`responses[${q.id}]`">
          <n-radio-group v-model:value="formData.responses[q.id]">
            <n-radio :value="1">Ya</n-radio>
            <n-radio :value="0">Tidak</n-radio>
          </n-radio-group>
        </n-form-item>
      </div>

      <div>
        <n-form-item label="Total Skor">
          <n-input-number
            disabled
            :value="Object.values(formData.responses).reduce((a, b) => a + b, 0)"
            placeholder="Kesimpulan"
          />
        </n-form-item>
      </div>

      <div>
        <div>Kesimpulan</div>
        <div class="text-xl text-primary">
          {{ status?.conclusion }}
        </div>
        <div>
          {{ status?.description }}
        </div>
      </div>

      <div class="mt-5 flex gap-3">
        <n-button type="tertiary" @click="$router.back()">Kembali</n-button>
        <n-button type="primary" attr-type="submit" :loading="isPending">Simpan</n-button>
      </div>
    </n-form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
</route>
