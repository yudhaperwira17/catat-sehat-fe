<script setup lang="ts">
import DetailPosyandu from '@/components/componen-user/comp-detail-posyandu.vue';
import { useReadSchedule, type Daum } from '@/services/schedule';
import { DateTime } from 'luxon';
import { NButton } from 'naive-ui'; // Ensure proper Naive UI imports
import { ref } from 'vue';

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 4
})

const search = ref('')

const { data: schedules } = useReadSchedule(params)

// export interface AdminStaff {
//   id: string
//   name: string
//   email: string
//   password: string
//   phone: string
//   otp: any
//   type: string
//   healthPostId: string
//   createdAt: string
//   updatedAt: string
//   deletedAt: any
// }
// export interface HealthPost {
//   id: string
//   name: string
//   address: string
//   coordinator: string
//   provinceId: string
//   regencyId: string
//   districtId: string
//   subDistrictId: string
//   createdAt: string
//   updatedAt: string
//   deletedAt: any
// }

const itemsSchedule = computed(() => {
  return schedules.value?.data.map((schedule: Daum) => {
    return {
      id: schedule.id,
      healthPost: schedule.healthPost?.name,
      address: schedule.address,
      staff: schedule.staff.name,
      open: schedule.startAt ? DateTime.fromISO(schedule.startAt).toFormat('HH:mm') : '',
      close: schedule.endAt ? DateTime.fromISO(schedule.endAt).toFormat('HH:mm') : '',
      date: schedule.startAt,
      note: schedule.note
    }
  })
})

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
  {
    title: 'Aksi',
    key: 'action',
    render(data: { id: string }) {
      return h('div', [
        h(DetailPosyandu, {
          id: data.id
        })
      ])
    }
  }
])

const onSearch = () => {
  params.value.search = search.value
}
</script>

<template>
  <div class="bg-white rounded-lg overflow-auto p-6">
    <div class="flex justify-end items-center mb-6">
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
    <div class="flex flex-col bg-white rounded-lg overflow-auto">
      <div
        class="flex flex-col md:flex-row w-full justify-between mb-6 space-y-4 md:items-center md:space-y-0"
      >
        <h3 class="text-lg font-semibold">Jadwal Posyandu</h3>
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
          :data="itemsSchedule"
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
