<script setup lang="tsx">
import AdminDataChildrenCheckup from '@/components/admin/data/children-checkup.vue'
import DetailCheckupChild from '@/components/componen-admin/detail-checkup-child.vue'
import ModalInputAdminCheckupChild from '@/components/modal/input-admin/checkup-child/modal-input-checkup-child.vue'
import { adminUpdateMotherByCode, useAdminReadCheckupChild } from '@/services/admin-checkup-child'
import { useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const pagination = ref({
  page: 1,
  pageSize: 10,
  search: ''
  // itemCount: 100 // Adjust as needed
})
const {
  data: checkupData,

  refetch
} = useAdminReadCheckupChild(
  computed(() => {
    return {
      page: pagination.value.page,
      limit: pagination.value.pageSize,
      search: pagination.value.search
    }
  })
)

interface Checkup {
  id: string
  name?: string
  healthPostId?: string
  dateTime?: number
  staff?: string
  height?: number
  weight?: number
  headCircumference?: number
  fileDiagnosedId?: string
  child: {
    name: string
  }
  month?: number
  bmi?: number
  bmiStatus?: number
  status?: number
}

// const healthFacilityMapper: Record<string, string> = {
//   posyandu: 'Posyandu',
//   puskesmas: 'Puskesmas',
//   hospital: 'Klinik',
//   others: 'Lainnya'
// }
const itemsCheckup = computed(() => {
  return checkupData.value?.data.map((checkup) => {
    return {
      id: checkup.id,
      name: checkup.children.name,
      healthPost: checkup.healthPost?.name,
      dateTime: checkup.createdAt
        ? new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(checkup.createdAt))
        : '', // Check for undefined
      staff: checkup.admin?.name,
      height: checkup.height,
      weight: checkup.weight,
      headCircumference: checkup.headCircumference,
      fileDiagnosed: checkup.fileDiagnosed?.path,
      bmi: Math.round(checkup.bmi),
      bmiStatus: checkup.bmiStatus,
      status: checkup.status,
      time: checkup.createdAt
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

const columns = [
  { title: 'NAMA', key: 'name' },
  {
    title: 'INSTANSI KESEHATAN',
    key: 'healthPost',
    render(row: any) {
      const healthPostDisplay = `${row.healthPost} `
      return healthPostDisplay
    }
  },
  { title: 'TANGGAL PEMERIKSAAN', key: 'dateTime' },
  { title: 'PETUGAS', key: 'staff' },
  {
    title: 'BMI ANAK',
    key: 'bmi',
    render(row: any) {
      // Ambil kategori langsung dari backend
      const bmiCategory = row.bmiStatus
      const bmiDisplay = `${row.bmi} ${bmiCategoryMapper[bmiCategory] || 'Tidak Diketahui'}`
      const color = {
        MALNUTRION: '#FFFFF', // Merah
        UNDERNUTRITION: '#FFFFF', // Merah
        NORMAL: '#FFFFF', // Hijau
        OVERWEIGHT: '#FFFFF', // Kuning
        OBESITY: '#FFFFF' // Kuning
      }

      return (
        <div
          style={{
            backgroundColor: color[bmiCategory as keyof typeof color] || 'gray', // Warna default jika kategori tidak ditemukan
            color: 'black', // Warna teks untuk kontras
            padding: '5px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          {bmiDisplay} {/* Tampilkan angka BMI dan kategori */}
        </div>
      )
    }
  },
  {
    title: 'STATUS',
    key: 'status',
    render(row: any) {
      console.log(row.status) // Debug: Periksa nilai status

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
    render(row: Checkup) {
      return h(
        DetailCheckupChild,
        {
          type: 'primary',
          size: 'small',
          id: row.id,
          key: row.id,
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
        <h1 class="text-base font-semibold">Pemeriksaan Anak</h1>
        <p class="text-sm font-normal">Informasi tentang data pemeriksaan anak</p>
      </div>
    </div>
    <!-- Data Pemeriksaan Section for Desktop -->
    <div class="hidden md:block bg-white rounded-lg overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <!-- Header Title -->
        <h3 class="text-base font-medium">Data Pemeriksaan</h3>

        <!-- Actions: Search Input and Buttons -->
        <div class="flex items-center gap-2">
          <!-- Search Input -->
          <div class="relative flex items-center">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-9 w-80"
              placeholder="Search"
              type="text"
              @keydown.enter="pagination.search = search"
            />
            <n-button @click="pagination.search = search" type="primary" class="rounded-lg ml-2">
              <i-material-symbols:search></i-material-symbols:search>
            </n-button>
          </div>
          <!-- Add Button -->
          <n-button type="primary" @click="showBarcodeScanner = true" class="rounded-lg">
            Tambah Pemeriksaan
          </n-button>

          <!-- Modal -->
          <!-- <n-modal v-model:show="InputChild">
            <modal-input-admin-checkup-child-modal-option-input-checkup-child
              :code="props.code"
              @close="InputChild = false"
            />
          </n-modal> -->
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
      <n-modal v-model:show="InputCheckupChild"
        ><ModalInputAdminCheckupChild
          :code="formCode.code as string"
          @close="InputCheckupChild = false"
      /></n-modal>
      <div class="overflow-x-auto">
        <n-data-table
          pagination-behavior-on-filter="first"
          class="md:min-w-max"
          :columns="columns"
          :data="itemsCheckup"
        />
      </div>
      <n-pagination
        v-model:page="pagination.page"
        :page-count="checkupData?.meta?.totalPage"
        class="mt-4"
      />
    </div>

    <!-- Mobile View for Data Checkup -->
    <div class="flex flex-col justify-center md:hidden gap-2">
      <!-- Search Input -->
      <div class="flex flex-row gap-2 mb-6">
        <div class="relative w-full">
          <n-input
            v-model:value="search"
            class="border border-gray-300 rounded-lg h-9 w-80"
            placeholder="Search"
            type="text"
            @keydown.enter="pagination.search = search"
          />
          <!-- <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i> -->
        </div>
        <n-button @click="pagination.search = search" type="primary" class="rounded-lg ml-2">
          <i-material-symbols:search></i-material-symbols:search>
        </n-button>
      </div>

      <div class="flex md:hidden justify-end mb-6">
        <n-button type="primary" class="rounded-lg text-xs" @click="showBarcodeScanner = true"
          >Tambah Pemeriksaan</n-button
        >
      </div>

      <p class="text-base font-semibold">Data Pemeriksaan</p>
      <div
        v-for="(row, index) in itemsCheckup"
        :key="index"
        class="flex flex-col items-center space-y-4"
      >
        <AdminDataChildrenCheckup
          :id="row.id"
          :date="row.dateTime"
          :time="row.dateTime"
          :status="row.status"
          :name="row.name"
          :healthpost="row.healthPost"
          :officer="row.staff"
          :fileDiagnosedId="row.fileDiagnosed"
        />
      </div>
      <n-pagination
        v-model:page="pagination.page"
        :page-count="checkupData?.meta?.totalPage"
        class="mt-4"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
</route>
