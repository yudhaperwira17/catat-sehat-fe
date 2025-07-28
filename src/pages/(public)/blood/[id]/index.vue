<script setup lang="ts">
import {
  PublicCode,
  usePublicPostBloodSuplement,
  usePublicReadMonthBlood
} from '@/services/public-mother'
import { DateTime } from 'luxon'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { data: mother } = PublicCode(computed(() => route.params.id as string))
const { mutate, isPending } = usePublicPostBloodSuplement()
const { data: months, isError, isLoading } = usePublicReadMonthBlood()

type FormData = {
  motherId?: string
  monthId?: number
  date?: number
  note?: string
  staffName?: string
  staffJob?: string
}

const formData = ref<FormData>({
  motherId: undefined,
  monthId: undefined,
  date: undefined,
  note: undefined,
  staffName: undefined,
  staffJob: undefined
})

interface Month {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])
const motherName = ref('')

const monthOption = computed(() => {
  const options =
    months.value?.map((item: Month) => ({
      label: item.name,
      value: item.id
    })) || []

  return [{ label: 'Pilih Bulan', disabled: true, value: undefined }, ...options]
})

watchEffect(() => {
  if (mother.value) {
    formData.value.motherId = mother.value.id
    motherName.value = mother.value.name
  }
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value,
          date: DateTime.fromMillis(formData.value.date || 0).toISO()
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
  })
}

const rules: FormRules = {
  monthId: [{ type: 'string', required: true, message: 'Bulan wajib diisi' }],
  date: [{ type: 'number', required: true, message: 'Tanggal wajib diisi' }],
  note: [{ type: 'string', message: 'Catatan tidak wajib diisi' }],
  staffName: [{ type: 'string', required: true, message: 'Nama Petugas wajib diisi' }],
  staffJob: [{ type: 'string', required: true, message: 'Pekerjaan Petugas wajib diisi' }]
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

        <h2 class="text-lg font-semibold">Tambah Pencatatan TTD Ibu Hamil</h2>
      </div>

      <n-form
        class="space-y-2 mt-4"
        ref="formRef"
        @submit.prevent="handleSubmit"
        :model="formData"
        :rules="rules"
      >
        <n-form-item label="Nama Ibu">
          <n-input v-model:value="motherName" placeholder="nama anak" readonly />
        </n-form-item>

        <n-form-item label="Bulan" path="monthId">
          <n-select
            v-if="!isLoading && !isError"
            v-model:value="formData.monthId"
            :options="monthOption"
            placeholder="Pilih Bulan"
            filterable
            required
          />
        </n-form-item>
        <n-form-item label="Tanggal" path="date">
          <div>
            <n-date-picker
              v-model:value="formData.date"
              clearable
              placeholder="Tanggal"
            />
          </div>
        </n-form-item>

        <n-form-item label="Nama Pengontrol" path="staffName">
          <n-input v-model:value="formData.staffName" placeholder="petugas" />
        </n-form-item>

        <n-form-item label="Status Pengontrol" path="staffJob">
          <n-input v-model:value="formData.staffJob" placeholder="status petugas" />
        </n-form-item>
        <n-form-item label="Catatan">
          <n-input v-model:value="formData.note" type="textarea" placeholder="catatan" />
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
