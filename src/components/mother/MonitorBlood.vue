<script setup lang="tsx">
// import Expand from '@/components/mother/ExpandBlood.vue'
import { useReadMonthsBlood, userMonitorBlood } from '@/services/user-blood-record'
import { NCard, NDataTable, NEmpty, NModal, NSelect, type DataTableColumns } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const { data: months } = useReadMonthsBlood()
const selectedMonth = ref<string>('')
const createData = ref(false)

watch(
  months,
  (newMonths) => {
    if (newMonths && newMonths.length > 0 && !selectedMonth.value) {
      selectedMonth.value = newMonths[0].id
    }
  },
  { immediate: true }
)

const monitorParams = computed(() => {
  return {
    monthId: selectedMonth.value
  }
})

const { data: monitor, isLoading: loading, refetch } = userMonitorBlood(monitorParams)

// Watch selectedMonth dan refetch ketika berubah
watch(selectedMonth, async (newMonth, oldMonth) => {
  if (newMonth && newMonth !== oldMonth) {
    await refetch()
  }
})

export interface Months {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface BloodTabletRecord {
  id: string
  date: string
  type: string
  staffName: string | null
  staffJob: string | null
  note: string
  adminId: string
  motherId: string
  monthId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  monthBlood: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
  admin: {
    id: string
    name: string
    email: string
    phone: string
    type: string
    createdAt: string
    updatedAt: string
  }
}

export interface BloodTabletData {
  monthName: string
  totalConsume: number
  statusBlood: string
  data: BloodTabletRecord[]
}

const monthOptions = computed(() => {
  const options =
    months.value?.map((item: Months) => ({
      label: item.name,
      value: item.id
    })) || []

  return [{ label: 'Pilih Bulan', disabled: true, value: '' }, ...options]
})

const selectMonth = (value: string) => {
  selectedMonth.value = value
}



// Function untuk menutup modal
const closeCreateModal = () => {
  createData.value = false
}

const formattedMonitorData = computed(() => {
  // Handle jika monitor.value adalah null/undefined
  if (!monitor.value || !monitor.value.data) {
    return []
  }

  const dataArray = monitor.value.data || []

  if (!dataArray || dataArray.length === 0) {
    return []
  }

  const formatted = dataArray.map((item: BloodTabletRecord) => {
    return {
      id: item.id,
      date: item.date,
      adminName: item.admin?.name || item.staffName,
      adminType: item.admin?.type || item.staffJob,
      note: item.note,
      monthName: item.monthBlood?.name || 'N/A',
      createdAt: item.createdAt,
      fullData: item
    }
  })

  return formatted
})



const columns: DataTableColumns = [
  // {
  //   type: 'expand',
  //   renderExpand: (rowData: any) => {
  //     return <Expand recordData={rowData.fullData} />
  //   }
  // },
  {
    title: 'No',
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
    width: 60
  },
  {
    title: 'Tanggal',
    key: 'date',
    render(row: any) {
      return new Date(row.date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    width: 150
  },
  {
    title: 'Nama Pengontrol',
    key: 'adminName',
    width: 200
  },
  {
    title: 'Status Pengontrol',
    key: 'adminType',
    width: 150
  },
  {
    title: 'Catatan',
    key: 'note',
    width: 200,
    render(row: any) {
      return row.note || '-'
    }
  }
]

// Computed untuk mengecek apakah data kosong
const isDataEmpty = computed(() => {
  return !loading.value && (!formattedMonitorData.value || formattedMonitorData.value.length === 0)
})

// Computed untuk informasi summary
const summaryInfo = computed(() => {
  if (!monitor.value) return null
  return {
    monthName: monitor.value.monthName,
    totalConsume: monitor.value.totalConsume,
    statusBlood: monitor.value.statusBlood
  }
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex md:flex-row md:items-center mb-6 flex-col gap-y-2 md:justify-between">
      <div>
        <h1 class="text-base font-semibold">Detail Catatan Tablet Tambah Darah</h1>
        <p class="text-gray-600 font-normal text-sm">Riwayat Konsumsi Tablet Tambah Darah</p>
      </div>
      <div class="w-full md:w-auto flex justify-end">
        <div class="w-40 mt-6">
          <n-select
            :options="monthOptions"
            placeholder="Pilih Bulan"
            v-model:value="selectedMonth"
            @update:value="selectMonth"
            size="small"
          />
        </div>
      </div>
    </div>

    <!-- Summary Card -->
    <div v-if="summaryInfo" class="mb-4">
      <NCard class="shadow-sm rounded-lg bg-blue-50">
        <div class="flex flex-wrap gap-6">
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">Bulan</span>
            <span class="font-semibold text-blue-800">{{ summaryInfo.monthName }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">Total Konsumsi</span>
            <span class="font-semibold text-blue-800">{{ summaryInfo.totalConsume }} Tablet</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">Status</span>
            <span class="font-semibold" :class="summaryInfo.statusBlood === 'DONE' ? 'text-green-600' : 'text-orange-600'">
              {{ summaryInfo.statusBlood === 'DONE' ? 'Sudah Dilakukan' : 'Belum Dilakukan' }}
            </span>
          </div>
        </div>
      </NCard>
    </div>

    <NCard class="shadow-md rounded-lg">
      

      <div class="bg-white rounded-lg w-full">
        <div class="flex flex-col justify-between items-center mb-5 w-full">
          <div class="w-full overflow-x-auto">
            <div class="min-w-[1000px]">
              <!-- Tampilkan pesan kosong jika tidak ada data -->
              <div v-if="isDataEmpty" class="flex justify-center items-center py-20">
                <n-empty
                  description="Tidak ada data catatan untuk bulan yang dipilih"
                  class="text-gray-500"
                >
                  <template #icon>
                    <i-mdi:clipboard-text-outline class="text-4xl text-gray-400" />
                  </template>
                </n-empty>
              </div>

              <!-- Tampilkan tabel jika ada data -->
              <n-data-table
                v-else
                :columns="columns"
                :data="formattedMonitorData"
                class="min-w-max overflow-auto"
                style="margin-top: 28px"
                :row-key="(r) => r.id"
                :scroll-x="1000"
                :loading="loading"
                :pagination="false"
                :bordered="false"
              />
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Modal untuk create data -->
    <n-modal v-model:show="createData" :mask-closable="false">
      <CreateData 
        @close="closeCreateModal" 
        :selected-month="selectedMonth"
      />
    </n-modal>
  </div>
</template>