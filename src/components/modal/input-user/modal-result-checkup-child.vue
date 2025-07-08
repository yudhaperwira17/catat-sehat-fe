<script setup lang="ts">
import { useReadChildCheckupById } from '@/services/checkup-children'
import { computed } from 'vue'
import { X, User, Ruler, Weight, Circle, Calculator, FileText, Download } from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(['close'])

const { data: checkup, isLoading } = useReadChildCheckupById(computed(() => props.id))

interface Detail {
  label: string
  value: string
  valueClass: string
  icon: any
}

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

enum BMIStatus {
  MALNUTRITION = 'Malnutrisi',
  UNDERNUTRITION = 'Gizi Kurang',
  NORMAL = 'Normal',
  OVERWEIGHT = 'Berat Lebih',
  OBESITY = 'Obesitas'
}

const BMI_RANGES = {
  [Gender.FEMALE]: [
    {
      // 0-2 years
      min: 0,
      max: 2,
      ranges: [
        { min: 0, max: 11.9, status: BMIStatus.MALNUTRITION },
        { min: 12, max: 13.1, status: BMIStatus.UNDERNUTRITION },
        { min: 13.2, max: 18.4, status: BMIStatus.NORMAL },
        { min: 18.5, max: 20.4, status: BMIStatus.OVERWEIGHT },
        { min: 20.5, max: Infinity, status: BMIStatus.OBESITY }
      ]
    },
    {
      // 2-5 years
      min: 2,
      max: 5,
      ranges: [
        { min: 0, max: 11.6, status: BMIStatus.MALNUTRITION },
        { min: 11.7, max: 12.6, status: BMIStatus.UNDERNUTRITION },
        { min: 12.7, max: 18.7, status: BMIStatus.NORMAL },
        { min: 18.8, max: 20.9, status: BMIStatus.OVERWEIGHT },
        { min: 21, max: Infinity, status: BMIStatus.OBESITY }
      ]
    },
    {
      // 5-6 years
      min: 5,
      max: 6.1,
      ranges: [
        { min: 0, max: 11.7, status: BMIStatus.MALNUTRITION },
        { min: 11.8, max: 12.7, status: BMIStatus.UNDERNUTRITION },
        { min: 12.8, max: 17.1, status: BMIStatus.NORMAL },
        { min: 17.2, max: 19.7, status: BMIStatus.OVERWEIGHT },
        { min: 19.8, max: Infinity, status: BMIStatus.OBESITY }
      ]
    }
  ],
  [Gender.MALE]: [
    {
      // 0-2 years
      min: 0,
      max: 2,
      ranges: [
        { min: 0, max: 12.5, status: BMIStatus.MALNUTRITION },
        { min: 12.6, max: 13.5, status: BMIStatus.UNDERNUTRITION },
        { min: 13.6, max: 18.5, status: BMIStatus.NORMAL },
        { min: 18.6, max: 20.1, status: BMIStatus.OVERWEIGHT },
        { min: 20.2, max: Infinity, status: BMIStatus.OBESITY }
      ]
    },
    {
      // 2-5 years
      min: 2,
      max: 5,
      ranges: [
        { min: 0, max: 11.9, status: BMIStatus.MALNUTRITION },
        { min: 12, max: 12.8, status: BMIStatus.UNDERNUTRITION },
        { min: 12.9, max: 18.1, status: BMIStatus.NORMAL },
        { min: 18.2, max: 20.1, status: BMIStatus.OVERWEIGHT },
        { min: 20.2, max: Infinity, status: BMIStatus.OBESITY }
      ]
    },
    {
      // 5-6 years
      min: 5,
      max: 6.1,
      ranges: [
        { min: 0, max: 12.1, status: BMIStatus.MALNUTRITION },
        { min: 12.2, max: 13.1, status: BMIStatus.UNDERNUTRITION },
        { min: 13.2, max: 16.9, status: BMIStatus.NORMAL },
        { min: 17, max: 18.9, status: BMIStatus.OVERWEIGHT },
        { min: 19, max: Infinity, status: BMIStatus.OBESITY }
      ]
    }
  ]
}
// Dynamically map details based on checkup data
const details = computed<Detail[]>(() => [
  {
    label: 'Umur Anak',
    value: `${checkup.value?.children?.age ?? 'N/A'} tahun`,
    valueClass: 'text-blue-600 font-semibold',
    icon: User
  },
  {
    label: 'Tinggi Badan',
    value: `${checkup.value?.height ?? 'N/A'} cm`,
    valueClass: 'text-green-600 font-semibold',
    icon: Ruler
  },
  {
    label: 'Berat Badan',
    value: `${checkup.value?.weight ?? 'N/A'} kg`,
    valueClass: 'text-purple-600 font-semibold',
    icon: Weight
  },
  {
    label: 'Lingkar Kepala',
    value: `${checkup.value?.headCircumference ?? 'N/A'} cm`,
    valueClass: 'text-orange-600 font-semibold',
    icon: Circle
  }
])

const getBMIStatus = (bmi: number, gender: Gender, age: number) => {
  if (!bmi || !gender || age === undefined) {
    return { text: 'N/A', class: 'text-gray-500', bg: 'bg-gray-100' }
  }

  const ranges = BMI_RANGES[gender]
  const ageRange = ranges.find((r) => age >= r.min && age < r.max)

  if (!ageRange) {
    return { text: 'Tidak diketahui', class: 'text-gray-500', bg: 'bg-gray-100' }
  }

  const matchedRange = ageRange.ranges.find((range) => bmi >= range.min && bmi <= range.max)

  const statusColorMap = {
    [BMIStatus.MALNUTRITION]: { class: 'text-red-800', bg: 'bg-red-100' },
    [BMIStatus.UNDERNUTRITION]: { class: 'text-yellow-800', bg: 'bg-yellow-100' },
    [BMIStatus.NORMAL]: { class: 'text-green-800', bg: 'bg-green-100' },
    [BMIStatus.OVERWEIGHT]: { class: 'text-orange-800', bg: 'bg-orange-100' },
    [BMIStatus.OBESITY]: { class: 'text-red-900', bg: 'bg-red-200' }
  }

  const status = matchedRange?.status || 'Tidak diketahui'
  const color = statusColorMap[status as keyof typeof statusColorMap] || {
    class: 'text-gray-600',
    bg: 'bg-gray-100'
  }

  return { text: status, ...color }
}

const bmiStatus = computed(() => {
  const bmi = checkup.value?.bmi
  const gender = checkup.value?.children?.gender
  const age = checkup.value?.children?.age
  return getBMIStatus(bmi, gender, age)
})

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>

        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-full">
            <FileText class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Hasil Pemeriksaan</h2>
            <p class="text-sm text-gray-600 mt-1">Detail kesehatan anak</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <div
            class="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-600">Memuat hasil pemeriksaan...</p>
        </div>

        <!-- Content when loaded -->
        <div v-else class="p-6">
          <!-- Child Profile -->
          <div class="text-center mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div class="relative inline-block mb-4">
              <img
                :src="
                  checkup?.child?.childPicture?.path ||
                  'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                "
                alt="Profile picture"
                class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div
                class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
              >
                <User class="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">
              {{ checkup?.children.name || 'Nama tidak tersedia' }}
            </h3>
            <p class="text-sm text-gray-600">Hasil Pemeriksaan Kesehatan</p>
          </div>

          <!-- Measurement Details -->
          <div class="space-y-4 mb-6">
            <h4 class="font-semibold text-gray-900 text-lg mb-4">Data Pengukuran</h4>

            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="(detail, index) in details"
                :key="index"
                class="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <component :is="detail.icon" class="w-4 h-4 text-gray-600" />
                    </div>
                    <span class="text-gray-700 font-medium">{{ detail.label }}</span>
                  </div>
                  <span :class="detail.valueClass">{{ detail.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- BMI Section -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 text-lg mb-4">Indeks Massa Tubuh (BMI)</h4>
            <div
              class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-lg shadow-sm">
                    <Calculator class="w-5 h-5 text-indigo-600" />
                  </div>
                  <span class="text-gray-700 font-medium block">Nilai BMI</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-indigo-600">{{ checkup?.bmi || 'N/A' }}</div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 text-sm">Status</span>
                <span
                  :class="`px-3 py-1 rounded-full text-sm font-medium ${bmiStatus.bg} ${bmiStatus.class}`"
                >
                  {{ bmiStatus.text }}
                </span>
              </div>
            </div>
          </div>

          <!-- Document Section -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 text-lg mb-4">Dokumen Rujukan</h4>
            <div class="bg-orange-50 rounded-xl p-5 border border-orange-100">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <!-- Kiri: Info File -->
                <div class="flex items-start gap-4">
                  <div class="p-3 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <FileText class="w-6 h-6 text-orange-600" />
                  </div>
                  <div class="space-y-1">
                    <span class="text-gray-700 font-medium block">Surat Rujukan Stunting</span>
                    <span class="text-gray-500 text-sm block">Dokumen rujukan medis</span>
                  </div>
                </div>

                <!-- Kanan: Tombol Unduh / Tidak Tersedia -->
                <div>
                  <a
                    v-if="checkup?.fileDiagnosed?.path"
                    :href="checkup.fileDiagnosed.path"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <Download class="w-4 h-4" />
                    Unduh
                  </a>
                  <span
                    v-else
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg"
                  >
                    <FileText class="w-4 h-4" />
                    Tidak tersedia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 p-6 bg-gray-50">
        <div class="flex justify-between gap-3">
          <n-button
            type="tertiary"
            class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            @click="closeModal"
          >
            Kembali
          </n-button>
          <n-button
            type="primary"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            @click="closeModal"
          >
            Selesai
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
</style>
