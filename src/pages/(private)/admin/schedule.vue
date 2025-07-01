<script setup lang="ts">
import DetailPosyandu from '@/components/componen-admin/comp-detail-jadwal.vue'
import CreateSchedule from '@/components/modal/input-admin/Create-Schedule.vue'
import { useAdminReadSchedule, type Daum } from '@/services/admin-schedule'
import { DateTime } from 'luxon'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 4
})

const { data: schedules } = useAdminReadSchedule(params)
const search = ref('')
const createData = ref(false)


const itemsSchedule = computed(() => {
  return schedules.value?.data.map((schedule: Daum) => {
    return {
      id: schedule.id,
      healthPost: schedule.healthPost?.name,
      address: schedule.address,
      staff: schedule.staff?.name,
      open: schedule.startAt ? DateTime.fromISO(schedule.startAt).toFormat('HH:mm') : '',
      close: schedule.endAt ? DateTime.fromISO(schedule.endAt).toFormat('HH:mm') : '',
      date: schedule.startAt ? DateTime.fromISO(schedule.startAt).toFormat('yyyy-MM-dd') : '',
      note: schedule.note
    }
  })
})

// Column definitions for the table
const columns = ref([
  {
    title: 'TANGGAL',
    key: 'date',
    render(data: { date: string }) {
      return DateTime.fromISO(data.date).toFormat('dd LLL yyyy')
    }
  },
  {
    title: 'POSYANDU',
    key: 'healthPost'
  },
  {
    title: 'WAKTU',
    key: 'open-close',
    render(data: { open: string; close: string }) {
      const openTime = DateTime.fromISO(data.open).toFormat('HH:mm')
      const closeTime = DateTime.fromISO(data.close).toFormat('HH:mm')
      return `${openTime} - ${closeTime}`
    }
  },
  {
    title: 'PETUGAS',
    key: 'staff'
  },
  {
    title: 'ALAMAT',
    key: 'note'
  },
  {
    title: 'Aksi',
    key: 'action',
    render(data: { id: string }) {
      return h('div', [
        h(DetailPosyandu, {
          id: data.id
        }) // Render the DetailPosyandu component
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
    <div>
      <h1 class="md:-2xl sm:text-base font-semibold">Jadwal Posyandu</h1>
      <p class="text-gray-600 sm:text-sm font-normal">Informasi tentang jadwal posyandu</p>
    </div>
    <div class="flex flex-col bg-white rounded-lg overflow-auto">
      <div
        class="flex flex-col md:flex-row justify-end w-full mb-6 space-y-4 md:items-center md:space-y-0"
      >
        <div class="flex items-center gap-2 w-full md:w-auto">
          <n-input
            v-model:value="search"
            class="w-full md:w-80"
            placeholder="Search"
            type="text"
            size="small"
            @keydown.enter="onSearch"
          />
          <n-button @click="onSearch" type="primary" size="small" class="text-white">
            <i-material-symbols:search class="text-lg" />
          </n-button>
          <n-button  @click="createData = true" type="primary" size="small" class="text-white">
            <i-mdi:plus class="mr-1" /> Tambah Jadwal
          </n-button>
          <n-modal v-model:show="createData" @close="createData = false"
            ><CreateSchedule @close="createData = false"
          /></n-modal>
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
  layout: admin
</route>
