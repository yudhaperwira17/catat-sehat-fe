<script setup lang="tsx">
import DetailImmunization from '@/components/componen-admin/detail-immunization.vue'
import router from '@/router'
import { adminUpdateChildByCode } from '@/services/admin-child'
import { useAdminReadImmunization, type DataImmunization } from '@/services/admin-immunization'
import { useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  limit: 10,
  search: ''
})
const { data: immunization, refetch } = useAdminReadImmunization(params)

//camera
const error = ref('')
const { mutate } = adminUpdateChildByCode(computed(() => formCode.value.code as string))

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
        router.push(`/admin/immunization/${formCode.value.code}`)
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

const itemsImmunization = computed(() => {
  return immunization.value?.data?.map((immunization) => {
    return {
      id: immunization.id,
      mother: immunization.children?.mother?.name ?? 'Tidak diketahui',
      childName: immunization.children?.name ?? 'Tidak diketahui',
      vaccine: immunization.vaccineStage?.name ?? 'Tidak diketahui',
      dateGiven: immunization.dateGiven,
      immunizationStatus: immunization.vaccineStatus ?? -1,
      note: immunization.note ?? '-'
    }
  }) ?? []
})
const vaccineStatusMapper: Record<number, string> = {
  0: 'Dilarang',
  1: 'Tepat Waktu',
  2: 'Terlambat',
  3: 'Kejar'
}

const dategivenMapper: Record<number, string> = {
  0: 'Bulan 0',
  1: 'Bulan 1',
  2: 'Bulan 2',
  3: 'Bulan 3',
  4: 'Bulan 4',
  5: 'Bulan 5',
  6: 'Bulan 6',
  7: 'Bulan 7',
  8: 'Bulan 8',
  9: 'Bulan 9',
  10: 'Bulan 10',
  11: 'Bulan 11',
  12: 'Bulan 12',
  18: 'Bulan 18',
  23: 'Bulan 23',
  24: 'Bulan 24-59'
}

const columns = [
  { title: 'NAMA IBU', key: 'mother' },
  { title: 'NAMA ANAK', key: 'childName' },
  { title: 'NAMA VAKSIN', key: 'vaccine' },
  {
    title: 'TANGGAL PEMBERIAN',
    key: 'dateGiven',
    render: (row: DataImmunization) => {
      const dateDisplay = dategivenMapper[row.dateGiven] || 'Tidak Diketahui'
      return <div>{dateDisplay}</div>
    }
  },
  {
    title: 'STATUS IMUNISASI',
    key: 'immunizationStatus',
    render: (row: DataImmunization) => {
      const statusCategory = row.immunizationStatus
      const statusDisplay = `${vaccineStatusMapper[statusCategory]}`
      const color = {
        0: '#E3E3E3',
        1: '#DEF7EC',
        2: '#FDF6B2',
        3: '#FDE8E8'
      }
      return (
        <div
          style={{
            backgroundColor: color[statusCategory as keyof typeof color] || 'gray',
            color: 'black',
            padding: '5px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          {statusDisplay}
        </div>
      )
    }
  },
  { title: 'CATATAN', key: 'note' },
  {
    title: ' ',
    key: 'action',
    render(row: DataImmunization) {
      return h(
        DetailImmunization,
        {
          type: 'primary',
          size: 'small',
          id: row.id,
          onRefetch: () => refetch(),
          onClick: () => console.log(row) // Panggil modal saat tombol diklik
        },
        { default: () => 'Lihat Detail' }
      )
    }
  }
]
const search = ref('')
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow overflow-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col space-y-2 text-black">
        <h1 class="text-base font-semibold">Imunisasi</h1>
        <p class="text-sm font-normal">Informasi tentang data Imunisasi</p>
      </div>
    </div>

    <!-- Data Pemeriksaan Section for Desktop -->
    <div class="hidden md:block bg-white rounded-lg overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <!-- Header Title -->
        <h3 class="text-base font-medium">Data Pemberian Imunisasi</h3>

        <!-- Actions: Search Input and Buttons -->
        <div class="flex items-center gap-2">
          <!-- Search Input -->
          <div class="relative flex items-center">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-9 w-80"
              placeholder="Search"
              type="text"
              @keydown.enter="params.search = search"
            />
            <n-button @click="params.search = search" type="primary" class="rounded-lg ml-2">
              <i-material-symbols:search></i-material-symbols:search>
            </n-button>
          </div>
          <!-- Add Button -->
          <n-button type="primary" @click="showBarcodeScanner = true" class="rounded-lg">
            Tambah Pemeriksaan
          </n-button>
          <!-- Modal -->
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
      <div class="overflow-x-auto">
        <n-data-table
          pagination-behavior-on-filter="first"
          :columns="columns"
          :data="itemsImmunization"
          class="min-w-max"
        />
      </div>
      <n-pagination
        v-model:page="params.page"
        :page-count="immunization?.meta?.totalPage"
        class="mt-4"
      />
    </div>
    <!-- Mobile View for Data Checkup -->
    <!-- <div class="flex flex-col justify-center md:hidden gap-2">
      <div class="flex flex-row gap-2 mb-6">
        <div class="relative w-full">
          <n-input
            v-model:value="search"
            class="border border-gray-300 rounded-lg h-9 w-80"
            placeholder="Search"
            type="text"
            @keydown.enter="params.search = search"
          />
        </div>
        <n-button @click="params.search = search" type="primary" class="rounded-lg ml-2">
          <i-material-symbols:search></i-material-symbols:search>
        </n-button>
      </div>
      <div class="flex md:hidden justify-end mb-6">
        <n-button type="primary" class="rounded-lg text-xs" @click="showBarcodeScanner = true"
          >Tambah Pemeriksaan</n-button
        >
      </div>
      <p class="text-base font-semibold">Data Pemeriksaan Imunisasi</p>
      <div v-for="(row, index) in itemsImmunization" :key="index">
        <Mobile
          :id="row.id"
          :mother="row.mother"
          :children="row.children"
          :vaccine="row.vaccine"
          :dateGiven="row.dateGiven"
          :vaccineStatus="row.immunizationStatus"
          :note="row.note"
        />
      </div>
      <n-pagination
        v-model:page="params.page"
        :page-count="immunization?.meta?.totalPage"
        :pagination="params"
        class="mt-4"
      />
    </div> -->
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>
