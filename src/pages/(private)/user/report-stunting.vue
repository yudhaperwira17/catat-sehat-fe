<script setup lang="ts">
import DetailReportStunting from '@/components/componen-user/detail-report-stunting.vue'
import { useReadReportStunting } from '@/services/report-stunting'
import { DateTime } from 'luxon'
import { computed, h, ref } from 'vue'
import ModalReportStunting from '@/components/modal/input-user/modal-report-stunting.vue'

// Reactive variables
const showModal = ref(false)
const search = ref<string>('')

const getGenderLabel = (gender: string) => {
  switch (gender) {
    case 'MALE':
      return 'Laki-Laki'
    case 'FEMALE':
      return 'Perempuan'
    default:
      return 'Tidak Diketahui'
  }
}

const itemsReport = computed(() => {
  return reportData.value?.data.map((checkup) => {
    return {
      id: checkup.id,
      reporter: checkup.reporter,
      phoneNumber: checkup.phoneNumber,
      childName: checkup.childName,
      childAddress: checkup.childAddress,
      fileChildPicture: checkup.fileChildPicture,
      fileHousePicture: checkup.fileHousePicture,
      observation: checkup.observation,
      createdAt: checkup.createdAt,
      gender: getGenderLabel(checkup.gender) // Menggunakan fungsi untuk mengubah gender
    }
  })
})

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  search: '',
  limit: 5
})
const { data: reportData, refetch } = useReadReportStunting(params)
function formatDate(dateString: string) {
  return DateTime.fromISO(dateString).toFormat('dd LLL yyyy') // Format: 21 Nov 2024
}

interface report {
  id: string
  reporter: string
  phoneNumber: string
  childName: string
  childAddress: string
  fileChildPicture: string
  fileHousePicture: string
  observation: string
  gender: string
  createdAt: string
}

const columns = ref([
  {
    title: 'Tanggal',
    key: 'createdAt',
    render(row: report) {
      // Format tanggal sebelum ditampilkan
      return formatDate(row.createdAt)
    }
  },
  { title: 'Nama Pelapor', key: 'reporter' },
  { title: 'Nama Anak', key: 'childName' },
  { title: 'Alamat Anak', key: 'childAddress' },
  { title: 'Jenis Kelamin', key: 'gender' },
  { title: 'No Telepon', key: 'phoneNumber' },
  {
    title: 'Aksi',
    key: 'option',
    render(row: report) {
      return h(
        DetailReportStunting,
        {
          type: 'primary',
          size: 'small',
          id: row.id,
          onRefetch: () => refetch(),
          onClick: () => console.log(row) // Panggil modal saat tombol diklik
        },
        { default: () => 'a' }
      )
    }
  }
])
const onSearch = () => {
  params.value.search = search.value
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg overflow-auto">
    <!-- Breadcrumb Navigation -->
    <div class="hidden md:flex justify-between items-center mb-6">
      <div>
        <n-breadcrumb separator=">" class="mb-2">
          <div class="flex items-center space-x-1">
            <i-material-symbols:home class="text-lg"></i-material-symbols:home>
            <n-breadcrumb-item href="dashboard">Dashboard</n-breadcrumb-item>
            <n-breadcrumb-item>Laporkan Stunting</n-breadcrumb-item>
          </div>
        </n-breadcrumb>
      </div>
    </div>

    <!-- Heading -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">Laporkan Stunting</h1>
        <p class="text-gray-600">Laporkan jika menemukan anak yang teridentifikasi stunting</p>
      </div>
    </div>

    <!-- Table for Desktop -->
    <div class="hidden md:block bg-white rounded-lg overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">Riwayat Laporan</h3>
        <div class="flex items-center space-x-2">
          <!-- Tombol Tambah Laporan -->

          <!-- Input Search -->
          <div class="relative flex items-center">
            <n-input
              v-model:value="search"
              placeholder="Search"
              type="text"
              @keydown.enter="onSearch"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
          </div>
          <n-button type="primary" @click="onSearch">
            <i-material-symbols:search></i-material-symbols:search>
          </n-button>
          <n-button @click="showModal = true" type="primary">Laporkan Stunting</n-button>
        </div>

        <!-- Modal untuk Laporan -->
        <n-modal v-model:show="showModal">
          <ModalReportStunting @close="showModal = false" />
        </n-modal>
      </div>
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <n-data-table
            pagination-behavior-on-filter="first"
            :columns="columns"
            :data="itemsReport"
            class="min-w-max overflow-x-auto"
          />
        </div>
      </div>
      <div class="mt-4">
        <n-pagination v-model:page="params.page" :page-count="reportData?.meta?.totalPage" />
      </div>
    </div>
    <!-- Card for Mobile -->
    <div class="block md:hidden">
      <div class="flex justify-between">
        <h3 class="text-lg font-semibold mb-4">Riwayat Laporan</h3>
      </div>
      <!-- Input Search -->
      <div class="relative flex items-center mb-4 gap-2">
        <n-input
          v-model:value="search"
          class="rounded-lg"
          placeholder="Search"
          type="text"
          @keydown.enter="onSearch"
        />
        <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
        <n-button type="primary" @click="onSearch" class="rounded-lg">
          <i-material-symbols:search></i-material-symbols:search>
        </n-button>
      </div>
      <n-button @click="showModal = true" class="mb-4 rounded-lg" type="primary"
        >Laporkan Stunting</n-button
      >

      <!-- Display each report as a card on mobile view -->
      <div
        v-for="(row, index) in itemsReport"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-md mb-4"
      >
        <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-300">
          <p class="text-sm font-normal bg-pink-100 px-2 rounded-lg py-2 gap-3">
            <span class="font-semibold text-gray-800">Tanggal</span>
            {{ row.createdAt ? formatDate(row.createdAt) : 'Tanggal tidak tersedia' }}
          </p>

          <DetailReportStunting :id="row.id" />
        </div>

        <!-- Flex container for Reporter, Child Name, and Child Address -->
        <div class="flex justify-between mb-2">
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Nama Pelapor</p>
            <p class="text-gray-600">{{ row.reporter }}</p>
          </div>
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Nama Anak</p>
            <p class="text-gray-600">{{ row.childName }}</p>
          </div>
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Alamat Anak</p>
            <p class="text-gray-600">{{ row.childAddress }}</p>
          </div>
        </div>

        <!-- Flex container for Gender and Phone Number -->
        <div class="flex">
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Jenis Kelamin</p>
            <p class="text-gray-600">{{ row.gender }}</p>
          </div>
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">No Telepon</p>
            <p class="text-gray-600">{{ row.phoneNumber }}</p>
          </div>
        </div>
      </div>
      <div>
        <n-pagination
          v-model:page="params.page"
          :page-count="reportData?.meta?.totalPage"
          class="mt-4"
        />
      </div>
    </div>
    <div class="flex justify-center items-center mt-4"></div>
  </div>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
