x
<script setup lang="ts">
// import DetailPosyandu from '@/components/componen-user/comp-detail-posyandu.vue'
// import { useReadSchedule } from '@/services/schedule'
import { DateTime } from 'luxon';
import { NButton, NDataTable, NList, NListItem, NPagination } from 'naive-ui'; // Ensure proper Naive UI imports
import { ref } from 'vue';

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 4
})

const search = ref('')

// const { data: schedules } = useReadSchedule(params)

interface Schedule {
  id: string
  address: string
  staff: string
  date: string
  open: string
  close: string
  note: string
  healthPostId?: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  healthPost?: HealthPost
  adminStaff?: AdminStaff
}
export interface AdminStaff {
  id: string
  name: string
  email: string
  password: string
  phone: string
  otp: any
  type: string
  healthPostId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}
export interface HealthPost {
  id: string
  name: string
  address: string
  coordinator: string
  provinceId: string
  regencyId: string
  districtId: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

// const itemsSchedule = computed(() => {
//   return schedules.value?.data.map((schedule: Schedule) => {
//     return {
//       id: schedule.id,
//       healthPost: schedule.healthPost?.name,
//       address: schedule.address,
//       staff: schedule.adminStaff?.name,
//       open: schedule.open ? DateTime.fromISO(schedule.open).toFormat('HH:mm') : '',
//       close: schedule.close ? DateTime.fromISO(schedule.close).toFormat('HH:mm') : '',
//       date: schedule.date,
//       note: schedule.note
//     }
//   })
// })

// Column definitions for the table
const columns = ref([
  {
    title: 'Tanggal',
    key: 'date',
    render(data: { date: string }) {
      return DateTime.fromISO(data.date).toFormat('dd LLL yyyy')
    }
  },
  {
    title: 'Posyandu',
    key: 'healthPost'
  },
  {
    title: 'Waktu',
    key: 'open-close',
    render(data: { open: string; close: string }) {
      const openTime = DateTime.fromISO(data.open).toFormat('HH:mm')
      const closeTime = DateTime.fromISO(data.close).toFormat('HH:mm')
      return `${openTime} - ${closeTime}`
    }
  },
  {
    title: 'Petugas',
    key: 'staff'
  },
  {
    title: 'Catatan',
    key: 'note'
  },
//   {
//     title: 'Aksi',
//     key: 'action',
//     render(data: { id: string }) {
//       return h('div', [
//         h(DetailPosyandu, {
//           id: data.id
//         }) // Render the DetailPosyandu component
//       ])
//     }
//   }
])

const onSearch = () => {
  params.value.search = search.value
}
</script>

<template>
  <div class="bg-white rounded-lg overflow-auto p-6">
    <div class="hidden md:flex justify-end items-center mb-6">
      <div>
        <div class="flex items-center space-x-4"></div>
      </div>
    </div>
    <div class="flex items-center space-x-2 text-gray-600">
      <div>
        <n-breadcrumb separator=">" class="mb-2">
          <div class="flex items-center space-x-1">
            <i-material-symbols:home class="text-lg"></i-material-symbols:home>
            <n-breadcrumb-item href="dashboard">Dashboard</n-breadcrumb-item>
            <n-breadcrumb-item>Posyandu</n-breadcrumb-item>
          </div>
        </n-breadcrumb>
      </div>
    </div>

    <div class="hidden md:block bg-white rounded-lg overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">Jadwal Posyandu</h3>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-12 p-2 flex-grow"
              placeholder="Search"
              type="text"
              @keydown.enter="onSearch"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
          </div>
          <n-button
            class=" text-white h-12 w-12 rounded-lg ml-2 flex items-center justify-center"
            @click="onSearch"
          >
            <i-material-symbols:search></i-material-symbols:search>
          </n-button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <!-- <n-data-table
          :columns="columns"
          :data="itemsSchedule"
          pagination-behavior-on-filter="first"
          class="justify-center text-center overflow-x-auto min-w-[768px] w-full"
        /> -->
        <n-data-table
          :columns="columns"
          pagination-behavior-on-filter="first"
          class="justify-center text-center overflow-x-auto min-w-[768px] w-full"
        />
        <!-- <n-pagination
          v-model:page="params.page"
          :page-count="schedules?.meta?.totalPage"
          class="mt-4"
        /> -->
        <n-pagination
          v-model:page="params.page"
          class="mt-4"
        />
      </div>
    </div>

    <!-- Card for mobile view -->
    <div class="block md:hidden mt-6">
      <h3 class="text-lg font-semibold mb-4">Jadwal Posyandu</h3>
      <div class="flex items-center space-x-2">
        <div class="w-full relative">
          <n-input
            v-model:value="search"
            type="text"
            placeholder="Search"
            class="rounded-lg"
            @keydown.enter="onSearch"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
        </div>
        <NButton type="primary" class="rounded-lg" @click="onSearch">
          <i-material-symbols:search></i-material-symbols:search>
        </NButton>
      </div>
      <NList>
        <!-- <NListItem
          v-for="(row, index) in schedules?.data"
          :key="index"
          class="flex justify-between bg-white"
        > -->
        <NListItem
          class="flex justify-between bg-white"
        >
          <div>
            <div class="flex justify-between border-b border-gray-300">
              <div class="w-3/4">
                <div class="flex justify-between items-center mb-2 pb-2 border-gray-300">
                  <!-- <p class="font-semibold text-gray-800">{{ row.healthPost?.name }}</p> -->
                  <div class="flex items-center">
                    <p class="font-semibold text-gray-800">
                      <!-- {{ DateTime.fromISO(row.date).toFormat('dd/LL/yyyy') }} -->
                    </p>
                  </div>
                </div>
                <div class="flex justify-between items-center mb-2 pb-2 border-gray-300">
                  <!-- <p class="text-gray-500">{{ row.adminStaff?.name }}</p> -->
                  <div class="flex items-center">
                    <p class="text-gray-500">
                      <!-- {{ DateTime.fromISO(row.open).toFormat('HH:mm') }} -
                      {{ DateTime.fromISO(row.close).toFormat('HH:mm') }} -->
                    </p>
                  </div>
                </div>
              </div>
              <div class="w-1/4 flex justify-center items-center">
                <!-- <DetailPosyandu :id="row.id" /> -->
              </div>
            </div>
          </div>
        </NListItem>
      </NList>
      <!-- <NPagination v-model:page="params.page" :page-count="schedules?.meta?.totalPage" /> -->
    </div>
  </div>
</template>
<route lang="yaml">
meta:
#   requiresAuth: true
</route>
