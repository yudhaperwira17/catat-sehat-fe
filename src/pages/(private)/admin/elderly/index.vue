<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { NButton, NDataTable, NInput, NPagination, NIcon, useMessage, NSpace } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import { DateTime } from 'luxon'
import { useElderlyDelete, useElderlyList } from './_services/elderly'
import type { Daum } from './_types/elderly'

const params = ref({ page: 1, limit: 10, search: '' })
const filter = ref({ search: '' })
const selectedId = ref<string>()
const message = useMessage()

const { data, refetch } = useElderlyList(params)
const { mutate: onDelete, isPending } = useElderlyDelete(selectedId as Ref<string>)
const router = useRouter()

const paginatedData = computed(() => data.value?.data || [])

const columns: DataTableColumns<Daum> = [
  {
    title: 'Nama',
    key: 'name'
  },
  {
    title: 'Tanggal Lahir',
    key: 'dateOfBirth',
    render(row) {
      return DateTime.fromISO(row.dateOfBirth).toLocaleString(DateTime.DATE_FULL)
    }
  },
  {
    title: 'Umur',
    key: 'age',
    render(row) {
      return DateTime.fromISO(row.dateOfBirth).diffNow().years
    }
  },
  {
    title: 'Alamat',
    key: 'address'
  },
  {
    title: '',
    key: 'action',
    render(row) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                loading: isPending.value && selectedId.value === row.id,
                onClick: () => {
                  selectedId.value = row.id
                  onDelete(
                    {},
                    {
                      onSuccess: () => {
                        refetch()
                        message.success('Lansia berhasil dihapus')
                      },
                      onError: () => {
                        message.error('Terjadi kesalahan saat menghapus lansia')
                      }
                    }
                  )
                },
                style: {
                  backgroundColor: '#0F5BC0',
                  borderColor: '#0F5BC0',
                  color: '#ffffff',
                  fontSize: '13px',
                  marginRight: '5px'
                }
              },
              { default: () => 'Hapus' }
            ),
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                onClick: () => {
                  router.push(`/admin/elderly/update/${row.id}`)
                },
                style: {
                  backgroundColor: '#0F5BC0',
                  borderColor: '#0F5BC0',
                  color: '#ffffff',
                  fontSize: '13px'
                }
              },
              { default: () => 'Ubah' }
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
        <a href="#" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <span>Master Data Lansia</span>
      </nav>
    </div>

    <div class="flex justify-start mb-4">
      <router-link to="/admin/elderly/create">
        <n-button type="primary">Tambah Data</n-button>
      </router-link>
    </div>

    <!-- Card -->
    <div class="bg-white p-4 rounded-lg shadow">
      <!-- Subheader & Search -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Lansia</h2>
        <form @submit.prevent="params.search = filter.search" class="flex items-center gap-2">
          <n-input
            v-model:value="filter.search"
            placeholder="Search"
            class="w-60 search-input"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button type="primary" class="search-btn" @click="params.search = filter.search">
            <n-icon :component="Search" />
          </n-button>
        </form>
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
        <n-pagination
          v-model:page="params.page"
          v-model:page-size="params.limit"
          :item-count="data?.meta?.totalData"
        />
      </div>
    </div>
  </div>
</template>

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
