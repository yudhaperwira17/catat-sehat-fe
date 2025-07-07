<script setup lang="ts">
import { useAdminPostImmunization, useAdminReadVaccine } from '@/services/admin-immunization'
import { useMessage, type FormInst, type FormRules, type SelectOption } from 'naive-ui'
import { computed, ref, watch, watchEffect } from 'vue'
import { X, Syringe, Calendar, FileText, Save, ArrowLeft, Shield } from 'lucide-vue-next'

const { isPending } = useAdminPostImmunization()
const { data: vaccines, isLoading: vaccinesLoading, error: vaccinesError } = useAdminReadVaccine()

const props = defineProps<{
  childrenId?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: EmitSubmit): void
}>()

watch(vaccines, () => {}, { immediate: true, deep: true })

type EmitSubmit = {
  vaccineStageId?: string
  vaccineInfo?: {
    label: string
    value: string
    suggestedAge: string
  }
  childrenId?: string
  dateGiven?: number
  note?: string
}

type FormData = {
  childrenId?: string
  vaccineStageId?: string
  note?: string
  dateGiven?: number
}

export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  name: string
  suggestedAge: string
  order: any
  vaccineId: string
  createdAt: string
  updatedAt: string
}

const formData = ref<FormData>({
  childrenId: props.childrenId,
  vaccineStageId: undefined,
  dateGiven: undefined,
  note: undefined
})

watchEffect(() => {
  if (props.childrenId) {
    formData.value.childrenId = props.childrenId
  }
})

const formRef = ref<FormInst>()
const message = useMessage()
const submittedData = ref<FormData[]>([])

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      submittedData.value.push({ ...formData.value })
      message.success('Data imunisasi berhasil disimpan!')

      const selectedVaccine = vaccineOptions.value.find(
        (vaccine) => vaccine.value === formData.value.vaccineStageId
      )

      emit('submit', {
        childrenId: formData.value.childrenId,
        vaccineStageId: formData.value.vaccineStageId,
        vaccineInfo: selectedVaccine
          ? {
              label: selectedVaccine.label,
              value: selectedVaccine.value,
              suggestedAge: selectedVaccine.suggestedAge || ''
            }
          : undefined,
        dateGiven: formData.value.dateGiven,
        note: formData.value.note
      })

      emit('close')
      formData.value = {
        childrenId: props.childrenId,
        vaccineStageId: undefined,
        dateGiven: undefined,
        note: undefined
      }
    } else {
      message.error('Validasi gagal')
    }
  })
}

const vaccineOptions = computed(() => {
  const rawData = vaccines.value?.data ?? vaccines.value ?? []
  const safeArray = Array.isArray(rawData) ? rawData : (rawData.data ?? [])
  return [
    { label: 'Pilih Vaksin', disabled: true, value: undefined },
    ...safeArray.map((item: any) => ({
      label: `${item.name} ${item.suggestedAge ? `(${item.suggestedAge})` : ''}`,
      value: item.id,
      suggestedAge: item.suggestedAge
    }))
  ]
})

const dateOptions = ref<SelectOption[]>([
  { label: 'Bulan 0', value: 0 },
  { label: 'Bulan 1', value: 1 },
  { label: 'Bulan 2', value: 2 },
  { label: 'Bulan 3', value: 3 },
  { label: 'Bulan 4', value: 4 },
  { label: 'Bulan 5', value: 5 },
  { label: 'Bulan 6', value: 6 },
  { label: 'Bulan 7', value: 7 },
  { label: 'Bulan 8', value: 8 },
  { label: 'Bulan 9', value: 9 },
  { label: 'Bulan 10', value: 10 },
  { label: 'Bulan 11', value: 11 },
  { label: 'Bulan 12', value: 12 },
  { label: 'Bulan 18', value: 18 },
  { label: 'Bulan 23', value: 23 },
  { label: 'Bulan 24-59', value: 24 }
])

const rules: FormRules = {
  childrenId: [{ type: 'string', required: true, message: 'ID Anak wajib diisi' }],
  vaccineStageId: [{ type: 'string', required: true, message: 'Jenis Vaksin wajib diisi' }],
  dateGiven: [{ type: 'number', required: true, message: 'Tanggal Pemberian wajib diisi' }],
  note: [{ type: 'string', required: true, message: 'Catatan wajib diisi' }]
}

const closeForm = () => {
  emit('close')
}

watch(vaccinesError, (error) => {
  if (error) {
    console.error('Vaccines fetch error:', error)
    message.error('Gagal memuat data vaksin')
  }
})
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <button
          @click="closeForm"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <Shield class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Imunisasi Dasar</h2>
            <p class="text-sm text-gray-600 mt-1">Tambah data vaksinasi dasar untuk anak</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="vaccinesLoading" class="text-center py-12">
            <div
              class="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
            ></div>
            <p class="text-gray-600 font-medium">Memuat data vaksin...</p>
            <p class="text-gray-500 text-sm mt-1">Mohon tunggu sebentar</p>
          </div>

          <!-- Error State -->
          <div v-else-if="vaccinesError" class="text-center py-12">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
            >
              <X class="w-8 h-8 text-red-600" />
            </div>
            <p class="text-red-600 font-medium mb-2">Gagal memuat data vaksin</p>
            <p class="text-gray-500 text-sm mb-4">{{ vaccinesError }}</p>
            <n-button type="primary" size="small" @click="$router.go(0)"> Coba Lagi </n-button>
          </div>

          <!-- Form Content -->
          <div v-else>
            <!-- Info Card -->
            <div
              class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 mb-6 border border-blue-100"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <Shield class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm text-blue-600 font-medium">Imunisasi Dasar</p>
                  <p class="text-blue-800 font-semibold">Program Vaksinasi Wajib</p>
                </div>
              </div>
            </div>

            <!-- Form -->
            <n-form
              @submit.prevent="handleSubmit"
              class="space-y-6"
              ref="formRef"
              :model="formData"
              :rules="rules"
            >
              <!-- Hidden field for childrenId -->
              <n-form-item path="childrenId" style="display: none">
                <n-input v-model:value="formData.childrenId" />
              </n-form-item>

              <!-- Vaccination Details Section -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Syringe class="w-5 h-5 text-blue-600" />
                  Detail Vaksinasi
                </h3>

                <!-- Vaccine Selection and Date Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Vaccine Type -->
                  <n-form-item label="Jenis Vaksin" path="vaccineStageId">
                    <div class="w-full">
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <Syringe class="w-4 h-4 text-gray-400" />
                        </div>
                        <n-select
                          v-model:value="formData.vaccineStageId"
                          :options="vaccineOptions"
                          placeholder="Pilih jenis vaksin"
                          filterable
                          required
                          label-field="label"
                          value-field="value"
                          :loading="vaccinesLoading"
                          class="pl-10"
                        />
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Pilih vaksin sesuai jadwal imunisasi</p>
                    </div>
                  </n-form-item>

                  <!-- Date Given -->
                  <n-form-item label="Umur Pemberian (bulan)" path="dateGiven">
                    <div class="w-full">
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <Calendar class="w-4 h-4 text-gray-400" />
                        </div>
                        <n-select
                          v-model:value="formData.dateGiven"
                          :options="dateOptions"
                          placeholder="Pilih umur pemberian"
                          filterable
                          required
                          class="pl-10"
                        />
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Umur anak saat vaksin diberikan</p>
                    </div>
                  </n-form-item>
                </div>

                <!-- Notes -->
                <n-form-item label="Catatan" path="note">
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute left-3 top-3">
                        <FileText class="w-4 h-4 text-gray-400" />
                      </div>
                      <n-input
                        v-model:value="formData.note"
                        type="textarea"
                        placeholder="Tambahkan catatan khusus untuk vaksinasi ini"
                        class="pl-10"
                        :rows="3"
                        required
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      Contoh: reaksi setelah vaksin, lokasi pemberian, kondisi khusus
                    </p>
                  </div>
                </n-form-item>
              </div>

              <!-- Info Box -->
              <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <div class="p-1 bg-green-100 rounded-full mt-0.5">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-green-800">Imunisasi Dasar</p>
                    <p class="text-sm text-green-700 mt-1">
                      Imunisasi dasar adalah vaksinasi wajib yang harus diberikan kepada anak sesuai
                      jadwal untuk melindungi dari penyakit berbahaya.
                    </p>
                  </div>
                </div>
              </div>
            </n-form>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 p-6 bg-gray-50">
        <div class="flex justify-between gap-3">
          <n-button
            type="tertiary"
            class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
            @click="closeForm"
          >
            <ArrowLeft class="w-4 h-4" />
            Kembali
          </n-button>
          <n-button
            type="primary"
            :loading="isPending"
            @click="handleSubmit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Save v-if="!isPending" class="w-4 h-4" />
            <div
              v-if="isPending"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isPending ? 'Menyimpan...' : 'Simpan Data' }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-white {
  animation: fadeIn 0.3s ease-out;
}

/* Custom styling for select with icons */
:deep(.n-select .n-base-selection .n-base-selection-label) {
  padding-left: 2.5rem;
}

:deep(.n-input--textarea .n-input__input-el) {
  padding-left: 2.5rem;
}
</style>
