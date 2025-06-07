<script setup lang="tsx">
import ModalDetailChild from '@/components/modal/input-admin/master-data/detail-child.vue'
import { useAdminReadChild } from '@/services/admin-child'
import { DateTime } from 'luxon'
import { h, ref } from 'vue'

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  limit: 10,
  search: ''
})

// Mengambil data laporan dari API
const { data: children } = useAdminReadChild(params)
const search = ref('')
const columns = ref([
  {
    title: 'NAMA',
    key: 'name'
  },
  {
    title: 'ALAMAT RUMAH',
    key: 'address'
  },
  {
    title: 'TANGGAL LAHIR',
    key: 'dateOfBirth',
    render(data: { createdAt: string }) {
      return DateTime.fromISO(data.createdAt).toFormat('yyyy-MM-dd')
    }
  },
  {
    title: 'TEMPAT LAHIR',
    key: 'placeOfBirth'
  },
  {
    title: 'ANAK KE',
    key: 'childOrder'
  },

  {
    title: 'AKSI',
    key: 'action',
    render(row: { id: string }) {
      return h(ModalDetailChild, {
        id: row.id, // Meneruskan ID ke ModalReportDetail
        onRefetch: () => {
          // Logic untuk refetch data jika diperlukan
        }
      })
    }
  }
])

defineProps<{}>()
</script>

<template>
  <div class="bg-white rounded-lg">
    <!-- Header: Search -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Bayi</h3>
      <div class="flex items-center gap-4">
        <n-input
          v-model:value="search"
          class="border border-gray-300 rounded-lg h-9 w-80"
          placeholder="Search"
          type="text"
          @keydown.enter="params.search = search"
        />
        <n-button @click="params.search = search" class="bg-pink-500 rounded-lg text-white">
          <i-material-symbols:search></i-material-symbols:search>
        </n-button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="overflow-x-auto">
      <n-data-table
        :columns="columns"
        :data="children?.data"
        pagination-behavior-on-filter="first"
        class="mb-6 md:min-w-max overflow-x-auto justify-center text-center"
      />

      <!-- Pagination -->
      <n-pagination v-model:page="params.page" :page-count="children?.meta?.totalPage" />
    </div>
  </div>
</template>
