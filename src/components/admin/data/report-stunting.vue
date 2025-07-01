<script setup lang="ts">
import ModalReportDetail from '@/components/modal/input-admin/report/modal-detail.vue'
import { useAdminReadReport } from '@/services/admin-report'
import { DateTime } from 'luxon'
import { ref } from 'vue'

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  limit: 10,
  search: ''
})

const { data: reports } = useAdminReadReport(params)

const showModal = ref(false)
const selectedReportId = ref<string | null>(null)

const genderMapper: Record<string, string> = {
  MALE: 'Laki-laki',
  FEMALE: 'Perempuan'
}

// Fungsi untuk membuka modal dengan ID yang dipilih
const openModal = (id: string) => {
  selectedReportId.value = id
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedReportId.value = null
}
const search = ref('')
// defineProps<{}>()
</script>

<template>
  <!-- Search Input -->
  <div class="flex flex-col gap-2 mb-6 space-y-6">
    <p class="text-base font-semibold">Riwayat Laporan Stunting</p>
    <div class="flex flex-row gap-4">
      <div class="relative w-full">
        <n-input
          v-model:value="search"
          class="border border-gray-300 rounded-lg h-9 w-80"
          placeholder="Search"
          type="text"
          @keydown.enter="params.search = search"
        />
      </div>

      <n-button @click="params.search = search" class="bg-pink-500 rounded-lg text-white">
        <i-material-symbols:search></i-material-symbols:search>
      </n-button>
    </div>
  </div>
  <div class="flex flex-col items-center space-y-4">
    <n-card
      class="bg-white mx-2 shadow-md rounded-lg my-6"
      v-for="report in reports?.data"
      :key="report.id"
      @click="openModal(report.id)"
    >
      <div class="flex flex-row justify-between my-3">
        <div
          class="flex flex-row bg-pink-50 rounded-lg space-x-3 px-4 py-2 items-center justify-center"
        >
          <p class="text-xs font-bold my-auto">Tanggal</p>
          <p class="text-sm font-normal my-auto">
            {{ DateTime.fromISO(report?.createdAt).toFormat('yyyy-MM-dd') }}
          </p>
        </div>
        <ModalReportDetail :id="selectedReportId as string" @close="closeModal"></ModalReportDetail>
      </div>
      <hr />
      <div class="flex flex-col my-2">
        <div class="flex flex-row justify-between my-3 space-x-4">
          <div class="flex flex-col flex-1">
            <p class="text-xs font-bold">Nama Pelapor</p>
            <p class="text-xs font-normal">{{ report?.reporter }}</p>
          </div>
          <div class="flex flex-col flex-1">
            <p class="text-xs font-bold">Nama Anak</p>
            <p class="text-xs font-normal">{{ report?.childName }}</p>
          </div>
          <div class="flex flex-col flex-1">
            <p class="text-xs font-bold">Alamat Anak</p>
            <p class="text-xs font-normal">{{ report?.childAddress }}</p>
          </div>
        </div>
        <div class="flex flex-row my-3 space-x-4">
          <div class="flex flex-col flex-1">
            <p class="text-xs font-bold">Jenis Kelamin</p>
            <p class="text-sm font-normal">
              {{ genderMapper[report?.gender] || 'Tidak Diketahui' }}
            </p>
          </div>
          <div class="flex flex-col flex-1">
            <p class="text-xs font-bold">Nomor Telepon</p>
            <p class="text-sm font-normal">{{ report?.phoneNumber }}</p>
          </div>
        </div>
      </div>
    </n-card>
  </div>
  <n-pagination v-model:page="params.page" :page-count="reports?.meta?.totalPage" />
</template>
