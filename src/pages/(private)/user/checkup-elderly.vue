<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { NDataTable, NPagination, NDatePicker, NInput, NButton, NDropdown, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { useCheckupDetail, useCheckupList } from '@/services/checkup-elderly'
import { DateTime } from 'luxon'
import type { Daum } from '@/services/checkup-elderly'
import VueApexCharts from 'vue3-apexcharts'
import { calculateAge } from '@/helpers/age.helper'

const params = ref({
  page: 1,
  limit: 10,
  search: '',
  date: null as string | null
})

const { data, refetch } = useCheckupList(params)

const checkupData = computed(() => {
  console.log('Data diterima:', data.value?.data)
  return data.value?.data || []
})

const selectedDate = ref<[number, number]>()
const search = ref<string>('')

watch(
  [
    () => params.value.page,
    () => params.value.limit,
    () => params.value.date,
    () => params.value.search
  ],
  () => {
    refetch()
  }
)

watch(selectedDate, (newDate) => {
  if (newDate) {
    const startDate = DateTime.fromMillis(newDate[0]).toISODate()
    const endDate = DateTime.fromMillis(newDate[1]).toISODate()
    params.value.date = `${startDate},${endDate}`
  } else {
    params.value.date = null
  }
  params.value.page = 1
})

watch(search, (newSearch) => {
  params.value.search = newSearch
  params.value.page = 1
})

const columns: DataTableColumns<Daum> = [
  {
    title: 'Tanggal',
    key: 'createdAt',
    render: (row) => DateTime.fromISO(row.createdAt).toFormat('yyyy-MM-dd')
  },
  { title: 'Posyandu', key: 'healthPost.name' },
  { title: 'Nama', key: 'elderly.name' },
  {
    title: 'Jenis Kelamin',
    key: 'elderly.gender',
    render: (row) => (row?.elderly?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan')
  },
  {
    title: 'Umur',
    key: 'age',
    render: (row) => {
      if (!row?.elderly?.dateOfBirth) return '-'
      return calculateAge(row?.elderly?.dateOfBirth, row?.createdAt)
    }
  },
  {
    title: 'IMT',
    key: 'bmiStatus',
    render(row) {
      if (!row.bmiStatus) return '-'

      let bgColor = ''
      let textColor = ''

      switch (row.bmiStatus) {
        case 'NORMAL':
          bgColor = '#E8F5E9'
          textColor = '#2E7D32'
          break
        case 'OBESITY':
          bgColor = '#FFF3E0'
          textColor = '#E65100'
          break
        case 'STUNTING':
          bgColor = '#FFEBEE'
          textColor = '#C62828'
          break
        default:
          bgColor = '#E0E0E0'
          textColor = '#616161'
      }

      return h(
        'div',
        {
          style: {
            backgroundColor: bgColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: '500'
          }
        },
        `${row.bmi} ${row.bmiStatus}`
      )
    }
  },
  {
    title: 'Surat Rujukan',
    key: 'referralLetter',
    render(row) {
      return row.fileDiagnosed?.path
        ? h(
            'a',
            {
              href: row.fileDiagnosed?.path,
              target: '_blank',
              class: 'text-blue-500 underline'
            },
            'suratrujukan.pdf'
          )
        : '-'
    }
  },
  {
    title: 'Aksi',
    key: 'actions',
    render(ro) {
      return h(
        NDropdown,
        {
          onSelect: (v) => {
            if (v === 'detail') {
              showHistoryCheckup.value = true
              checkupDetail.value = ro
            }
          },
          trigger: 'click',
          options: [{ label: 'Detail', key: 'detail' }]
        },
        () =>
          h(
            NButton,
            {
              text: true,
              style: { padding: '4px' }
            },
            () =>
              h(
                'div',
                {
                  style: {
                    cursor: 'pointer',
                    fontSize: '20px'
                  }
                },
                '⋮'
              )
          )
      )
    }
  }
]

const chartOptions = computed(() => {
  return {
    options: {
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: checkupData.value.map((item) =>
          DateTime.fromISO(item.createdAt).toFormat('yyyy-MM-dd')
        )
      }
    },
    series: [
      {
        name: 'IMT',
        data: checkupData.value.map((item) => item.bmi)
      },
      {
        name: 'Gula Darah',
        data: checkupData.value.map((item) => item.bloodSugar)
      },
      {
        name: 'Tekanan Darah',
        data: checkupData.value.map((item) => item.bloodTension)
      }
    ]
  }
})

const showHistoryCheckup = ref(false)
const checkupDetail = ref<Daum | null>(null)

const onOpen = (path: string) => {
  window.open(path, '_blank')
}

const { data: checkupDetailData } = useCheckupDetail(
  computed(() => checkupDetail.value?.id) as Ref<string>
)

const styleComputed = (status: string) => {
  const match = {
    OBESITY: {
      backgroundColor: '#FFF3E0',
      color: '#E65100'
    },
    NORMAL: {
      backgroundColor: '#E8F5E9',
      color: '#2E7D32'
    },
    STUNTING: {
      backgroundColor: '#FFEBEE',
      color: '#C62828'
    }
  }
  return match[status as keyof typeof match] || {}
}
</script>

<template>
  <n-modal v-model:show="showHistoryCheckup" preset="card" class="max-w-md">
    <template #header>
      <div class="font-semibold">Detail Pemeriksaan</div>
    </template>
    <div>
      <div class="font-semibold text-center">
        {{ checkupDetail?.elderly?.name }}
      </div>
      <table class="w-full">
        <tbody>
          <n-tr>
            <n-td class="py-2">Umur</n-td>
            <n-td class="py-2 text-right">
              {{
                calculateAge(
                  checkupDetail?.elderly?.dateOfBirth as string,
                  checkupDetail?.createdAt as string
                )
              }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Jenis Kelamin</n-td>
            <n-td class="py-2 text-right">
              {{ checkupDetail?.elderly?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan' }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Tinggi Badan</n-td>
            <n-td class="py-2 text-right">{{ checkupDetail?.height }} cm</n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Berat Badan</n-td>
            <n-td class="py-2 text-right">{{ checkupDetail?.weight }} kg</n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Tekanan Darah</n-td>
            <n-td class="py-2 text-right">{{ checkupDetail?.bloodTension }} mmHg</n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Gula Darah</n-td>
            <n-td class="py-2 text-right"> {{ checkupDetail?.bloodSugar }} mg/dL </n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Paru-Paru</n-td>
            <n-td class="py-2 text-right">
              {{ checkupDetailData?.lungs?.lungsConclution?.conclusion || '-' }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td class="text-left">Indeks Masa Tubuh</n-td>
            <n-td class="py-2 text-right">
              <div class="flex justify-end">
                <div
                  class="p-2 w-fit rounded"
                  :style="styleComputed(checkupDetail?.bmiStatus as string)"
                >
                  {{ checkupDetail?.bmi }} ({{ checkupDetail?.bmiStatus }})
                </div>
              </div>
            </n-td>
          </n-tr>
          <n-tr>
            <n-td class="text-left">Surat Rujukan</n-td>
            <n-td class="py-2 text-right">
              <n-button
                v-if="checkupDetail?.fileDiagnosed?.path"
                secondary
                @click="onOpen(checkupDetail?.fileDiagnosed?.path)"
              >
                suratrujukan.pdf
              </n-button>
              <span v-else>-</span>
            </n-td>
          </n-tr>
        </tbody>
      </table>
    </div>
  </n-modal>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Kesehatan Lansia</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="#" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <span>Kesehatan Lansia</span>
      </nav>
    </div>

    <div>
      <VueApexCharts :height="400" :series="chartOptions.series" :options="chartOptions.options" />
    </div>

    <!-- Examination History -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Riwayat Pemeriksaan</h2>
        <div class="flex items-center gap-2">
          <n-date-picker
            type="monthrange"
            v-model:value="selectedDate"
            start-placeholder="Pilih bulan"
            end-placeholder="Pilih bulan"
            clearable
            class="w-60 date-picker"
          />
          <div class="relative">
            <n-input v-model:value="search" placeholder="Cari" class="w-60 search-input">
              <template #prefix>
                <n-icon size="18">
                  <Search />
                </n-icon>
              </template>
            </n-input>
          </div>
        </div>
      </div>

      <n-data-table :columns="columns" :data="checkupData" :pagination="false" />

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="params.page"
          v-model:page-size="params.limit"
          :item-count="data?.meta.totalData || 0"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-data-table-thead) {
  background-color: #a6c9f5 !important;
}
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
}

.search-input :deep(.n-input) {
  border-radius: 8px;
}

.search-input :deep(.n-input-wrapper) {
  padding-left: 12px;
}

.search-input :deep(.n-input__prefix) {
  margin-right: 8px;
  color: #8e8e8e;
}

.search-input :deep(.n-input__input-el) {
  font-size: 14px;
}

.custom-button {
  background-color: #0f5bc0 !important;
  border-color: #0f5bc0 !important;
}

.custom-button:hover {
  background-color: #0d4fa8 !important;
  border-color: #0d4fa8 !important;
}

.custom-button:active {
  background-color: #0b4390 !important;
  border-color: #0b4390 !important;
}
</style>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
