<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { NButton, NDataTable, NInput, NPagination, NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'

interface Lansia {
  id: number
  nama: string
  tanggal_lahir: string
  umur: string
  alamat: string
}

const page = ref(1)
const pageSize = 5
const search = ref('')

const lansiaData = ref<Lansia[]>(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    nama: 'Sigit',
    tanggal_lahir: '16 April 1955',
    umur: '70 Tahun',
    alamat: 'Jebres'
  }))
)

const filteredData = computed(() =>
  lansiaData.value.filter((item) => item.nama.toLowerCase().includes(search.value.toLowerCase()))
)

const paginatedData = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const hapusData = (id: number) => {
  lansiaData.value = lansiaData.value.filter((item) => item.id !== id)
}

const columns: DataTableColumns<Lansia> = [
  {
    title: 'Nama',
    key: 'nama'
  },
  {
    title: 'Tanggal Lahir',
    key: 'tanggal_lahir'
  },
  {
    title: 'Umur',
    key: 'umur'
  },
  {
    title: 'Alamat',
    key: 'alamat'
  },
  {
    title: '',
    key: 'aksi',
    render(row) {
      return h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => hapusData(row.id),
          style: {
            backgroundColor: '#0F5BC0',
            borderColor: '#0F5BC0',
            color: '#ffffff',
            fontSize: '13px'
          }
        },
        { default: () => 'Hapus' }
      )
    }
  }
]
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Master Data</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="#" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <span>Master Data Lansia</span>
      </nav>
    </div>

    <!-- Card -->
    <div class="bg-white p-4 rounded-lg shadow">
      <!-- Subheader & Search -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Lansia</h2>
        <div class="flex items-center gap-2">
          <n-input v-model:value="search" placeholder="Search" class="w-60 search-input" clearable>
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button type="primary" class="search-btn">
            <n-icon :component="Search" />
          </n-button>
        </div>
      </div>

      <!-- Tabel -->
      <n-data-table
        :columns="columns"
        :data="paginatedData"
        :pagination="false"
        :bordered="false"
        class="custom-table"
      />

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <n-pagination v-model:page="page" :page-size="pageSize" :item-count="filteredData.length" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
  font-weight: normal !important;
  font-size: 14px !important;
  text-transform: capitalize !important;
  color: inherit !important;
}

:deep(.n-data-table-td) {
  font-size: 14px !important;
  color: inherit !important;
  padding: 12px 16px !important;
}

:deep(.n-data-table) {
  --n-merged-th-color: #a6c9f5 !important;
  --n-merged-td-color: #ffffff !important;
  --n-th-padding: 12px 16px !important;
  --n-td-padding: 12px 16px !important;
}

.search-btn {
  background-color: #0f5bc0;
  border-color: #0f5bc0;
}

.search-btn:hover {
  background-color: #0d4fa8;
}

.search-input :deep(.n-input) {
  border-radius: 8px;
}

.search-input :deep(.n-input-wrapper) {
  padding-left: 12px;
}

.search-input :deep(.n-input__prefix) {
  margin-right: 8px;
  color: #8e8e8e;
}

.search-input :deep(.n-input__input-el) {
  font-size: 14px;
}

:deep(.custom-table) {
  width: 100%;
}
</style>
