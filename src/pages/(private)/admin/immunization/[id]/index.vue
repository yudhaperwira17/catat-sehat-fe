<script setup lang="ts">
import CreateData from '@/components/modal/input-admin/immunization/add.vue'
import { adminCheckupChildByCode } from '@/services/admin-child'
import { useAdminPostImmunizations } from '@/services/admin-immunization'
import { NButton, NInput, NTag, useMessage } from 'naive-ui'
import { computed, ref, watch, watchEffect, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Plus,
  Syringe,
  User,
  Baby,
  Calendar,
  FileText,
  MoreVertical,
  // Edit,
  Trash2,
  Send,
  Shield
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { data: children, isError } = adminCheckupChildByCode(
  computed(() => route.params.id as string)
)

const childrenId = computed(() => children?.value?.id)
const { mutate: createImmunizations } = useAdminPostImmunizations()
const message = useMessage()

const formData = ref({
  motherName: '',
  childName: ''
})

const inputImmunization = ref(false)
const submittedData = ref<FormData[]>([])
const editModalVisible = ref(false)
const editData = ref<FormData | undefined>(undefined)
const selectedId = ref<string>('')

type FormData = {
  childrenId?: string
  vaccineStageId?: string
  vaccineInfo?: {
    label: string
    value: string
    suggestedAge: string
  }
  dateGiven?: number
  note?: string
}

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

watchEffect(() => {
  if (isError.value) {
    console.log(isError.value)
    router.push('/404')
  }
})

const handleDropdownSelect = (index: number) => (key: string) => {
  console.log('Dropdown selected:')
  if (key === 'edit') {
    editData.value = { ...submittedData.value[index] }
    selectedId.value = index.toString()
    editModalVisible.value = true
  } else if (key === 'delete') {
    submittedData.value.splice(index, 1)
    message.success('Data berhasil dihapus.')
  }
}

const handleSubmit = () => {
  if (!childrenId.value || submittedData.value.length === 0) {
    message.error('Pastikan semua data telah diisi.')
    return
  }

  const payload = {
    childrenId: childrenId.value,
    immunizations: submittedData.value.map(({ vaccineStageId, dateGiven, note }) => ({
      vaccineStageId: vaccineStageId,
      dateGiven,
      note
    }))
  }

  console.log('Payload yang akan dikirim:', payload)

  createImmunizations(payload, {
    onSuccess: () => {
      message.success('Imunisasi Anak berhasil ditambahkan')
      submittedData.value = []
    }
  })
}

const updateFormData = () => {
  if (children.value) {
    formData.value.motherName = children.value.mother?.name || ''
    formData.value.childName = children.value.name || ''
  }
}

watch(
  () => children.value,
  (newValue) => {
    if (newValue) updateFormData()
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4"
  >
    <!-- Main Card -->
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div class="flex flex-col items-center space-y-4">
          <!-- Logo -->
          <div
            class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <img src="@/assets/images/LOGO.png" alt="Catat Sehat Logo" class="w-10 h-auto" />
          </div>

          <!-- Title -->
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-2">Catat Sehat</h1>
            <p class="text-blue-100 font-medium">Penambahan Data Imunisasi</p>
            <p class="text-blue-200 text-sm mt-2">
              Silahkan mengisikan data pada form di bawah ini
            </p>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-8">
        <!-- Patient Information -->
        <div
          class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-100"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User class="w-5 h-5 text-green-600" />
            Informasi Pasien
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mother Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User class="w-4 h-4 text-gray-500" />
                Nama Ibu
              </label>
              <div class="relative">
                <n-input
                  v-model:value="formData.motherName"
                  placeholder="Nama Ibu"
                  readonly
                  class="bg-white border-green-200"
                />
              </div>
            </div>

            <!-- Child Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Baby class="w-4 h-4 text-gray-500" />
                Nama Anak
              </label>
              <div class="relative">
                <n-input
                  v-model:value="formData.childName"
                  placeholder="Nama Anak"
                  readonly
                  class="bg-white border-green-200"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Vaccine List Section -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <!-- Section Header -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Shield class="w-5 h-5 text-blue-600" />
                <h3 class="text-lg font-semibold text-gray-900">Daftar Vaksin</h3>
                <span
                  class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ submittedData.length }} Vaksin
                </span>
              </div>
              <button
                @click="inputImmunization = true"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <Plus class="w-4 h-4" />
                Tambah Vaksin
              </button>
            </div>
          </div>

          <!-- Vaccine Cards -->
          <div class="p-6">
            <!-- Empty State -->
            <div v-if="submittedData.length === 0" class="text-center py-12">
              <div
                class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
              >
                <Syringe class="w-10 h-10 text-gray-400" />
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Vaksin</h4>
              <p class="text-gray-500 mb-6">Anda belum menambahkan jenis vaksin apapun</p>
              <button
                @click="inputImmunization = true"
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus class="w-5 h-5" />
                Tambah Vaksin Pertama
              </button>
            </div>

            <!-- Vaccine Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="(item, index) in submittedData"
                :key="index"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <!-- Card Header -->
                <div class="flex justify-between items-start mb-4">
                  <div class="flex items-center gap-2">
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <Syringe class="w-4 h-4 text-blue-600" />
                    </div>
                    <n-tag type="info" size="small"> Vaksin {{ index + 1 }} </n-tag>
                  </div>

                  <n-dropdown
                    trigger="click"
                    :options="[
                      // {
                      //   label: 'Edit',
                      //   key: 'edit',
                      //   icon: () => h(Edit, { class: 'w-4 h-4' })
                      // },
                      {
                        label: 'Hapus',
                        key: 'delete',
                        icon: () => h(Trash2, { class: 'w-4 h-4' })
                      }
                    ]"
                    @select="(e: string | number) => handleDropdownSelect(index)(e.toString())"
                  >
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <MoreVertical class="w-4 h-4 text-gray-500" />
                    </button>
                  </n-dropdown>
                </div>

                <!-- Card Content -->
                <div class="space-y-4">
                  <!-- Vaccine Type -->
                  <div class="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <div class="flex items-center gap-2 mb-1">
                      <Syringe class="w-3 h-3 text-purple-600" />
                      <p class="text-xs font-semibold text-purple-800">Jenis Vaksin</p>
                    </div>
                    <p class="text-sm text-purple-700 font-medium">{{ item.vaccineInfo?.label }}</p>
                  </div>

                  <!-- Suggested Age -->
                  <div class="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div class="flex items-center gap-2 mb-1">
                      <Calendar class="w-3 h-3 text-green-600" />
                      <p class="text-xs font-semibold text-green-800">Usia Yang Dianjurkan</p>
                    </div>
                    <p class="text-sm text-green-700 font-medium">
                      {{ item.vaccineInfo?.suggestedAge }}
                    </p>
                  </div>

                  <!-- Date Given -->
                  <div class="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div class="flex items-center gap-2 mb-1">
                      <Calendar class="w-3 h-3 text-blue-600" />
                      <p class="text-xs font-semibold text-blue-800">Tanggal Pemberian</p>
                    </div>
                    <p class="text-sm text-blue-700 font-medium">Bulan {{ item.dateGiven }}</p>
                  </div>

                  <!-- Notes -->
                  <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div class="flex items-center gap-2 mb-1">
                      <FileText class="w-3 h-3 text-gray-600" />
                      <p class="text-xs font-semibold text-gray-800">Catatan</p>
                    </div>
                    <p class="text-sm text-gray-700">{{ item.note || 'Tidak ada catatan' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8">
          <n-button
            type="primary"
            size="large"
            class="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl font-semibold text-base"
            @click="handleSubmit"
            :disabled="submittedData.length === 0"
          >
            <template #icon>
              <Send class="w-5 h-5" />
            </template>
            Kirim Data Imunisasi ({{ submittedData.length }} Vaksin)
          </n-button>
        </div>
      </div>

      <!-- Modal -->
      <n-modal v-model:show="inputImmunization" @close="inputImmunization = false">
        <CreateData
          @submit="(data: EmitSubmit) => submittedData.push(data)"
          :childrenId="childrenId"
          @close="inputImmunization = false"
        />
      </n-modal>
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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.6s ease-out;
}

/* Custom button styling */
:deep(.n-button--primary-type) {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border: none;
}

:deep(.n-button--primary-type:hover) {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
}
</style>
