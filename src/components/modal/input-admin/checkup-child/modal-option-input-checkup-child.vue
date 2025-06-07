<script setup lang="ts">
import { adminCheckupChildByCode, adminUpdateChildByCode } from '@/services/admin-child'
import { useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const props = defineProps<{
  code: string
}>()

type FormCode = {
  code?: string
}
const formCode = ref<FormCode>({
  code: undefined
})

const { mutate } = adminUpdateChildByCode(computed(() => formCode.value.code as string))
const {
  data: child,

  isPending
} = adminCheckupChildByCode(computed(() => formCode.value.code as string))

// State untuk modal
const showBarcodeScanner = ref(false)
const InputCode = ref(false)
const InputCheckupChild = ref(false)
const result = ref<string>('')
const message = useMessage()
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

  try {
    // Parse URL dan ambil query parameter 'code'
    const url = new URL(rawValue)
    const code = url.searchParams.get('code') // Ambil kode dari query string

    console.log('Extracted Code:', code)

    // Pastikan kode ditemukan sebelum melanjutkan
    if (!code) {
      message.error('Kode tidak ditemukan dalam QR Code')
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
          InputCheckupChild.value = true
          message.success('Data berhasil ditemukan')
        },
        onError: (error) => {
          console.error('Error:', error)
          message.error('Gagal memproses kode')
        }
      }
    )

    // Simpan hasil QR Code ke result.value
    result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  } catch (error) {
    console.error('Invalid QR Code format:', error)
    message.error('Format QR Code tidak valid')
  }
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

type BarcodeFormatKeys = keyof typeof barcodeFormats.value

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

// State untuk error handling
const error = ref('')

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

const InputCodeChild = ref(false)
// Function to handle modal close action (if needed)
const closeModal = () => {
  console.log('Modal closed')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Opsi Tambah Pemeriksaan</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="flex justify-center space-x-4 mb-4">
        <n-button
          class="bg-pink-500 text-white py-2 px-4 rounded-md"
          @click="showBarcodeScanner = true"
        >
          Scan Barcode
        </n-button>

        <!-- Modal Kamera untuk Scan Barcode -->
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
          ><modal-input-admin-checkup-child-modal-input-checkup-child
            :code="formCode.code as string"
            @close="InputCheckupChild = false"
        /></n-modal>
        <n-button class="bg-pink-500 text-white py-2 px-4 rounded-md" @click="InputCodeChild = true"
          >Input Kode</n-button
        >
        <n-modal v-model:show="InputCodeChild"
          ><modal-input-admin-checkup-child-modal-input-code-child
            :code="props.code"
            @close="InputCodeChild = false"
        /></n-modal>
      </div>
      <div class="flex justify-end">
        <button
          class="border border-gray-300 text-gray-700 py-2 px-4 rounded-md"
          @click="$emit('close')"
        >
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
