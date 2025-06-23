<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { NDataTable, NPagination, NDatePicker, NInput, NButton, NDropdown, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { useCheckupAdminList } from '@/services/checkup-elderly'
import { DateTime } from 'luxon'
import type { Daum } from '@/services/checkup-elderly'
import { calculateAge } from '@/helpers/age.helper'
import { useCheckupAdminDetail } from '../../../services/checkup-elderly'

interface Checkup {
  id: string
  date: string
  healthPost: string
  name: string
  gender: string
  age: number
  bmi?: string
  bmiStatus: string
  referralLetter?: string
}

const params = ref({
  page: 1,
  limit: 10,
  search: '',
  date: null as string | null
})

const { data, refetch } = useCheckupAdminList(params)

const checkupData = computed(() => {
  console.log('Data diterima:', data.value?.data);
  return data.value?.data || []
})

const selectedDate = ref<number | null>(null)
const search = ref<string>('')

watch([() => params.value.page, () => params.value.limit, () => params.value.date, () => params.value.search], () => {
  refetch();
});

watch(selectedDate, (newDate) => {
  if (newDate) {
    params.value.date = DateTime.fromMillis(newDate).toISODate() || null
  } else {
    params.value.date = null
  }
  params.value.page = 1
})

watch(search, (newSearch) => {
  params.value.search = newSearch
  params.value.page = 1
})

interface TableRow {
  id: string
  date: string
  healthPost: string
  name: string
  gender: string
  age: string
  bmi: string
  bmiStatus: string
  referralLetter: string
}

const columns: DataTableColumns<any> = [
  {
    title: 'Tanggal',
    key: 'createdAt',
    render: (row) => DateTime.fromISO(row.createdAt).toFormat('yyyy-MM-dd')
  },
  { title: 'Posyandu', key: 'healthPost.name' },
  { title: 'Nama', key: 'elderly.name' },
  { title: 'Jenis Kelamin', key: 'elderly.gender' },
  {
    title: 'Umur',
    key: 'age',
    render: (row) => {
      if (!row?.elderly?.dateOfBirth) return '-'
      return calculateAge(row?.elderly?.dateOfBirth || '', row.createdAt)
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
        case 'Normal':
          bgColor = '#E8F5E9'
          textColor = '#2E7D32'
          break
        case 'Obesitas':
          bgColor = '#FFF3E0'
          textColor = '#E65100'
          break
        case 'Stunting':
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
              href: row.referralLetter || '',
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

const showHistoryCheckup = ref(false)
const checkupDetail = ref<Daum | null>(null)

const { data: detail } = useCheckupAdminDetail(computed(() => checkupDetail.value?.id || ''))

const onOpen = (path: string) => {
  window.open(path)
}
</script>

<template>
  <n-modal v-model:show="showHistoryCheckup" preset="card" class="max-w-xl">
    <template #header>
      <div class="flex items-center justify-center">
        <h3 class="text-xl font-medium">Detail Pemeriksaan</h3>
      </div>
    </template>
    <div>
      <div class="text-lg font-semibold text-left">
        {{ checkupDetail?.elderly?.name }}
      </div>
      <table class="w-full">
        <tbody>
          <tr>
            <td class="w-1/2 py-2">Umur</td>
            <td class="w-1/2 py-2">
              {{
                calculateAge(checkupDetail?.elderly?.dateOfBirth || '', checkupDetail?.createdAt)
              }}
              tahun
            </td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Jenis Kelamin</td>
            <td class="w-1/2 py-2">
              {{ checkupDetail?.elderly?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan' }}
            </td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Tinggi Badan</td>
            <td class="w-1/2 py-2">{{ checkupDetail?.height }} cm</td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Berat Badan</td>
            <td class="w-1/2 py-2">{{ checkupDetail?.weight }} kg</td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Tekanan Darah</td>
            <td class="w-1/2 py-2">{{ checkupDetail?.bloodTension }} mmHg</td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Gula Darah</td>
            <td class="w-1/2 py-2">{{ checkupDetail?.bloodSugar }} mg/dL</td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Paru-Paru</td>
            <td class="w-1/2 py-2">{{ detail?.lungs?.lungsConclution?.conclusion }}</td>
          </tr>
          <tr class="border-t">
            <td class="w-1/2 py-2">Indeks Massa Tubuh</td>
            <td class="w-1/2 py-2">
              <n-tag type="success" size="small" v-if="checkupDetail?.bmiStatus === 'NORMAL'">
                {{ checkupDetail?.bmi }}
                Normal
              </n-tag>
              <n-tag type="warning" size="small" v-else-if="checkupDetail?.bmiStatus === 'OBESITY'">
                {{ checkupDetail?.bmi }}
                Obesitas
              </n-tag>
              <n-tag type="error" size="small" v-else-if="checkupDetail?.bmiStatus === 'STUNTING'">
                {{ checkupDetail?.bmi }}
                Stunting
              </n-tag>
            </td>
          </tr>
          <tr>
            <td class="w-1/2 py-2">Surat Rujukan</td>
            <td class="w-1/2 py-2">
              <n-button
                type="default"
                @click="onOpen(checkupDetail?.fileDiagnosed?.path as string)"
              >
                Unduh
              </n-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </n-modal>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Kesehatan Lansia</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <router-link to="/admin/dashboard" class="hover:underline">Dashboard</router-link>

        <span class="mx-1">></span>
        <span>Kesehatan Lansia</span>
      </nav>
    </div>

    <!-- Examination History -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Riwayat Pemeriksaan</h2>
        <div class="flex items-center gap-2">
          <n-date-picker
            type="date"
            v-model:value="selectedDate"
            clearable
            class="w-60 date-picker"
          />
          <div class="relative">
            <n-input v-model:value="search" placeholder="Search" class="w-60 search-input">
              <template #prefix>
                <n-icon size="18">
                  <Search />
                </n-icon>
              </template>
            </n-input>
          </div>
          <n-button
            type="primary"
            class="custom-button"
            @click="$router.push('/admin/elderly/checkup/create')"
          >
            Tambah Pemeriksaan
          </n-button>
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
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
</route>
