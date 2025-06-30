x
<script setup lang="ts">
// import DetailPosyandu from '@/components/componen-user/comp-detail-posyandu.vue'
// import { useReadSchedule } from '@/services/schedule'
import { DateTime } from 'luxon';
import { NButton } from 'naive-ui'; // Ensure proper Naive UI imports
import { ref } from 'vue';

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 4
})

const search = ref('')

// const { data: schedules } = useReadSchedule(params)

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
    title: 'NAMA IBU',
    key: 'date',
    render(data: { date: string }) {
      return DateTime.fromISO(data.date).toFormat('dd LLL yyyy')
    }
  },
  {
    title: 'USIA KEHAMILAN',
    key: 'healthPost'
  },
  {
    title: 'POSYANDU',
    key: 'open-close',
    render(data: { open: string; close: string }) {
      const openTime = DateTime.fromISO(data.open).toFormat('HH:mm')
      const closeTime = DateTime.fromISO(data.close).toFormat('HH:mm')
      return `${openTime} - ${closeTime}`
    }
  },
  {
    title: 'TANGGAL',
    key: 'staff'
  },
  {
    title: 'PETUGAS',
    key: 'note'
  },
  {
    title: 'BMI',
    key: 'note'
  },
  {
    title: 'STATUS',
    key: 'note'
  },
  {
    title: 'DIAGNOSIS',
    key: 'note'
  }
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
    <div class="flex flex-wrap justify-between items-start md:items-center gap-4 mb-6">
      <!-- Judul -->
      <div class="flex flex-col">
        <h1 class="text-base md:text-2xl font-semibold">Daftar Hadir Posyandu Ibu Hamil</h1>
        <p class="text-gray-600 text-sm font-normal">Informasi tentang daftar hadir ibu hamil</p>
      </div>

      <!-- Date Picker -->
      <div class="w-full md:w-auto flex justify-start md:justify-end">
        <n-date-picker type="date" class="w-full md:w-auto" />
      </div>
    </div>

    <div class="flex flex-col bg-white rounded-lg overflow-auto">
      <div
        class="flex flex-col md:flex-row w-full justify-end mb-6 space-y-4 md:items-center md:space-y-0"
      >
        <div class="flex items-center">
          <div class="flex flex-row flex-grow gap-2">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-12 p-2 flex-grow"
              placeholder="Search"
              type="text"
              size="small"
              @keydown.enter="onSearch"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
          </div>
          <n-button
            class="text-white h-12 w-12 rounded-lg ml-2 flex items-center justify-center"
            @click="onSearch"
          >
            <i-material-symbols:search></i-material-symbols:search>
          </n-button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <n-data-table
          :columns="columns"
          pagination-behavior-on-filter="first"
          class="justify-center text-center overflow-x-auto min-w-[768px] w-full"
        />
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
#   requiresAuth: true
</route>
