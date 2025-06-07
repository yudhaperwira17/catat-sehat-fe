<script setup lang="ts">
import DetailPosyandu from '@/components/componen-admin/HealthPostAction.vue'
import CreateSchedule from '@/components/modal/input-admin/CreateHealthpost.vue'
import { useAdminReadHealthpost, type Daum } from '@/services/admin-healthpost'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 4
})

const { data: schedules } = useAdminReadHealthpost(params)
const search = ref('')
const createData = ref(false)


const itemsSchedule = computed(() => {
  return schedules.value?.data.map((schedule: Daum) => {
    return {
      id: schedule.id,
      name: schedule.name,
      address: schedule.address,
      subDistrict: schedule.subDistrict.name,
    }
  })
})

// Column definitions for the table
const columns = ref([
  {
    title: 'Nama Posyandu',
    key: 'name',
  },
  {
    title: 'Alamat Posyandu',
    key: 'address'
  },
  {
    title: 'Kecamatan',
    key: 'subDistrict',
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
      <h1 class="md:-2xl sm:text-base font-semibold">Posyandu</h1>
      <p class="text-gray-600 sm:text-sm font-normal">Informasi data posyandu</p>
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
            <i-mdi:plus class="mr-1" /> Tambah Data Posyandu
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
