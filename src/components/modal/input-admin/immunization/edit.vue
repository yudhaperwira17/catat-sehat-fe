<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import {
  useAdminPutImmunization,
  useAdminReadImmunizationById,
  useAdminReadVaccine
} from '@/services/admin-immunization'
import { useQueryClient } from '@tanstack/vue-query'
import { useMessage, type FormInst, type FormRules, type SelectOption } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import {
  X,
  Syringe,
  Calendar,
  FileText,
  Save,
  ArrowLeft,
  Edit,
  Shield,
  User,
  Baby
} from 'lucide-vue-next'

const props = defineProps<{
  id: string
  children?: string
  mother?: string
}>()

const emit = defineEmits(['close'])

const { data: vaccines } = useAdminReadVaccine()
const { data: immunization } = useAdminReadImmunizationById(ref(props.id))
const { mutate: updateImmunization, isPending } = useAdminPutImmunization(ref(props.id))

const formRef = ref<FormInst>()
const message = useMessage()
const queryClient = useQueryClient()

type FormData = {
  vaccineStageId?: string
  dateGiven?: number
  note?: string
}

const formData = ref<FormData>({
  vaccineStageId: undefined,
  dateGiven: undefined,
  note: undefined
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      updateImmunization(
        {
          ...formData.value
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_IMMUNIZATION] })
            message.success('Data imunisasi berhasil diperbarui')
            emit('close')
          },
          onError: () => {
            message.error('Gagal memperbarui data imunisasi')
          }
        }
      )
      return
    }
    message.error('Validasi gagal')
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
  vaccineStageId: [{ type: 'string', required: true, message: 'Jenis Vaksin wajib diisi' }],
  dateGiven: [{ type: 'number', required: true, message: 'Tanggal Pemberian wajib diisi' }],
  note: [{ type: 'string', required: true, message: 'Catatan wajib diisi' }]
}

const closeForm = () => {
  emit('close')
}

// Get current vaccine info for display
const currentVaccineInfo = computed(() => {
  if (!formData.value.vaccineStageId) return null
  return vaccineOptions.value.find((vaccine) => vaccine.value === formData.value.vaccineStageId)
})

watchEffect(() => {
  try {
    if (immunization.value) {
      formData.value.vaccineStageId = immunization.value?.vaccineStageId
      formData.value.dateGiven = immunization.value?.dateGiven
      formData.value.note = immunization.value?.note
    }
  } catch (error) {
    console.error(error)
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
            <Edit class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Edit Data Vaksin</h2>
            <p class="text-sm text-gray-600 mt-1">Perbarui informasi vaksinasi anak</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6">
          <!-- Patient Info Card -->
          <div
            v-if="props.children || props.mother"
            class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 mb-6 border border-blue-100"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <User class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium">Informasi Pasien</p>
                <div class="flex items-center gap-4 mt-1">
                  <div v-if="props.children" class="flex items-center gap-1">
                    <Baby class="w-4 h-4 text-blue-700" />
                    <span class="text-blue-800 font-semibold text-sm">{{ props.children }}</span>
                  </div>
                  <div v-if="props.mother" class="flex items-center gap-1">
                    <User class="w-4 h-4 text-blue-700" />
                    <span class="text-blue-700 text-sm">Ibu: {{ props.mother }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Vaccine Info -->
          <div
            v-if="currentVaccineInfo"
            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-6 border border-purple-100"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <Shield class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p class="text-sm text-purple-600 font-medium">Vaksin Saat Ini</p>
                <p class="text-purple-800 font-semibold">{{ currentVaccineInfo.label }}</p>
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
                        :disabled="true"
                        class="pl-10"
                      />
                    </div>
                    <p class="text-xs text-amber-600 mt-1 font-medium">
                      ⚠️ Jenis vaksin tidak dapat diubah
                    </p>
                  </div>
                </n-form-item>

                <!-- Date Given -->
                <n-form-item label="Umur Pemberian" path="dateGiven">
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
                      placeholder="Perbarui catatan untuk vaksinasi ini"
                      class="pl-10"
                      :rows="4"
                      required
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Contoh: reaksi setelah vaksin, lokasi pemberian, kondisi khusus
                  </p>
                </div>
              </n-form-item>
            </div>

            <!-- Change Summary -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="p-1 bg-amber-100 rounded-full mt-0.5">
                  <Edit class="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-amber-800">Mode Edit</p>
                  <p class="text-sm text-amber-700 mt-1">
                    Anda sedang mengedit data vaksinasi yang sudah ada. Pastikan informasi yang
                    diperbarui sudah benar sebelum menyimpan.
                  </p>
                </div>
              </div>
            </div>
          </n-form>
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
            class="!bg-blue-600 !hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <template #icon>
              <Save v-if="!isPending" class="w-4 h-4" />
            </template>
            {{ isPending ? 'Menyimpan...' : 'Simpan Perubahan' }}
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

/* Disabled select styling */
:deep(.n-select.n-select--disabled .n-base-selection) {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}
</style>
