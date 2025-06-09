<script setup lang="tsx">
import ModalReportDetail from '@/components/modal/input-admin/report/modal-detail.vue'
import { useAdminReadReport } from '@/services/admin-report'
import { DateTime } from 'luxon'
import { h, ref } from 'vue'

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  limit: 10,
  search: ''
})

// Mengambil data laporan dari API
const { data: reports } = useAdminReadReport(params)
const search = ref('')
const columns = ref([
  {
    title: 'TANGGAL',
    key: 'createdAt',
    render(data: { createdAt: string }) {
      return DateTime.fromISO(data.createdAt).toFormat('yyyy-MM-dd')
    }
  },
  {
    title: 'NAMA PELAPOR',
    key: 'reporter'
  },
  {
    title: 'NAMA ANAK',
    key: 'childName'
  },
  {
    title: 'ALAMAT ANAK',
    key: 'childAddress'
  },
  {
    title: 'JENIS KELAMIN',
    key: 'gender'
  },
  {
    title: 'NOMOR TELEPON',
    key: 'phoneNumber'
  },
  {
    title: 'AKSI',
    key: 'action',
    render(row: { id: string }) {
      return h(ModalReportDetail, {
        id: row.id
      })
    }
  }
])

defineProps<{}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Header: Search -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Riwayat Laporan Stunting</h3>
      <div class="flex items-center gap-4">
        <n-input
          v-model:value="search"
          class="border border-gray-300 rounded-lg h-9 w-80"
          placeholder="Search"
          type="text"
          @keydown.enter="params.search = search"
        />
        <n-button type ="primary" @click="params.search = search" class=" rounded-lg text-white">
          
          <i-material-symbols:search></i-material-symbols:search>
        </n-button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <n-data-table
        :columns="columns"
        :data="reports?.data"
        pagination-behavior-on-filter="first"
        class="mb-6 justify-center text-center"
        x-scrollable
      />
      <n-pagination v-model:page="params.page" :page-count="reports?.meta?.totalPage" />
    </div>
  </div>
</template>
