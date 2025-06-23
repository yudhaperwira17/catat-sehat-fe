<script setup lang="ts">

import { Search } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NDataTable, NIcon, NInput, NPagination, NSpace, useDialog, useMessage } from 'naive-ui'
import { computed, h, ref, watch, type Ref } from 'vue'
import { DateTime } from 'luxon'
import { useElderlyAdminDelete, useElderlyAdminList } from '@/services/elderly'

// Initialize Naive UI dialog and message
const dialog = useDialog()
const message = useMessage()

interface Elderly {
  id?: string
  name?: string
  gender?: string
  placeOfBirth?: string
  dateOfBirth?: string
  bloodType?: string
  address?: string
  elderlyPicture?: string
  fileElderlyIdentity?: string
}

const selectedId = ref<string | null>(null)

// Parameters for API call
const params = ref({
  page: 1,
  limit: 10, // Default limit, can be adjusted
  search: ''
})

// Fetch data from API
const { data, refetch, isLoading } = useElderlyAdminList(params)
const { mutate: onDelete, isPending } = useElderlyAdminDelete(selectedId as Ref<string>)

const paginatedData = computed(() => data.value?.data || [])

// Calculating age with Luxon using computed property
function calculateAge(birthDate: string): number {
  if(!birthDate) return 0
  const birthDateTime = DateTime.fromISO(birthDate) // Convert to Luxon DateTime
  const currentDate = DateTime.now() // Current date
  const diffInYears = currentDate.diff(birthDateTime, 'years').years // Calculate the difference in years

  return Math.floor(diffInYears) // Return age in integers
}

const handleSearch = () => {
  params.value.page = 1; // Reset page to 1 when searching
  refetch();
};

// Watch for changes in params.page or params.limit to refetch data
watch([() => params.value.page, () => params.value.limit], () => {
  refetch();
});

const columns: DataTableColumns<Elderly> = [
  {
    title: 'Nama',
    key: 'name'
  },
  {
    title: 'Tanggal Lahir',
    key: 'dateOfBirth',
    render(row: Elderly) {
      return DateTime.fromISO(row.dateOfBirth || '').toLocaleString(DateTime.DATE_FULL)
    }
  },
  {
    title: 'Umur',
    key: 'age',
    render(row: Elderly) {
      return `${calculateAge(row.dateOfBirth || '')}`
    }
  },
  {
    title: 'Alamat',
    key: 'address'
  },
  {
    title: 'Aksi',
    key: 'action',
    align: 'center',
    render(row: Elderly) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                type: 'error',
                size: 'small',
                loading: isPending.value && selectedId.value === row.id,
                onClick: () => {
                  dialog.warning({
                    title: 'Konfirmasi',
                    content: 'Apakah Anda yakin ingin menghapus data ini?',
                    positiveText: 'Ya',
                    negativeText: 'Tidak',
                    onPositiveClick: () => {
                      selectedId.value = row.id || null
                      onDelete(
                        row.id || '',
                        {
                          onSuccess: () => {
                            refetch()
                            message.success('Data lansia berhasil dihapus')
                          },
                          onError: () => {
                            message.error('Gagal menghapus data lansia')
                          }
                        }
                      )
                    }
                  })
                },
                style: {
                  backgroundColor: '#FF0000',
                  borderColor: '#FF0000',
                  color: '#ffffff',
                  fontSize: '13px'
                }
              },
              { default: () => 'Hapus' }
            )
          ]
        }
      )
    }
  }
]
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">

      <h1 class="text-xl md:text-2xl font-semibold">Master Data</h1>
      <nav class="text-sm text-gray-500 mt-2">
                <router-link to="/admin/dashboard" class="hover:underline">Dashboard</router-link>

        <span class="mx-1">></span>
        <span>Master Data Lansia</span>
      </nav>

    </div>

    <!-- Card -->
    <div class="bg-white p-4 rounded-lg shadow">
      <!-- Subheader & Search -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Lansia</h2>
        <div class="flex items-center gap-2">

          <n-input v-model:value="params.search" placeholder="Search" class="w-60 search-input" clearable>

            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button type="primary" class="search-btn" @click="handleSearch">
            <n-icon :component="Search" />
          </n-button>
        </div>
      </div>

      <!-- Tabel -->

      <n-data-table
        :columns="columns"
        :data="paginatedData"
        :pagination="false"
        :bordered="false"
        class="custom-table"
      />

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <n-pagination v-model:page="params.page" v-model:page-size="params.limit" :item-count="data?.meta?.totalData || 0" />

      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>

<style scoped>
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
  font-weight: normal !important;
  font-size: 14px !important;
  text-transform: capitalize !important;
  color: inherit !important;
}

:deep(.n-data-table-td) {
  font-size: 14px !important;
  color: inherit !important;
  padding: 12px 16px !important;
}

:deep(.n-data-table) {
  --n-merged-th-color: #a6c9f5 !important;
  --n-merged-td-color: #ffffff !important;
  --n-th-padding: 12px 16px !important;
  --n-td-padding: 12px 16px !important;
}

.search-btn {

  background-color: #0f5bc0;
  border-color: #0f5bc0;
}

.search-btn:hover {
  background-color: #0d4fa8;

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

:deep(.custom-table) {
  width: 100%;
}
</style>
