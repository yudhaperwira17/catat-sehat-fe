<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { useReadParent } from '@/services/parents'
import { useReadDaysPostPartum, useUserCreatePostPartum } from '@/services/user-monitor-postpartum'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst } from 'naive-ui'
import { computed, ref } from 'vue'

const { mutate, isPending } = useUserCreatePostPartum()
const { data: days, isError, isLoading } = useReadDaysPostPartum()
const { data: parents } = useReadParent()
const mother = ref('')
const queryClient = useQueryClient()

type FormData = {
  motherId?: string
  dayPostPartumId?: string
  question1?: boolean
  question2?: boolean
  question3?: boolean
  question4?: boolean
  question5?: boolean
  question6?: boolean
  question7?: boolean
  question8?: boolean
  question9?: boolean
  question10?: boolean
  question11?: boolean
  question12?: boolean
  question13?: boolean
  question14?: boolean
  question15?: boolean
  question16?: boolean
  question17?: boolean
  question18?: boolean
}

const formData = ref<FormData>({
  motherId: mother.value,
  dayPostPartumId: undefined,
  question1: undefined,
  question2: undefined,
  question3: undefined,
  question4: undefined,
  question5: undefined,
  question6: undefined,
  question7: undefined,
  question8: undefined,
  question9: undefined,
  question10: undefined,
  question11: undefined,
  question12: undefined,
  question13: undefined,
  question14: undefined,
  question15: undefined,
  question16: undefined,
  question17: undefined,
  question18: undefined
})

export interface Days {
  id: string
  dayNumber: number
  name: string
  createdAt: string
  updatedAt: string
}

const formRef = ref<FormInst>()
const message = useMessage()
const emit = defineEmits(['close'])

const dayOptions = computed(() => {
  const options =
    days.value?.map((item: Days) => ({
      label: item.name,
      value: item.id
    })) || []

  return [{ label: 'Pilih Hari', disabled: true, value: '' }, ...options]
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [API.USER_GET_DAYS_POSTPARTUM]
            })
            message.success('Data berhasil disimpan')
            emit('close')
          },
        }
      )
      return
    }
    message.error('Validasi gagal')
  })
}

// const rules: FormRules = {
//   name: [{ type: 'string', required: true, message: 'Nama lengkap wajib diisi' }],
//   age: [{ type: 'number', required: true, message: 'Umur wajib diisi' }],
//   healthPostId: [{ type: 'string', required: true, message: 'Posyandu wajib diisi' }],
//   dateTime: [{ type: 'number', required: true, message: 'Waktu pemeriksaan wajib diisi' }],
//   adminStaffId: [{ type: 'string', required: true, message: 'Petugas wajib diisi' }],
//   height: [{ type: 'number', required: true, message: 'Tinggi badan wajib diisi' }],
//   weight: [{ type: 'number', required: true, message: 'Berat badan wajib diisi' }],
//   headCircumference: [{ type: 'number', required: true, message: 'Lingkar kepala wajib diisi' }],
//   fileDiagnosed: [{ type: 'string', message: 'File wajib diisi' }]
// }
watchEffect(() => {
  if (parents.value) {
    mother.value = parents.value.data[0].id
    formData.value.motherId = parents.value.data[0].id
    console.log(mother.value)
  }
})
// watch(mother, (newVal) => {
//   formData.value.motherId = newVal
// })
const closeForm = () => {
  emit('close')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
    <!-- Header - Fixed -->
    <div class="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-lg font-semibold">Pemeriksaan Ibu Nifas</h2>
      <button class="text-gray-500 hover:text-gray-700" @click="closeForm">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <!-- Content - Scrollable -->
    <div class="flex-1 overflow-y-auto p-6">
      <n-form ref="formRef" :model="formData" class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <n-form-item label="Hari Ke-" path="dayPostPartumId">
            <n-select
              v-if="!isLoading && !isError"
              v-model:value="formData.dayPostPartumId"
              :options="dayOptions"
              placeholder="Pilih Hari"
              filterable
              required
            />
          </n-form-item>
        </div>

        <!-- Questions Section -->
        <div class="space-y-6">
          <!-- Pemeriksaan Nifas oleh Dokter -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Pemeriksaan Nifas oleh Dokter</h3>
            <n-radio-group v-model:value="formData.question1" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Periksa</n-radio>
              <n-radio :value="true" class="text-sm">Tidak Periksa</n-radio>
            </n-radio-group>
          </div>

          <!-- Konsumsi Vitamin A -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Konsumsi Vitamin A</h3>
            <n-radio-group v-model:value="formData.question2" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Konsumsi</n-radio>
              <n-radio :value="true" class="text-sm">Tidak Konsumsi</n-radio>
            </n-radio-group>
          </div>

          <!-- Konsumsi Tablet Tambah Darah -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Konsumsi Tablet Tambah Darah</h3>
            <n-radio-group v-model:value="formData.question3" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Konsumsi</n-radio>
              <n-radio :value="true" class="text-sm">Tidak Konsumsi</n-radio>
            </n-radio-group>
          </div>

          <!-- Pemenuhan Gizi Sesuai Kebutuhan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Pemenuhan Gizi Sesuai Kebutuhan</h3>
            <n-radio-group v-model:value="formData.question4" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Memenuhi</n-radio>
              <n-radio :value="true" class="text-sm">Tidak Memenuhi</n-radio>
            </n-radio-group>
          </div>

          <!-- Kesehatan Jiwa -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Kesehatan Jiwa</h3>
            <n-radio-group v-model:value="formData.question5" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm"
                >Tidak ada keluhan, ibu merasa bahagia, tidak ada gangguan tidur, tidak ada gangguan
                konsentrasi</n-radio
              >
              <n-radio :value="true" class="text-sm">Ada keluhan</n-radio>
            </n-radio-group>
          </div>

          <!-- Demam -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Demam</h3>
            <n-radio-group v-model:value="formData.question6" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Suhu < 38°C</n-radio>
              <n-radio :value="true" class="text-sm">Suhu > 38°C</n-radio>
            </n-radio-group>
          </div>

          <!-- Sakit Kepala -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Sakit Kepala</h3>
            <n-radio-group v-model:value="formData.question7" class="flex flex-col space-y-2">
              <n-radio :value="true" class="text-sm">Ada</n-radio>
              <n-radio :value="false" class="text-sm">Tidak Ada</n-radio>
            </n-radio-group>
          </div>

          <!-- Pandangan Kabur -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Pandangan Kabur</h3>
            <n-radio-group v-model:value="formData.question8" class="flex flex-col space-y-2">
              <n-radio :value="true" class="text-sm">Ada</n-radio>
              <n-radio :value="false" class="text-sm">Tidak Ada</n-radio>
            </n-radio-group>
          </div>

          <!-- Nyeri Ulu Hati -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Nyeri Ulu Hati</h3>
            <n-radio-group v-model:value="formData.question9" class="flex flex-col space-y-2">
              <n-radio :value="true" class="text-sm">Ada</n-radio>
              <n-radio :value="false" class="text-sm">Tidak Ada</n-radio>
            </n-radio-group>
          </div>

          <!-- Jantung Berdebar -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Jantung Berdebar</h3>
            <n-radio-group v-model:value="formData.question10" class="flex flex-col space-y-2">
              <n-radio :value="true" class="text-sm">Ada</n-radio>
              <n-radio :value="false" class="text-sm">Tidak Ada</n-radio>
            </n-radio-group>
          </div>

          <!-- Keluar Cairan dari Jalan Lahir -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Keluar Cairan dari Jalan Lahir</h3>
            <n-radio-group v-model:value="formData.question11" class="flex flex-col space-y-2">
              <n-radio :value="true" class="text-sm">Ada</n-radio>
              <n-radio :value="false" class="text-sm">Tidak Ada</n-radio>
            </n-radio-group>
          </div>

          <!-- Nafas Pendek dan Terengah-engah -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Nafas Pendek dan Terengah-engah</h3>
            <n-radio-group v-model:value="formData.question12" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Tidak ada nafas pendek dan terengah</n-radio>
              <n-radio :value="true" class="text-sm"
                >Ada nafas pendek, terengah-engah, nafas dangkal, disertai nyeri dada, nafas berat,
                batuk lebih dari 2 minggu, mengi</n-radio
              >
            </n-radio-group>
          </div>

          <!-- Payudara -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Payudara</h3>
            <n-radio-group v-model:value="formData.question13" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm"
                >Tidak ada bengkak, tidak ada nyeri, tidak ada keluhan dalam menyusui</n-radio
              >
              <n-radio :value="true" class="text-sm"
                >Bengkak kemerahan, bengkak disertai nyeri, benjolan disertai nyeri, ada keluhan
                dalam menyusui</n-radio
              >
            </n-radio-group>
          </div>

          <!-- Buang Air Kecil -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Buang Air Kecil</h3>
            <n-radio-group v-model:value="formData.question14" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Biasa</n-radio>
              <n-radio :value="true" class="text-sm"
                >Tidak bisa BAK, BAK sedikit tapi sering, terasa panas, nyeri panggul, urin keluar
                tanpa disadari</n-radio
              >
            </n-radio-group>
          </div>

          <!-- Area Sekitar Kelamin -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Area Sekitar Kelamin</h3>
            <n-radio-group v-model:value="formData.question15" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Tidak ada bengkak atau nyeri</n-radio>
              <n-radio :value="true" class="text-sm"
                >Bengkak atau nyeri atau ada luka terbuka</n-radio
              >
            </n-radio-group>
          </div>

          <!-- Darah Nifas -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Darah Nifas</h3>
            <n-radio-group v-model:value="formData.question16" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm">Tidak berbau</n-radio>
              <n-radio :value="true" class="text-sm"
                >Berbau atau menggir atau ada nyeri perut bawah</n-radio
              >
            </n-radio-group>
          </div>

          <!-- Perdarahan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Perdarahan</h3>
            <n-radio-group v-model:value="formData.question17" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm"
                >Kurang dari 1 pembalut basah dalam 5 menit</n-radio
              >
              <n-radio :value="true" class="text-sm"
                >Lebih dari 1 pembalut basah dalam 5 menit</n-radio
              >
            </n-radio-group>
          </div>

          <!-- Keputihan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-3">Keputihan</h3>
            <n-radio-group v-model:value="formData.question18" class="flex flex-col space-y-2">
              <n-radio :value="false" class="text-sm"
                >Tidak ada atau sedikit, tidak berwarna dan tidak berbau</n-radio
              >
              <n-radio :value="true" class="text-sm">Cairan berlebih, berwarna dan berbau</n-radio>
            </n-radio-group>
          </div>
        </div>
      </n-form>
    </div>

    <!-- Footer - Fixed -->
    <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
      <n-button type="tertiary" @click="$emit('close')" :disabled="isPending"> Kembali </n-button>
      <n-button type="primary" :loading="isPending" @click="handleSubmit"> Simpan </n-button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
<route lang="yaml">
meta:
  layout: blank
</route>
