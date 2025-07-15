<script setup lang="tsx">
import CreateData from '@/components/modal/input-admin/bmi-input.vue'
import Export from '@/components/mother/Export.vue'
import DetailCheckupChild from '@/components/mother/action-checkup.vue'
import {
  adminUpdateMotherByCode,
  useAdminReadCheckupMother,
  type Daum
} from '@/services/admin-checkup-mother'
import type { DataCheckup } from '@/services/checkup-parents'
import { DateTime } from 'luxon'
import { useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const pagination = ref({
  page: 1,
  pageSize: 10,
  search: ''
  // itemCount: 100 // Adjust as needed
})

const selectedDate = ref<number | null>()
const selectedStatus = ref<string | null>()
const { data: checkupData, refetch } = useAdminReadCheckupMother(
  computed(() => {
    return {
      page: pagination.value.page,
      limit: pagination.value.pageSize,
      search: pagination.value.search,
      createdAt: selectedDate.value
        ? DateTime.fromMillis(selectedDate.value).toFormat('yyyy-MM-dd')
        : undefined,
      bmiStatus: selectedStatus.value
    }
  })
)

const itemsCheckup = computed(() => {
  return checkupData.value?.data.map((checkup) => {
    return {
      id: checkup.id,
      name: checkup.mother.name,
      month: checkup.month,
      location: checkup.location || checkup.healthPost?.name,
      date: checkup.createdAt ? DateTime.fromISO(checkup.createdAt).toFormat('dd LLL yyyy') : '',
      staff: checkup.publicStaff || checkup.admin.name,
      bmi: checkup.bmi,
      bmiStatus: checkup.bmiStatus,
      status: checkup.status,
      fileDiagnosed: checkup.fileDiagnosed?.path,
      type: checkup.type
    }
  })
})
const bmiCategoryMapper: Record<string, string> = {
  MALNUTRITION: 'Malnutrisi',
  UNDERNUTRITION: 'Kurang Gizi',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Kelebihan Berat Badan',
  OBESITY: 'Obesitas'
}

//camera
const error = ref('')
const { mutate } = adminUpdateMotherByCode(computed(() => formCode.value.code as string))

type FormCode = {
  code?: string
}
const formCode = ref<FormCode>({
  code: undefined
})

const message = useMessage()
const showBarcodeScanner = ref(false)
const showExport = ref(false)
const InputCode = ref(false)
const result = ref<string>('')
const createData = ref(false)

type CameraConstraint = {
  label: string
  constraints: { facingMode?: string; deviceId?: string }
}

// Fungsi untuk menangani hasil scan
function onDetect(detectedCodes: Array<{ rawValue: string; cornerPoints: any }>) {
  if (!detectedCodes.length) return // Pastikan ada hasil dari deteksi QR Code

  console.log('Full QR Raw Value:', detectedCodes[0].rawValue)

  // Ambil rawValue dari QR Code
  const rawValue = detectedCodes[0].rawValue

  // Parse URL untuk mengambil query parameter 'code'
  const url = new URL(rawValue)
  const code = url.searchParams.get('code') // Ambil nilai parameter 'code'

  console.log('Extracted Code:', code)

  // Pastikan code ditemukan sebelum melanjutkan
  if (!code) {
    message.error('Kode tidak ditemukan di dalam URL')
    return
  }

  // Update formCode dengan kode yang sudah diambil
  formCode.value.code = code

  // Mutasi data dengan kode yang sudah diambil
  mutate(
    { code: formCode.value.code },
    {
      onSuccess: () => {
        showBarcodeScanner.value = false
        InputCode.value = true
        message.success('Data berhasil ditemukan')

        // Navigasi langsung ke halaman dengan code dari QR
        createData.value = true
      },
      onError: (error) => {
        console.error('Error:', error)
        message.error('Gagal memproses kode')
      }
    }
  )

  // Simpan hasil QR Code ke result.value
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
}

// State untuk memilih kamera
const selectedConstraints = ref({ facingMode: 'environment' })

const defaultConstraintOptions: CameraConstraint[] = [
  { label: 'rear camera', constraints: { facingMode: 'environment' } },
  { label: 'front camera', constraints: { facingMode: 'user' } }
]
const constraintOptions = ref(defaultConstraintOptions)

async function onCameraReady() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(({ kind }) => kind === 'videoinput')

  constraintOptions.value = [
    ...defaultConstraintOptions,
    ...videoDevices.map(({ deviceId, label }) => ({
      label: `${label} (ID: ${deviceId})`,
      constraints: { deviceId }
    }))
  ]

  error.value = ''
}
// Fungsi tracking untuk QR code
function paintOutline(detectedCodes: any, ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}
function paintBoundingBox(detectedCodes: any, ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height }
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}

function paintCenterText(detectedCodes: any, ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox, rawValue } = detectedCode

    const centerX = boundingBox.x + boundingBox.width / 2
    const centerY = boundingBox.y + boundingBox.height / 2
    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'

    ctx.lineWidth = 3
    ctx.strokeStyle = '#35495e'
    ctx.strokeText(detectedCode.rawValue, centerX, centerY)

    ctx.fillStyle = '#5cb984'
    ctx.fillText(rawValue, centerX, centerY)
  }
}

const trackFunctionOptions = [
  { text: 'nothing (default)', value: undefined },
  { text: 'outline', value: paintOutline },
  { text: 'centered text', value: paintCenterText },
  { text: 'bounding box', value: paintBoundingBox }
]
const trackFunctionSelected = ref(trackFunctionOptions[1])

// State untuk format barcode
const barcodeFormats = ref({
  aztec: false,
  code_128: false,
  code_39: false,
  code_93: false,
  codabar: false,
  databar: false,
  databar_expanded: false,
  data_matrix: false,
  dx_film_edge: false,
  ean_13: false,
  ean_8: false,
  itf: false,
  maxi_code: false,
  micro_qr_code: false,
  pdf417: false,
  qr_code: true,
  rm_qr_code: false,
  upc_a: false,
  upc_e: false,
  linear_codes: false,
  matrix_codes: false
} as const)

const selectedBarcodeFormats = computed<
  (
    | 'aztec'
    | 'code_128'
    | 'code_39'
    | 'code_93'
    | 'codabar'
    | 'databar'
    | 'databar_expanded'
    | 'data_matrix'
    | 'dx_film_edge'
    | 'ean_13'
    | 'ean_8'
    | 'itf'
    | 'maxi_code'
    | 'micro_qr_code'
    | 'pdf417'
    | 'qr_code'
    | 'rm_qr_code'
    | 'upc_a'
    | 'upc_e'
    | 'linear_codes'
    | 'matrix_codes'
  )[]
>(() => {
  return Object.keys(barcodeFormats.value).filter(
    (format) => barcodeFormats.value[format as keyof typeof barcodeFormats.value]
  ) as Array<keyof typeof barcodeFormats.value>
})

function onError(err: Error) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'You need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    error.value += 'No camera on this device'
  } else if (err.name === 'NotSupportedError') {
    error.value += 'Secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value += 'Is the camera already in use?'
  } else {
    error.value += err.message
  }
}

const columns = [
  { title: 'NAMA IBU', key: 'name' },
  { title: 'NAMA USIA KEHAMILAN', key: 'month' },
  {
    title: 'LOKASI',
    key: 'location'
  },
  { title: 'TANGGAL', key: 'date' },
  { title: 'PETUGAS', key: 'staff' },
  {
    title: 'BMI',
    key: 'bmi'
  },
  {
    title: 'Status BMI',
    key: 'bmiStatus',
    render(row: DataCheckup) {
      const bmiCategory = row.bmiStatus
      const bmiDisplay = `${bmiCategoryMapper[bmiCategory] || 'Tidak Diketahui'}`
      const color = {
        MALNUTRION: '#F87171',
        UNDERNUTRITION: '#F87171',
        NORMAL: '#34D399',
        OVERWEIGHT: '#FBBF24',
        OBESITY: '#FBBF24'
      }

      return (
        <div
          style={{
            backgroundColor: color[bmiCategory as keyof typeof color] || 'gray',
            color: 'black',
            padding: '5px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          {bmiDisplay}
        </div>
      )
    }
  },
  {
    title: 'TYPE',
    key: 'type'
  },
  {
    title: 'STATUS',
    key: 'status',
    render(row: any) {
      if (row.status === 'UNVERIFIED') {
        return h(
          'span',
          {
            class: 'inline-block px-4 py-2 bg-red-500 text-white rounded whitespace-nowrap'
          },
          'Belum Terverifikasi'
        )
      } else if (row.status === 'VERIFIED') {
        return h(
          'span',
          {
            class: 'inline-block px-4 py-2 bg-green-500 text-white rounded whitespace-nowrap'
          },
          'Terverifikasi'
        )
      } else {
        return h(
          'span',
          {
            class: 'inline-block px-4 py-2 bg-gray-500 text-white rounded whitespace-nowrap'
          },
          'Status Tidak Diketahui'
        )
      }
    }
  },
  {
    title: 'DIAGNOSIS',
    key: 'fileDiagnosed',
    render(row: { fileDiagnosed: string }) {
      return row.fileDiagnosed ? (
        <a
          class="z-50 text-blue-500 hover:underline"
          href={row.fileDiagnosed}
          target="_blank"
          rel="noopener noreferrer"
          title="Unduh Surat Rujukan"
        >
          {' '}
          Surat Rujukan
        </a>
      ) : (
        <span class="text-gray-500">Tidak Ada File</span>
      )
    }
  },
  {
    title: ' ',
    key: 'action',
    render(row: Daum) {
      return h(
        DetailCheckupChild,
        {
          type: 'primary',
          size: 'small',
          id: row.id,
          key: row.id,
          isAdmin: row.type === 'ADMIN' ? true : false,
          onRefetch: () => refetch(),
          onClick: () => console.log(row)
        },
        { default: () => 'Lihat Detail' }
      )
    }
  }
]
// const search = ref('')
// const onSearch = () => {
//   pagination.value.search = search.value
// }
//gimik
const bmiStatistics = computed(() => {
  if (!checkupData.value?.data) return []

  const data = checkupData.value.data
  const total = data.length

  // Hitung jumlah setiap kategori BMI
  const counts = data.reduce(
    (acc, item) => {
      const status = item.bmiStatus
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Buat array statistik dengan warna yang sesuai
  const statistics = [
    {
      label: 'Normal',
      value: counts.NORMAL || 0,
      percentage: total > 0 ? (((counts.NORMAL || 0) / total) * 100).toFixed(1) : '0',
      color: '#10B981', // Green
      bgColor: '#ECFDF5',
      icon: '✓'
    },
    {
      label: 'Obesitas',
      value: counts.OBESITY || 0,
      percentage: total > 0 ? (((counts.OBESITY || 0) / total) * 100).toFixed(1) : '0',
      color: '#EF4444', // Red
      bgColor: '#FEF2F2',
      icon: '⚠'
    },
    {
      label: 'Kelebihan Berat Badan',
      value: counts.OVERWEIGHT || 0,
      percentage: total > 0 ? (((counts.OVERWEIGHT || 0) / total) * 100).toFixed(1) : '0',
      color: '#F59E0B', // Orange
      bgColor: '#FFFBEB',
      icon: '⚡'
    },
    {
      label: 'Kurang Gizi',
      value: counts.UNDERNUTRITION || 0,
      percentage: total > 0 ? (((counts.UNDERNUTRITION || 0) / total) * 100).toFixed(1) : '0',
      color: '#8B5CF6', // Purple
      bgColor: '#F3F4F6',
      icon: '⬇'
    },
    {
      label: 'Malnutrisi',
      value: counts.MALNUTRITION || 0,
      percentage: total > 0 ? (((counts.MALNUTRITION || 0) / total) * 100).toFixed(1) : '0',
      color: '#DC2626', // Dark Red
      bgColor: '#FEF2F2',
      icon: '⚠'
    }
  ]

  return statistics.filter((stat) => stat.value > 0) // Hanya tampilkan yang ada datanya
})

const totalCheckups = computed(() => {
  return checkupData.value?.data.length || 0
})

watch(selectedDate || selectedStatus, () => {
  refetch()
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow overflow-auto">
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col space-y-2 text-black">
        <h1 class="text-base font-semibold">Pemeriksaan Ibu Hamil</h1>
        <p class="text-sm font-normal">Informasi tentang data pemeriksaan ibu hamil</p>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Rekap Status BMI</h3>
      <n-grid :cols="5" :x-gap="16" :y-gap="16" responsive="screen">
        <!-- Total Pemeriksaan Card -->
        <n-grid-item>
          <n-card class="hover:shadow-md transition-shadow duration-200">
            <div class="text-center">
              <div class="text-3xl mb-2">📊</div>
              <n-statistic label="Total Pemeriksaan" :value="totalCheckups" />
            </div>
          </n-card>
        </n-grid-item>

        <!-- BMI Status Cards -->
        <n-grid-item v-for="stat in bmiStatistics" :key="stat.label">
          <n-card
            class="hover:shadow-md transition-shadow duration-200"
            :style="{
              backgroundColor: stat.bgColor,
              borderLeft: `4px solid ${stat.color}`
            }"
          >
            <div class="text-center">
              <div class="text-2xl mb-2">{{ stat.icon }}</div>
              <n-statistic
                :label="stat.label"
                :value="stat.value"
                :value-style="{ color: stat.color, fontWeight: 'bold' }"
              />
              <div class="text-sm text-gray-600 mt-1">{{ stat.percentage }}% dari total</div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
    <div class="bg-white rounded-lg p-4">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 class="text-base font-medium">Data Pemeriksaan</h3>
        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div class="flex w-full sm:w-auto gap-2">
            <n-date-picker
              v-model:value="selectedDate"
              type="date"
              clearable
              placeholder="Pilih tanggal"
            />
            <n-select
              v-model:value="selectedStatus"
              :options="[
                { label: 'Malnutrisi', value: 'MALNUTRITION' },
                { label: 'Kurang Gizi', value: 'UNDERNUTRITION' },
                { label: 'Normal', value: 'NORMAL' },
                { label: 'Kelebihan Berat Badan', value: 'OVERWEIGHT' },
                { label: 'Obesitas', value: 'OBESITY' },
              ]"
              placeholder="Pilih Status"
              clearable
              class="w-64"
            />
            <!-- <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-9 w-80"
              placeholder="Search"
              type="text"
              @keydown.enter="onSearch"
            />
            <n-button @click="onSearch" type="primary" class="rounded-lg ml-2">
              <i-material-symbols:search></i-material-symbols:search>
            </n-button> -->
          </div>
          <n-button type="primary" @click="showExport = true" class="rounded-lg">
            <i-material-symbols:file-export-sharp></i-material-symbols:file-export-sharp>
            Get Excel
          </n-button>
          <n-button type="primary" @click="showBarcodeScanner = true" class="rounded-lg">
            Tambah Pemeriksaan
          </n-button>
          <n-modal v-model:show="showBarcodeScanner" title="Scan Barcode" preset="card">
            <div class="p-4">
              <qrcode-stream
                :constraints="selectedConstraints"
                :track="trackFunctionSelected.value"
                :formats="selectedBarcodeFormats"
                @error="onError"
                @detect="onDetect"
                @camera-on="onCameraReady"
              />
              <div class="flex justify-end mt-4">
                <n-button type="primary" @click="showBarcodeScanner = false">Tutup</n-button>
              </div>
            </div>
          </n-modal>
        </div>
      </div>
      <n-modal v-model:show="createData"
        ><CreateData :code="formCode.code as string" @close="createData = false"
      /></n-modal>
      <n-modal v-model:show="showExport" class="!w-auto !max-w-md">
        <Export @close="showExport = false" />
      </n-modal>
      <div class="w-full overflow-x-auto">
        <div class="min-w-[900px]">
          <n-data-table
            pagination-behavior-on-filter="first"
            class="md:min-w-max text-center whitespace-nowrap"
            :columns="columns"
            :data="itemsCheckup"
          />
        </div>
      </div>
      <n-pagination
        v-model:page="pagination.page"
        :page-count="checkupData?.meta?.totalPage"
        class="mt-4"
      />
      <!-- <n-pagination v-model:page="pagination.page" class="mt-4" /> -->
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
</route>
