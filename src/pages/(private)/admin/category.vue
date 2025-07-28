<script setup lang="ts">
import DetailPosyandu from '@/components/componen-admin/action-category.vue'
import CreateSchedule from '@/components/modal/input-admin/Create-BMI.vue'
import { useAdminReadCategory, type Daum } from '@/services/bmi-category'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const params = ref<{ page: number; limit: number; search?: string }>({
  page: 1,
  search: '',
  limit: 10
})

const { data: schedules } = useAdminReadCategory(params)
const search = ref('')
const createData = ref(false)


const itemsSchedule = computed(() => {
  return schedules.value?.data.map((schedule: Daum) => {
    return {
      id: schedule.id,
      gender: schedule.gender === 'FEMALE' ? 'Perempuan' : 'Laki-Laki',
      minBmi: schedule.minBMI,
      maxBmi: schedule.maxBMI,
      age: `${schedule.minAge} - ${schedule.maxAge}`,
      status: schedule.status
    }
  })
})

// Column definitions for the table
const columns = ref([
  {
    title: 'Jenis Kelamin',
    key: 'gender'
  },
  {
    title: 'Nilai BMI Minimum',
    key: 'minBmi'
  },
  {
    title: 'Nilai BMI Maksimum',
    key: 'maxBmi',
  },
  {
    title: 'usia',
    key: 'age'
  },
  {
    title: 'status',
    key: 'status'
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
    <div>
      <h1 class="md:-2xl sm:text-base font-semibold">Master Data</h1>
      <p class="text-gray-600 sm:text-sm font-normal">Informasi tentang data BMI</p>
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
            <i-mdi:plus class="mr-1" /> Tambah Kategori
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
         <n-pagination
        v-model:page="params.page"
        :page-count="schedules?.meta?.totalPage"
        class="mt-4"
      />
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>
