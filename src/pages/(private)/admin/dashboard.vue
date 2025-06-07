<script setup lang="ts">
import { formatDate, formatTime } from '@/composable/http/utils'
import { useAdminReadDashboard } from '@/services/admin-dashboard'
import { useAdminReadSchedule } from '@/services/admin-schedule'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'
import ApexChart from 'vue3-apexcharts'

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  limit: 10,
  search: ''
})
const search = ref('')
// Fetch data from API
const { data: schedules, refetch } = useAdminReadSchedule(params)

const itemsSchedule = computed(() => {
  return schedules.value?.data.map((schedule) => {
    return {
      id: schedule.id,
      healthPost: schedule.healthPost?.name,
      address: schedule.address,
      staff: schedule.staff?.name,
      open: formatTime(schedule.startAt),
      close: formatTime(schedule.endAt),
      date: formatDate(schedule.startAt),
      note: schedule.note
    }
  })
})

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
    title: 'CATATAN',
    key: 'note'
  }
])

const { data } = useAdminReadDashboard(params)
// const { data: dashboardData } = useAdminReadDashboard(params)

const series = [
  {
    data: [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 3 },
      { x: 4, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 5 },
      { x: 7, y: 3 },
      { x: 8, y: 1 },
      { x: 9, y: 0 },
      { x: 10, y: 1 },
      { x: 11, y: 3 },
      { x: 12, y: 5 },
      { x: 13, y: 6 },
      { x: 14, y: 5 },
      { x: 15, y: 3 },
      { x: 16, y: 1 },
      { x: 17, y: 0 }
    ]
  }
]

const coptions = {
  chart: {
    height: 500,
    width: 800,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Laporan Stunting',
    align: 'left'
  },
  grid: {
    show: false
  },
  xaxis: {
    type: 'numeric',
    labels: {
      show: false
    },
    min: 0,
    max: 17
  },
  yaxis: {
    min: -1,
    max: 7,
    labels: {
      show: false
    }
  }
}
const selectedScheduleId = ref<string>('')
const showActionSchedule = ref(false)
const openActionSchedule = (id: string) => {
  selectedScheduleId.value = id
  showActionSchedule.value = true
}

defineProps<{}>()
</script>

<template>
  <div>
    <!-- Main Content -->
    <div class="flex-1 p-3 sm:p-6">
      <header class="flex justify-between items-center mb-6">
        <div>
          <h1 class="md:text-2xl text-base font-semibold">Dashboard Admin</h1>
          <p class="text-gray-600">Informasi tentang aplikasi stunting</p>
        </div>
      </header>
      <!-- grafik mobile -->
      <n-card
        class="block lg:hidden bg-white shadow-md row-span-2 md:w-full md:h-80 sm:w-full sm:h-72 mb-6"
      >
        <div class="w-full">
          <ApexChart :options="coptions" :series="series"></ApexChart>
        </div>
      </n-card>

      <!-- card data mobile -->
      <div class="grid lg:hidden grid-cols-2 gap-4" v-if="data">
        <RouterLink to="/admin/data-child">
          <admin-stats-card title="Total Bayi" :count="data.child">
            <template #icon>
              <i-mdi-baby-face-outline class="text-primary" />
            </template>
          </admin-stats-card>
        </RouterLink>
        <admin-stats-card title="Total Pengguna" :count="data.user">
          <template #icon>
            <i-gravity-ui:stethoscope class="text-primary" />
          </template>
        </admin-stats-card>
        <RouterLink to="/admin/article">
          <admin-stats-card title="Total Artikel" :count="data.article">
            <template #icon>
              <i-gravity-ui:stethoscope class="text-primary" />
            </template>
          </admin-stats-card>
        </RouterLink>
        <RouterLink to="/admin/schedule">
          <admin-stats-card title="Total Jadwal Posyandu" :count="data.scheduleTotal">
            <template #icon>
              <i-gravity-ui:stethoscope class="text-primary" />
            </template>
          </admin-stats-card>
        </RouterLink>
        <n-card class="hidden lg:block bg-white shadow-md row-span-2 md:w-80 md:h-80 h-72">
          <div class="w-full">
            <ApexChart :options="coptions" :series="series"></ApexChart>
          </div>
        </n-card>
      </div>

      <!-- Schedule mobile -->
      <div class="bg-white p-6 rounded-lg shadow-md mt-6 sm:block md:hidden">
        <div class="flex flex-col items-start mb-4">
          <!-- <h2 class="text-base font-medium">Jadwal Posyandu</h2> -->

          <!-- <div class="flex items-center">
            <div class="relative mr-4">
              <input
                type="text"
                placeholder="Search"
                class="border rounded-lg p-2 pl-10"
                v-model="searchQuery"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
            </div>
            <n-button type="primary">
              <i-material-symbols:search></i-material-symbols:search>
            </n-button>
          </div> -->
        </div>
        <div class="flex justify-between"></div>
        <h3 class="text-lg font-semibold mb-4">Data Jadwal Posyandu</h3>
        <NList>
          <NListItem
            v-for="schedule in schedules?.data"
            :key="schedule.id"
            class="flex justify-between bg-white"
          >
            <div>
              <div class="flex justify-between border-b border-gray-300">
                <div class="w-full mx-3">
                  <div class="flex justify-between items-center mb-2 pb-2 border-gray-300">
                    <p class="font-semibold text-gray-800">{{ schedule.healthPost?.name }}</p>
                    <div class="flex items-center">
                      <p class="font-semibold text-gray-800">
                        {{ formatDate(schedule.startAt) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex justify-between items-center mb-2 pb-2 border-gray-300">
                    <p class="text-gray-500">{{ schedule.address }}</p>
                    <div class="flex items-center">
                      <p class="text-gray-500">
                        {{ formatTime(schedule.startAt) }} -
                        {{ formatTime(schedule.endAt) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="flex justify-center items-center cursor-pointer"
                  @click="openActionSchedule(schedule.id)"
                >
                  <ActionSchedule :id="schedule.id" @onRefetch="refetch" />
                </div>
              </div>
            </div>
          </NListItem>
        </NList>

        <!-- Pagination -->
        <n-pagination v-model:page="params.page" :page-count="schedules?.meta?.totalPage" />
      </div>

      <!-- card data desktop -->
      <div class="hidden lg:grid lg:grid-cols-3 gap-4">
        <n-card
          id="total bayi"
          class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
          style="
            background: linear-gradient(
              135deg,
              white 60%,
              /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
              /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                /* Warna pink penuh pada 100% area */
            );
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 11.4737C11.0415 11.4737 10.1046 11.1959 9.30762 10.6754C8.51068 10.1549 7.88953 9.4151 7.52274 8.54955C7.15594 7.68401 7.05997 6.73159 7.24696 5.81273C7.43395 4.89387 7.89551 4.04985 8.57325 3.38739C9.251 2.72493 10.1145 2.27379 11.0546 2.09102C11.9946 1.90825 12.969 2.00205 13.8545 2.36057C14.7401 2.71909 15.4969 3.32623 16.0294 4.1052C16.5619 4.88416 16.8462 5.79998 16.8462 6.73684C16.8447 7.9927 16.3337 9.19673 15.4252 10.0848C14.5167 10.9728 13.2848 11.4723 12 11.4737ZM12 4.10526C11.4675 4.10526 10.947 4.2596 10.5042 4.54877C10.0615 4.83793 9.71641 5.24892 9.51263 5.72978C9.30886 6.21064 9.25554 6.73976 9.35942 7.25024C9.46331 7.76072 9.71973 8.22962 10.0963 8.59765C10.4728 8.96568 10.9525 9.21632 11.4748 9.31786C11.997 9.4194 12.5383 9.36728 13.0303 9.16811C13.5223 8.96893 13.9427 8.63163 14.2386 8.19887C14.5344 7.76611 14.6923 7.25732 14.6923 6.73684C14.6923 6.03891 14.4087 5.36955 13.9037 4.87604C13.3988 4.38252 12.714 4.10526 12 4.10526Z"
                  fill="#E74694"
                />
                <path
                  d="M17.9231 22H6.07692C5.79131 22 5.51739 21.8891 5.31542 21.6917C5.11346 21.4943 5 21.2265 5 20.9474V17.7895C5.00171 16.3941 5.56957 15.0564 6.57901 14.0697C7.58845 13.083 8.95705 12.528 10.3846 12.5263H13.6154C15.0429 12.528 16.4116 13.083 17.421 14.0697C18.4304 15.0564 18.9983 16.3941 19 17.7895V20.9474C19 21.2265 18.8865 21.4943 18.6846 21.6917C18.4826 21.8891 18.2087 22 17.9231 22ZM7.15385 19.8947H16.8462V17.7895C16.8462 16.9519 16.5058 16.1487 15.8999 15.5565C15.294 14.9643 14.4722 14.6316 13.6154 14.6316H10.3846C9.52776 14.6316 8.706 14.9643 8.10012 15.5565C7.49423 16.1487 7.15385 16.9519 7.15385 17.7895V19.8947Z"
                  fill="#E74694"
                />
              </svg>
              <h3 class="font-bold">Total Bayi</h3>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold">{{ data?.child }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <RouterLink to="/admin/data-child" class="flex items-center space-x-4">
              <p class="text-sm text-gray-500">Lihat Detail</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8.90991 19.9201L15.4299 13.4001C16.1999 12.6301 16.1999 11.3701 15.4299 10.6001L8.90991 4.08008"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </RouterLink>
          </div>
        </n-card>
        <n-card
          id="total user"
          class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
          style="
            background: linear-gradient(
              135deg,
              white 60%,
              /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
              /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                /* Warna pink penuh pada 100% area */
            );
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.40454 16.412V13.206C2.40454 12.0973 2.7954 11.1523 3.57713 10.3711C4.35885 9.58994 5.30382 9.19907 6.41202 9.19854H15.0081C15.5157 9.19854 15.9466 9.3722 16.3009 9.71951C16.6551 10.0668 16.832 10.4943 16.8315 11.0019C16.8315 11.416 16.7046 11.7868 16.4508 12.1144C16.1969 12.4419 15.8763 12.6589 15.489 12.7652L13.6255 13.3062V16.412C13.6255 16.6925 13.5622 16.9463 13.4355 17.1734C13.3089 17.4005 13.1384 17.5875 12.9242 17.7345C12.7099 17.8814 12.4761 17.9717 12.2229 18.0054C11.9696 18.039 11.7091 18.0022 11.4414 17.8948L7.65434 16.412H2.40454ZM12.0225 14.0075H7.51408C7.42057 14.0075 7.35057 14.0342 7.30408 14.0877C7.2576 14.1411 7.22741 14.2012 7.21352 14.268C7.19962 14.3348 7.20977 14.3984 7.24397 14.4588C7.27817 14.5191 7.33481 14.5624 7.41389 14.5886L12.0225 16.412V14.0075ZM4.00753 14.809H5.69067C5.66396 14.7289 5.64392 14.6487 5.63056 14.5686C5.6172 14.4884 5.61052 14.4016 5.61052 14.3081C5.61052 13.7871 5.79754 13.3396 6.17157 12.9656C6.5456 12.5915 6.9931 12.4045 7.51408 12.4045H10.7802L15.0682 11.2223C15.135 11.1956 15.1817 11.1622 15.2084 11.1221C15.2352 11.0821 15.2418 11.0353 15.2285 10.9819C15.2151 10.9284 15.1916 10.8852 15.1579 10.852C15.1243 10.8189 15.0743 10.8021 15.0081 10.8015H6.41202C5.74411 10.8015 5.17638 11.0353 4.70884 11.5028C4.2413 11.9704 4.00753 12.5381 4.00753 13.206V14.809ZM8.01501 8.39704C7.13337 8.39704 6.37862 8.08312 5.75079 7.45529C5.12295 6.82745 4.80903 6.07271 4.80903 5.19106C4.80903 4.30941 5.12295 3.55467 5.75079 2.92683C6.37862 2.299 7.13337 1.98508 8.01501 1.98508C8.89666 1.98508 9.6514 2.299 10.2792 2.92683C10.9071 3.55467 11.221 4.30941 11.221 5.19106C11.221 6.07271 10.9071 6.82745 10.2792 7.45529C9.6514 8.08312 8.89666 8.39704 8.01501 8.39704ZM8.01501 6.79405C8.45583 6.79405 8.83334 6.63723 9.14752 6.32357C9.46171 6.00992 9.61854 5.63242 9.618 5.19106C9.61747 4.7497 9.46064 4.37247 9.14752 4.05935C8.83441 3.74623 8.4569 3.58914 8.01501 3.58807C7.57312 3.587 7.19588 3.74409 6.8833 4.05935C6.57072 4.3746 6.41362 4.75184 6.41202 5.19106C6.41042 5.63028 6.56751 6.00778 6.8833 6.32357C7.19909 6.63936 7.57633 6.79619 8.01501 6.79405Z"
                  fill="#E74694"
                />
              </svg>
              <h3 class="font-bold">Total Pengguna</h3>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold">{{ data?.user }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between"></div>
        </n-card>
        <n-card
          id="total user"
          class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
          style="
            background: linear-gradient(
              135deg,
              white 60%,
              /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
              /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                /* Warna pink penuh pada 100% area */
            );
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.40454 16.412V13.206C2.40454 12.0973 2.7954 11.1523 3.57713 10.3711C4.35885 9.58994 5.30382 9.19907 6.41202 9.19854H15.0081C15.5157 9.19854 15.9466 9.3722 16.3009 9.71951C16.6551 10.0668 16.832 10.4943 16.8315 11.0019C16.8315 11.416 16.7046 11.7868 16.4508 12.1144C16.1969 12.4419 15.8763 12.6589 15.489 12.7652L13.6255 13.3062V16.412C13.6255 16.6925 13.5622 16.9463 13.4355 17.1734C13.3089 17.4005 13.1384 17.5875 12.9242 17.7345C12.7099 17.8814 12.4761 17.9717 12.2229 18.0054C11.9696 18.039 11.7091 18.0022 11.4414 17.8948L7.65434 16.412H2.40454ZM12.0225 14.0075H7.51408C7.42057 14.0075 7.35057 14.0342 7.30408 14.0877C7.2576 14.1411 7.22741 14.2012 7.21352 14.268C7.19962 14.3348 7.20977 14.3984 7.24397 14.4588C7.27817 14.5191 7.33481 14.5624 7.41389 14.5886L12.0225 16.412V14.0075ZM4.00753 14.809H5.69067C5.66396 14.7289 5.64392 14.6487 5.63056 14.5686C5.6172 14.4884 5.61052 14.4016 5.61052 14.3081C5.61052 13.7871 5.79754 13.3396 6.17157 12.9656C6.5456 12.5915 6.9931 12.4045 7.51408 12.4045H10.7802L15.0682 11.2223C15.135 11.1956 15.1817 11.1622 15.2084 11.1221C15.2352 11.0821 15.2418 11.0353 15.2285 10.9819C15.2151 10.9284 15.1916 10.8852 15.1579 10.852C15.1243 10.8189 15.0743 10.8021 15.0081 10.8015H6.41202C5.74411 10.8015 5.17638 11.0353 4.70884 11.5028C4.2413 11.9704 4.00753 12.5381 4.00753 13.206V14.809ZM8.01501 8.39704C7.13337 8.39704 6.37862 8.08312 5.75079 7.45529C5.12295 6.82745 4.80903 6.07271 4.80903 5.19106C4.80903 4.30941 5.12295 3.55467 5.75079 2.92683C6.37862 2.299 7.13337 1.98508 8.01501 1.98508C8.89666 1.98508 9.6514 2.299 10.2792 2.92683C10.9071 3.55467 11.221 4.30941 11.221 5.19106C11.221 6.07271 10.9071 6.82745 10.2792 7.45529C9.6514 8.08312 8.89666 8.39704 8.01501 8.39704ZM8.01501 6.79405C8.45583 6.79405 8.83334 6.63723 9.14752 6.32357C9.46171 6.00992 9.61854 5.63242 9.618 5.19106C9.61747 4.7497 9.46064 4.37247 9.14752 4.05935C8.83441 3.74623 8.4569 3.58914 8.01501 3.58807C7.57312 3.587 7.19588 3.74409 6.8833 4.05935C6.57072 4.3746 6.41362 4.75184 6.41202 5.19106C6.41042 5.63028 6.56751 6.00778 6.8833 6.32357C7.19909 6.63936 7.57633 6.79619 8.01501 6.79405Z"
                  fill="#E74694"
                />
              </svg>
              <h3 class="font-bold">Total Lansia</h3>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold">{{ data?.user }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between"></div>
        </n-card>
        <n-card
          id="total user"
          class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
          style="
            background: linear-gradient(
              135deg,
              white 60%,
              /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
              /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                /* Warna pink penuh pada 100% area */
            );
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.40454 16.412V13.206C2.40454 12.0973 2.7954 11.1523 3.57713 10.3711C4.35885 9.58994 5.30382 9.19907 6.41202 9.19854H15.0081C15.5157 9.19854 15.9466 9.3722 16.3009 9.71951C16.6551 10.0668 16.832 10.4943 16.8315 11.0019C16.8315 11.416 16.7046 11.7868 16.4508 12.1144C16.1969 12.4419 15.8763 12.6589 15.489 12.7652L13.6255 13.3062V16.412C13.6255 16.6925 13.5622 16.9463 13.4355 17.1734C13.3089 17.4005 13.1384 17.5875 12.9242 17.7345C12.7099 17.8814 12.4761 17.9717 12.2229 18.0054C11.9696 18.039 11.7091 18.0022 11.4414 17.8948L7.65434 16.412H2.40454ZM12.0225 14.0075H7.51408C7.42057 14.0075 7.35057 14.0342 7.30408 14.0877C7.2576 14.1411 7.22741 14.2012 7.21352 14.268C7.19962 14.3348 7.20977 14.3984 7.24397 14.4588C7.27817 14.5191 7.33481 14.5624 7.41389 14.5886L12.0225 16.412V14.0075ZM4.00753 14.809H5.69067C5.66396 14.7289 5.64392 14.6487 5.63056 14.5686C5.6172 14.4884 5.61052 14.4016 5.61052 14.3081C5.61052 13.7871 5.79754 13.3396 6.17157 12.9656C6.5456 12.5915 6.9931 12.4045 7.51408 12.4045H10.7802L15.0682 11.2223C15.135 11.1956 15.1817 11.1622 15.2084 11.1221C15.2352 11.0821 15.2418 11.0353 15.2285 10.9819C15.2151 10.9284 15.1916 10.8852 15.1579 10.852C15.1243 10.8189 15.0743 10.8021 15.0081 10.8015H6.41202C5.74411 10.8015 5.17638 11.0353 4.70884 11.5028C4.2413 11.9704 4.00753 12.5381 4.00753 13.206V14.809ZM8.01501 8.39704C7.13337 8.39704 6.37862 8.08312 5.75079 7.45529C5.12295 6.82745 4.80903 6.07271 4.80903 5.19106C4.80903 4.30941 5.12295 3.55467 5.75079 2.92683C6.37862 2.299 7.13337 1.98508 8.01501 1.98508C8.89666 1.98508 9.6514 2.299 10.2792 2.92683C10.9071 3.55467 11.221 4.30941 11.221 5.19106C11.221 6.07271 10.9071 6.82745 10.2792 7.45529C9.6514 8.08312 8.89666 8.39704 8.01501 8.39704ZM8.01501 6.79405C8.45583 6.79405 8.83334 6.63723 9.14752 6.32357C9.46171 6.00992 9.61854 5.63242 9.618 5.19106C9.61747 4.7497 9.46064 4.37247 9.14752 4.05935C8.83441 3.74623 8.4569 3.58914 8.01501 3.58807C7.57312 3.587 7.19588 3.74409 6.8833 4.05935C6.57072 4.3746 6.41362 4.75184 6.41202 5.19106C6.41042 5.63028 6.56751 6.00778 6.8833 6.32357C7.19909 6.63936 7.57633 6.79619 8.01501 6.79405Z"
                  fill="#E74694"
                />
              </svg>
              <h3 class="font-bold">Total Ibu</h3>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold">{{ data?.user }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between"></div>
        </n-card>

        <n-card
          id="total artikel"
          class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
          style="
            background: linear-gradient(
              135deg,
              white 60%,
              /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
              /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                /* Warna pink penuh pada 100% area */
            );
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 11.4737C11.0415 11.4737 10.1046 11.1959 9.30762 10.6754C8.51068 10.1549 7.88953 9.4151 7.52274 8.54955C7.15594 7.68401 7.05997 6.73159 7.24696 5.81273C7.43395 4.89387 7.89551 4.04985 8.57325 3.38739C9.251 2.72493 10.1145 2.27379 11.0546 2.09102C11.9946 1.90825 12.969 2.00205 13.8545 2.36057C14.7401 2.71909 15.4969 3.32623 16.0294 4.1052C16.5619 4.88416 16.8462 5.79998 16.8462 6.73684C16.8447 7.9927 16.3337 9.19673 15.4252 10.0848C14.5167 10.9728 13.2848 11.4723 12 11.4737ZM12 4.10526C11.4675 4.10526 10.947 4.2596 10.5042 4.54877C10.0615 4.83793 9.71641 5.24892 9.51263 5.72978C9.30886 6.21064 9.25554 6.73976 9.35942 7.25024C9.46331 7.76072 9.71973 8.22962 10.0963 8.59765C10.4728 8.96568 10.9525 9.21632 11.4748 9.31786C11.997 9.4194 12.5383 9.36728 13.0303 9.16811C13.5223 8.96893 13.9427 8.63163 14.2386 8.19887C14.5344 7.76611 14.6923 7.25732 14.6923 6.73684C14.6923 6.03891 14.4087 5.36955 13.9037 4.87604C13.3988 4.38252 12.714 4.10526 12 4.10526Z"
                  fill="#E74694"
                />
                <path
                  d="M17.9231 22H6.07692C5.79131 22 5.51739 21.8891 5.31542 21.6917C5.11346 21.4943 5 21.2265 5 20.9474V17.7895C5.00171 16.3941 5.56957 15.0564 6.57901 14.0697C7.58845 13.083 8.95705 12.528 10.3846 12.5263H13.6154C15.0429 12.528 16.4116 13.083 17.421 14.0697C18.4304 15.0564 18.9983 16.3941 19 17.7895V20.9474C19 21.2265 18.8865 21.4943 18.6846 21.6917C18.4826 21.8891 18.2087 22 17.9231 22ZM7.15385 19.8947H16.8462V17.7895C16.8462 16.9519 16.5058 16.1487 15.8999 15.5565C15.294 14.9643 14.4722 14.6316 13.6154 14.6316H10.3846C9.52776 14.6316 8.706 14.9643 8.10012 15.5565C7.49423 16.1487 7.15385 16.9519 7.15385 17.7895V19.8947Z"
                  fill="#E74694"
                />
              </svg>
              <h3 class="font-bold">Total Artikel</h3>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold">{{ data?.article }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <RouterLink to="/admin/article" class="flex items-center space-x-4">
              <p class="text-sm text-gray-500">Lihat Detail</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8.90991 19.9201L15.4299 13.4001C16.1999 12.6301 16.1999 11.3701 15.4299 10.6001L8.90991 4.08008"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </RouterLink></div
        ></n-card>
        <n-card
          id="total jadwal posyandu"
          class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
          style="
            background: linear-gradient(
              135deg,
              white 60%,
              /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
              /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                /* Warna pink penuh pada 100% area */
            );
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_2049_1299)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.513 2.452C3.69337 2.37806 3.83786 2.23679 3.91585 2.05814C3.99385 1.87948 3.99922 1.67748 3.93083 1.49493C3.86244 1.31239 3.72566 1.16364 3.54948 1.08021C3.3733 0.996785 3.17155 0.985233 2.987 1.048L1.96 1.433C1.53126 1.59378 1.16177 1.88153 0.90089 2.25785C0.640009 2.63416 0.500153 3.08111 0.5 3.539V6C0.499774 7.17753 0.936931 8.31316 1.72666 9.1866C2.5164 10.06 3.6024 10.609 4.774 10.727C4.89633 11.9393 5.47985 13.0582 6.40391 13.8524C7.32797 14.6466 8.52189 15.0554 9.7388 14.9941C10.9557 14.9328 12.1026 14.4063 12.9422 13.5233C13.7818 12.6403 14.25 11.4685 14.25 10.25V9.886C14.8201 9.70681 15.3071 9.32943 15.623 8.82218C15.9389 8.31494 16.0627 7.71136 15.9721 7.12072C15.8814 6.53007 15.5823 5.9914 15.1288 5.60223C14.6754 5.21306 14.0976 4.99911 13.5 4.99911C12.9024 4.99911 12.3246 5.21306 11.8712 5.60223C11.4177 5.9914 11.1186 6.53007 11.0279 7.12072C10.9373 7.71136 11.0611 8.31494 11.377 8.82218C11.6929 9.32943 12.1799 9.70681 12.75 9.886V10.25C12.751 11.0788 12.4354 11.8768 11.8675 12.4805C11.2997 13.0843 10.5227 13.4484 9.69534 13.4982C8.868 13.548 8.05289 13.2798 7.41673 12.7485C6.78056 12.2172 6.37143 11.463 6.273 10.64C7.3299 10.4069 8.27551 9.81987 8.95328 8.97607C9.63105 8.13227 10.0003 7.0823 10 6V3.54C10.0001 3.08194 9.86029 2.63477 9.59939 2.25826C9.3385 1.88175 8.9689 1.59384 8.54 1.433L7.513 1.048C7.32845 0.985233 7.1267 0.996785 6.95052 1.08021C6.77434 1.16364 6.63756 1.31239 6.56917 1.49493C6.50078 1.67748 6.50615 1.87948 6.58415 2.05814C6.66214 2.23679 6.80663 2.37806 6.987 2.452L8.013 2.837C8.15598 2.89054 8.27921 2.98644 8.36623 3.11188C8.45326 3.23732 8.49992 3.38633 8.5 3.539V6C8.5 6.86196 8.15759 7.68861 7.5481 8.2981C6.9386 8.90759 6.11195 9.25 5.25 9.25C4.38805 9.25 3.5614 8.90759 2.9519 8.2981C2.34241 7.68861 2 6.86196 2 6V3.54C1.99987 3.38716 2.04645 3.23793 2.13348 3.11229C2.22052 2.98665 2.34386 2.8906 2.487 2.837L3.513 2.452ZM13.5 8.5C13.7652 8.5 14.0196 8.39465 14.2071 8.20711C14.3946 8.01957 14.5 7.76522 14.5 7.5C14.5 7.23479 14.3946 6.98043 14.2071 6.7929C14.0196 6.60536 13.7652 6.5 13.5 6.5C13.2348 6.5 12.9804 6.60536 12.7929 6.7929C12.6054 6.98043 12.5 7.23479 12.5 7.5C12.5 7.76522 12.6054 8.01957 12.7929 8.20711C12.9804 8.39465 13.2348 8.5 13.5 8.5Z"
                    fill="#E74694"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2049_1299">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h3 class="font-bold">Total Jadwal Posyandu</h3>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold">{{ data?.scheduleTotal }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <RouterLink to="/admin/schedule" class="flex items-center space-x-4">
              <p class="text-sm text-gray-500">Lihat Detail</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8.90991 19.9201L15.4299 13.4001C16.1999 12.6301 16.1999 11.3701 15.4299 10.6001L8.90991 4.08008"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </RouterLink></div
        ></n-card>
      </div>

      <!-- Schedule Table -->
      <div class="bg-white hidden md:block rounded-lg shadow p-6">
        <!-- Header: Search and Add Button -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Data Jadwal Posyandu</h3>
          <div class="flex items-center gap-4">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-9 w-80"
              placeholder="Search"
              type="text"
              @keydown.enter="params.search = search"
            />
            <n-button
              @click="params.search = search"
              type="primary"
              class="bg-blue-500 rounded-lg text-white"
            >
              <i-material-symbols:search></i-material-symbols:search>
            </n-button>
          </div>
        </div>
        <!-- Data Table -->
        <div class="hidden md:block md:overflow-auto">
          <n-data-table
            :columns="columns"
            :data="itemsSchedule"
            pagination-behavior-on-filter="first"
            class="mb-4 min-w-max overflow-x-auto justify-center text-center"
            @refetch="refetch"
          />
        </div>
        <n-pagination v-model:page="params.page" :page-count="schedules?.meta?.totalPage" />
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
