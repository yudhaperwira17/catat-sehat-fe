<script setup lang="ts">
import DetailPosyandu from '@/components/componen-admin/action-immunization-ops.vue'
import CreateSchedule from '@/components/modal/input-admin/checkup-child/input-immunization-optional.vue'
import { adminUpdateMotherByCode } from '@/services/admin-checkup-child'
import { useAdminReadImmunizationOptional } from '@/services/admin-immunization'
import { DateTime } from 'luxon'
import { NButton, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 4
})

const { data: schedules } = useAdminReadImmunizationOptional(params)
const search = ref('')
const createData = ref(false)

export interface RootObject {
  message: string
  data: Data
  status: number
}
export interface Data {
  data: Datum[]
  meta: Meta
}
interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}
export interface Datum {
  id: string
  name: string
  dateGiven: number
  note: string
  childrenId: string
  createdAt: string
  updatedAt: string
  deletedAt?: any
  children: Children
}
interface Children {
  id: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  childOrder: number
  bloodType: string
  height: number
  weight: number
  address: string
  gender: string
  code: string
  userId: string
  motherId: string
  childPictureId?: any
  birthCertificateId?: any
  kiaCardId?: any
  familyCardId?: any
  createdAt: string
  updatedAt: string
  deletedAt?: any
  mother: Mother
}
interface Mother {
  id: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  address: string
  code: string
  userId: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt?: any
}

const itemsSchedule = computed(() => {
  return schedules.value?.data.map((schedule: Datum) => {
    return {
      id: schedule.id,
      createdAt: DateTime.fromISO(schedule.createdAt).toFormat('dd LLL yyyy'),
      childName: schedule.children.name,
      motherName: schedule.children.mother.name,
      vaccine: schedule.name,
      date: schedule.dateGiven,
      note: schedule.note
    }
  })
})

// Column definitions for the table
const columns = ref([
  {
    title: 'TANGGAL',
    key: 'createdAt'
  },
  {
    title: 'NAMA ANAK',
    key: 'childName'
  },
  {
    title: 'NAMA IBU',
    key: 'motherName'
  },
  {
    title: 'NAMA VAKSIN',
    key: 'vaccine'
  },
  {
    title: 'UMUR',
    key: 'date'
  },
  {
    title: 'CATATAN',
    key: 'note'
  },
  {
    title: 'Aksi',
    key: 'action',
    render(data: { id: string }) {
      return h('div', [
        h(DetailPosyandu, {
          id: data.id
        })
      ])
    }
  }
])

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
const InputCode = ref(false)
const result = ref<string>('')
const InputCheckupChild = ref(false)

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
        InputCheckupChild.value = true
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

const onSearch = () => {
  params.value.search = search.value
}
</script>

<template>
  <div class="bg-white rounded-lg overflow-auto p-6">
    <div class="flex justify-end items-center mb-6">
      <div>
        <div class="flex items-center space-x-4"></div>
      </div>
    </div>
    <div>
      <h1 class="md:-2xl sm:text-base font-semibold">Jadwal Posyandu</h1>
      <p class="text-gray-600 sm:text-sm font-normal">Informasi tentang jadwal posyandu</p>
    </div>
    <div class="flex flex-col bg-white rounded-lg overflow-auto">
      <div
        class="flex flex-col md:flex-row justify-end w-full mb-6 space-y-4 md:items-center md:space-y-0"
      >
        <div class="flex items-center gap-2 w-full md:w-auto">
          <n-input
            v-model:value="search"
            class="w-full md:w-80"
            placeholder="Search"
            type="text"
            size="small"
            @keydown.enter="onSearch"
          />
          <n-button @click="onSearch" type="primary" size="small" class="text-white">
            <i-material-symbols:search class="text-lg" />
          </n-button>
          <n-button
            @click="showBarcodeScanner = true"
            type="primary"
            size="small"
            class="text-white"
          >
            <i-mdi:plus class="mr-1" /> Tambah Catatan
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
          <n-modal v-model:show="InputCheckupChild"
            ><CreateSchedule :code="formCode.code as string" @close="createData = false"
          /></n-modal>
        </div>
      </div>

      <div class="overflow-x-auto">
        <n-data-table
          :columns="columns"
          :data="itemsSchedule"
          pagination-behavior-on-filter="first"
          class="justify-center text-center overflow-x-auto min-w-[768px] w-full"
        />
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>
