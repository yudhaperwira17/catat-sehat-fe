<script setup lang="ts">
import DataAccount from '@/components/DataAccount.vue';
import ModalEditElderly from '@/components/modal/input-user/modal-edit-elderly.vue';
import ModalInputElderly from '@/components/modal/input-user/modal-input-elderly.vue';
import { useElderlyDelete, useElderlyList } from '@/services/elderly';
import { DateTime } from 'luxon';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NDataTable, NModal, NPagination, NSpace, useDialog, useMessage } from 'naive-ui';
import { computed, h, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const dialog = useDialog()
const message = useMessage()

// Define interfaces for elderly data types
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

const selectedElderly = ref<Elderly | null>(null)

const showEditModal = ref(false)
const showInputModal = ref(false)

const selectElderly = (elderly: Elderly) => {
  selectedElderly.value = elderly // Save the selected elderly data
  showEditModal.value = true // Show modal
}

const params = ref({ page: 1, limit: 10, search: '' })
const filter = ref({ search: '' })
const selectedId = ref<string | null>(null)

const { data, refetch, isLoading } = useElderlyList(params)
const { mutate: onDelete, isPending } = useElderlyDelete(selectedId as Ref<string>)

const paginatedData = computed(() => data.value?.data || [])

// Calculating age with Luxon using computed property
function calculateAge(birthDate: string): number {
  if(!birthDate) return 0
  const birthDateTime = DateTime.fromISO(birthDate) // Convert to Luxon DateTime
  const currentDate = DateTime.now() // Current date
  const diffInYears = currentDate.diff(birthDateTime, 'years').years // Calculate the difference in years

  return Math.floor(diffInYears) // Return age in integers
}

const items = computed(() => {
  return data.value?.data.map((elderly: Elderly) => {
    return {
      id: elderly.id,
      name: elderly.name,
      gender: elderly.gender,
      placeOfBirth: elderly.placeOfBirth,
      dateOfBirth: elderly.dateOfBirth,
      bloodType: elderly.bloodType,
      address: elderly.address,
      elderlyPicture: elderly.elderlyPicture,
      fileElderlyIdentity: elderly.fileElderlyIdentity,
      age: calculateAge((elderly.dateOfBirth ?? '') as string),
    }
  }) || []
})

// Pagination
const pagination = ref({ 
  page: 1,
  pageSize: 10
})

const handlePaginationChange = (newPagination: { page: number; pageSize: number }) => {
  params.value.page = newPagination.page;
  params.value.limit = newPagination.pageSize;
}

// ELderly data
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
                type: 'primary',
                size: 'small',
                onClick: () => {
                  selectElderly(row)
                },
                style: {
                  backgroundColor: '#0F5BC0',
                  borderColor: '#0F5BC0',
                  color: '#ffffff',
                  fontSize: '13px',
                  marginRight: '5px'
                }
              },
              { default: () => 'Ubah' }
            ),
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
                            message.success('Lansia berhasil dihapus')
                          },
                          onError: () => {
                            message.error('Lansia gagal dihapus')
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
    <DataAccount/>

    <div class="bg-white p-4 rounded-lg shadow">
      <!-- Subheader & Search -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Lansia</h2>
          <n-button
            type="primary"
            class="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 rounded-md ml-2"
            @click="showInputModal = true"
            >
            Tambah Data
        </n-button>
      </div>

      <!-- Tabel -->
      <n-data-table
        :columns="columns"
        :data="paginatedData"
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
    <n-modal v-model:show="showInputModal" :on-after-leave="() => (showInputModal = false)">
      <modal-input-elderly />
    </n-modal>
    <n-modal v-model:show="showEditModal" :on-after-leave="() => (selectedElderly = null)">
      <modal-edit-elderly :id="String(selectedElderly?.id || '')" @close="showEditModal = false" />
    </n-modal>
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