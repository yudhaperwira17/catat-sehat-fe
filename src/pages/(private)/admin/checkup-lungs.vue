<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import {
  NDataTable,
  NPagination,
  NDatePicker,
  NInput,
  NButton,
  NIcon,
  NDropdown,
  useMessage,
  NSpin
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { DateTime } from 'luxon'
import { calculateAge } from '@/helpers/age.helper'
import { useDownloadCheckup, useLungsCheckup, type Daum } from '@/services/lungs'

const { mutate: downloadCheckup, isPending: isDownloadPending } = useDownloadCheckup()
const message = useMessage()

const params = ref({
  page: 1,
  limit: 10,
  search: '',
  date: null as string | null
})

const { data, refetch } = useLungsCheckup(params)

const checkupData = computed(() => {
  console.log('Data diterima:', data.value?.data)
  return data.value?.data || []
})

const selectedDate = ref<number | null>(null)
const search = ref<string>('')

// State untuk loading download per baris
const downloadingId = ref<string | null>(null)

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
    params.value.date = DateTime.fromMillis(newDate).toUTC().toISO() || null
  } else {
    params.value.date = null
  }
  params.value.page = 1
})

watch(search, (newSearch) => {
  params.value.search = newSearch
  params.value.page = 1
})

type Checkup = Daum

const columns: DataTableColumns<Checkup> = [
  {
    title: 'Tanggal',
    key: 'createdAt',
    render: (row) => DateTime.fromISO(row.createdAt).toLocal().toFormat('yyyy-MM-dd')
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
      return calculateAge(row?.elderly?.dateOfBirth || '', row.createdAt)
    }
  },
  {
    title: 'Status',
    key: 'bmiStatus',
    render(row) {
      return h(
        'div',
        {
          style: {
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: '500'
          }
        },
        `${row.lungsConclution.conclusion}`
      )
    }
  },
  {
    title: 'Hasil Pemeriksaan',
    key: 'hasilPemeriksaan',
    render(row) {
      return h(
        'a',
        {
          class: 'text-blue-500 underline',
          style: 'cursor:pointer;min-width:150px;display:inline-block;',
          href: '#',
          onClick: (e: Event) => {
            e.preventDefault()
            if (downloadingId.value === row.id) return
            downloadingId.value = row.id
            // Format nama file
            let name = row.elderly?.name || 'lansia'
            name = name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
            const filename = `hasilpemeriksaan-${name}.pdf`
            downloadCheckup(
              {
                id: row.id
              },
              {
                onSuccess: (data) => {
                  const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
                  // Buat link download dan buka tab baru
                  const a = document.createElement('a')
                  a.href = url
                  a.download = filename
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  window.open(url, '_blank')
                  message.success('Data berhasil diunduh')
                  downloadingId.value = null
                },
                onError: () => {
                  message.error('Data gagal diunduh')
                  downloadingId.value = null
                }
              }
            )
          }
        },
        downloadingId.value === row.id ? h(NSpin, { size: 18 }) : 'hasilpemeriksaan.pdf'
      )
    }
  },
  {
    title: 'Aksi',
    key: 'actions',
    render(row) {
      return h(
        NDropdown,
        {
          onSelect: (v: string) => {
            if (v === 'detail') {
              showHistoryCheckup.value = true
              checkupDetail.value = row
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

const showHistoryCheckup = ref(false)
const checkupDetail = ref<Checkup | null>(null)
</script>

<template>
  <n-modal v-model:show="showHistoryCheckup" preset="card" class="max-w-md">
    <template #header>
      <div class="font-semibold">Detail Pemeriksaan Paru</div>
    </template>
    <div>
      <div class="font-semibold text-center">
        {{ checkupDetail?.elderly?.name || '-' }}
      </div>
      <table class="w-full">
        <tbody>
          <n-tr>
            <n-td class="py-2">Umur</n-td>
            <n-td class="py-2 text-right">
              {{
                checkupDetail?.elderly?.dateOfBirth
                  ? calculateAge(checkupDetail?.elderly?.dateOfBirth, checkupDetail?.createdAt)
                  : '-'
              }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Jenis Kelamin</n-td>
            <n-td class="py-2 text-right">
              {{
                checkupDetail?.elderly?.gender === 'MALE'
                  ? 'Laki-laki'
                  : checkupDetail?.elderly?.gender === 'FEMALE'
                    ? 'Perempuan'
                    : '-'
              }}
            </n-td>
          </n-tr>
          <n-tr v-for="(item, index) in checkupDetail?.lungsPivot || []" :key="index">
            <n-td>
              {{ item.masterDataLungs.question }}
            </n-td>
            <n-td class="py-2 text-right">
              {{ item.value == 0 ? 'Tidak' : item.value == 1 ? 'Ya' : '-' }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td class="py-2">Kesimpulan</n-td>
            <n-td class="py-2 text-right">
              {{ checkupDetail?.lungsConclution?.conclusion || '-' }}
            </n-td>
          </n-tr>
        </tbody>
      </table>
    </div>
  </n-modal>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Kesehatan Paru</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <router-link to="/admin/dashboard" class="hover:underline">Dashboard</router-link>

        <span class="mx-1">></span>
        <span>Kesehatan Paru</span>
      </nav>
    </div>

    <!-- Examination History -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Riwayat Pemeriksaan Paru</h2>
        <div class="flex items-center gap-2">
          <n-date-picker
            type="date"
            v-model:value="selectedDate"
            placeholder="Pilih Tanggal"
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
          <n-button
            type="primary"
            class="custom-button"
            @click="$router.push('/admin/add-checkup-lungs')"
          >
            Tambah Pemeriksaan Paru
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
  layout: admin
  requiresAuth: true
</route>
