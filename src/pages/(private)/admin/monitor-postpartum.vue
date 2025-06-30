x
<script setup lang="ts">
import Action from '@/components/mother/action-postpartum.vue';
import { useAdminReadmonitorPostPartum, type Daum } from '@/services/admin-monitor-postpartum';
import { NButton } from 'naive-ui'; // Ensure proper Naive UI imports
import { ref } from 'vue';

const params = ref<{ page: number; pageSize: number; search?: string }>({
  page: 1,
  search: '',
  pageSize: 10
})

const { data: monitors } = useAdminReadmonitorPostPartum(params)
const search = ref('')

const monitorData = computed(() => {
  return monitors.value?.data.map((monitor: Daum) => {
    return {
      id: monitor.id,
      motherName: monitor.mother?.name,
      day: monitor.dayPostPartum.name,
      checkPostpartum: monitor.question1,
      consumeTablet: monitor.question2,
      vitaminA: monitor.question3,
      nutrition: monitor.question4,
      status: monitor.status
    }
  })
})

const columns = ref([
  {
    title: 'NAMA IBU',
    key: 'motherName'
  },
  {
    title: 'HARI KE',
    key: 'day'
  },
  {
    title: 'PEMERIKSAAN NIFAS',
    key: 'checkPostpartum',
    render(row: { checkPostpartum: boolean }) {
      return row.checkPostpartum ? 'Belum Periksa' : 'Sudah Periksa'
    }
  },
  {
    title: 'KONSUMSI TTD',
    key: 'consumeTablet',
    render(row: { consumeTablet: boolean }) {
      return row.consumeTablet ? 'Belum Konsumsi' : 'Sudah Konsumsi'
    }
  },
  {
    title: 'KONSUMSI VIT A',
    key: 'note',
    render(row: { vitaminA: boolean }) {
      return row.vitaminA ? 'Belum Konsumsi' : 'Sudah Konsumsi'
    }
  },
  {
    title: 'PEMENUHAN GIZI',
    key: 'note',
    render(row: { nutrition: boolean }) {
      return row.nutrition ? 'Tidak Memenuhi' : 'Memenuhi'
    }
  },
  {
    title: 'STATUS',
    key: 'status',
    render(row: { status: string }) {
      return row.status === 'UNHEALTY' ? 'Segera ke faskes' : 'Sehat'
    }
  },
  {
    title: 'Aksi',
    key: 'action',
    render(data: { id: string }) {
      return h('div', [
        h(Action, {
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
    <div>
      <h1 class="md:-2xl sm:text-base font-semibold">Pantau Ibu Nifas</h1>
      <p class="text-gray-600 sm:text-sm font-normal">Informasi tentang data pantau ibu nifas</p>
    </div>
    <div class="flex flex-col bg-white rounded-lg overflow-auto">
      <div
        class="flex flex-col md:flex-row w-full justify-between mb-6 space-y-4 md:items-center md:space-y-0"
      >
        <h3 class="text-lg font-semibold">Data Pantauan</h3>
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
            type="primary"
            @click="onSearch"
          >
            <i-material-symbols:search></i-material-symbols:search>
          </n-button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <n-data-table
          :columns="columns"
          :data="monitorData"
          pagination-behavior-on-filter="first"
          class="justify-center whitespace-nowrap text-center overflow-x-auto min-w-[768px] w-full"
        />
      </div>
       <n-pagination
        v-model:page="params.page"
        :page-count="monitors?.meta?.totalPage"
        class="mt-4"
      />
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>
