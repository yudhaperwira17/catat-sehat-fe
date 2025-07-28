<script setup lang="ts">
import { API } from '@/composable/http/api-constant'
import { http } from '@/composable/http/http'
import { NDatePicker, useMessage } from 'naive-ui'

const selectedDate = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)
const isLoading = ref(false)
const message = useMessage()
const emit = defineEmits(['close'])
const filterMode = ref<'tanggal' | 'bulan'>('tanggal');

function handleFilterChange(val: string) {
  if (val === 'tanggal') selectedMonth.value = null;
  else selectedDate.value = null;
}

const exportParams = computed(() => {
  const params: Record<string, any> = {}

  if (selectedDate.value) {
    const date = new Date(selectedDate.value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    params.createdAt = `${year}-${month}-${day}`
  }

  if (selectedMonth.value) {
    const date = new Date(selectedMonth.value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    params.month = `${year}-${month}`
  }

  return params
})

const handleExport = async () => {
  try {
    isLoading.value = true
    console.log('Export params:', exportParams.value)

    const queryString = new URLSearchParams(exportParams.value).toString()
    const endpoint = API.ADMIN_GET_EXPORT_IMMUNIZATION
    const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint

    const response = await http.get(fullUrl, {
      responseType: 'blob',
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })

    console.log('Blob response:', response.data)

    if (response.data && response.data.size > 0) {
      const blobUrl = window.URL.createObjectURL(response.data)

      const contentDisposition = response.headers['content-disposition']
      let filename = 'immunisasi_anak_export.xlsx'

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      downloadFile(blobUrl, filename)
      message.success('Data berhasil diekspor!')
      emit('close')

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl)
      }, 1000)
    } else {
      message.warning('File kosong atau tidak ada data untuk diekspor')
    }
  } catch (error) {
    console.error('Export error:', error)
    message.error('Gagal mengekspor data. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}

const downloadFile = (blobUrl: string, filename: string = 'export.xlsx') => {
  console.log('Downloading file:', filename)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename

  // Append to body, click, then remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <NCard class="shadow-md rounded-lg w-full">
    <h1 class="text-primary text-2xl font-bold mb-4">Export Data</h1>
    <n-radio-group v-model:value="filterMode" name="filterMode" class="mb-4" @update:value="handleFilterChange">
      <div class="flex gap-6">
        <n-radio value="tanggal" label="Tanggal Pemeriksaan" />
        <n-radio value="bulan" label="Bulan" />
      </div>
    </n-radio-group>
    <div class="flex flex-col mb-4 w-64">
      <label class="mb-2 text-sm font-medium" v-if="filterMode === 'tanggal'">Tanggal Pemeriksaan</label>
      <label class="mb-2 text-sm font-medium" v-if="filterMode === 'bulan'">Bulan</label>

      <n-date-picker
        v-if="filterMode === 'tanggal'"
        v-model:value="selectedDate"
        type="date"
        placeholder="Pilih tanggal"
        clearable
      />
      <n-date-picker
        v-if="filterMode === 'bulan'"
        v-model:value="selectedMonth"
        type="month"
        placeholder="Pilih bulan"
        clearable
      />
    </div>
    <div class="mb-4 p-3 bg-blue-50 rounded-lg">
      <h3 class="text-sm font-medium mb-2">Informasi Export:</h3>
      <div class="text-sm text-gray-600">
        <div v-if="!selectedDate && !selectedMonth">Semua data akan diekspor jika tanpa filter</div>
        <div v-else>
          <div v-if="exportParams.createdAt">
            <strong>Filter Tanggal:</strong> {{ exportParams.createdAt }}
          </div>
          <div v-if="exportParams.month">
            <strong>Filter Bulan:</strong> {{ exportParams.month }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-4 mt-4">
      <n-button type="tertiary" @click="emit('close')">Kembali</n-button>
      <n-button type="primary" :loading="isLoading" @click="handleExport">
        Export Excel
      </n-button>
    </div>
  </NCard>
</template>
