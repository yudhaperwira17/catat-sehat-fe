<script setup lang="tsx">
import CreateData from '@/components/modal/input-user/create-monitor-mom.vue'
import Expand from '@/components/mother/ExpandMom.vue'
import { useReadMonitorPregnancy, useReadWeeksPregnancy } from '@/services/user-monitor-pregnancy'
import { NButton, NCard, NDataTable, NEmpty, NModal, NSelect, type DataTableColumns } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const { data: days } = useReadWeeksPregnancy()
const selectedDay = ref<string>('')
const createData = ref(false)

watch(
  days,
  (newDays) => {
    if (newDays && newDays.length > 0 && !selectedDay.value) {
      selectedDay.value = newDays[0].id
    }
  },
  { immediate: true }
)

const monitorParams = computed(() => {
  return {
    weekPregnancyMonitoringId: selectedDay.value
  }
})

const { data: monitor, isLoading: loading, refetch } = useReadMonitorPregnancy(monitorParams)

// Watch selectedDay dan refetch ketika berubah
watch(selectedDay, async (newDay, oldDay) => {
  if (newDay && newDay !== oldDay) {
    await refetch()
  }
})

export interface Days {
  id: string
  weekNumber: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface PostPartumMonitor {
  id: string
  question1: boolean
  question2: boolean
  question3: boolean
  question4: boolean
  question5: boolean
  question6: boolean
  question7: boolean
  question8: boolean
  question9: boolean
  question10: boolean
  question11: boolean
  question12: boolean
  question13: boolean
  status: string
  motherId: string
  weekPregnancyMonitoringId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  mother: {
    id: string
    name: string
    dateOfBirth: string
    placeOfBirth: string
    address: string
    code: string
    userId: string
    subDistrictId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  weekPregnancyMonitoring: {
    id: string
    weekNumber: number
    name: string
    createdAt: string
    updatedAt: string
  }
}

const dayOptions = computed(() => {
  const options =
    days.value?.map((item: Days) => ({
      label: item.name,
      value: item.id
    })) || []

  return [{ label: 'Pilih Minggu', disabled: true, value: '' }, ...options]
})

const selectDay = (value: string) => {
  selectedDay.value = value
}

// Function untuk membuka modal
const openCreateModal = () => {
  createData.value = true
}

// Function untuk menutup modal
const closeCreateModal = () => {
  createData.value = false
}


const formattedMonitorData = computed(() => {
  // Handle jika monitor.value adalah null/undefined
  if (!monitor.value) {
    return []
  }

  // Handle jika monitor.value adalah array
  let dataArray = Array.isArray(monitor.value) ? monitor.value : [monitor.value]

  // Filter out null/undefined items
  dataArray = dataArray.filter((item) => item != null)

  if (!dataArray || dataArray.length === 0) {
    return []
  }

  const formatted = dataArray.map((item: any) => {
    return {
      id: item.id,
      motherName: item.mother?.name || 'N/A',
      dayName: item.weekPregnancyMonitoring?.name || 'N/A',
      status: item.status,
      createdAt: item.createdAt,
      fullData: item
    }
  })

  return formatted
})

const statusMapper: Record<string, { text: string; color: string }> = {
  HEALTHY: { text: 'Sehat', color: '#DEF7EF' },
  UNHEALTHY: { text: 'Segera Ke Faskes', color: '#FECACA' },
  PENDING: { text: 'Pending', color: '#FDF6B2' }
}

const columns: DataTableColumns = [
  {
    type: 'expand',
    renderExpand: (rowData: any) => {
      return <Expand monitorData={rowData.fullData} />
    }
  },
  {
    title: 'No',
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
    width: 60
  },
  {
    title: 'Nama Ibu',
    key: 'motherName',
    width: 300
  },
  {
    title: 'Hari Pemantauan',
    key: 'dayName',
    width: 150
  },
  {
    title: 'Status Kesehatan',
    key: 'status',
    render(row: any) {
      const statusInfo = statusMapper[row.status] || { text: row.status, color: '#E3E3E3' }
      return (
        <div
          style={{
            backgroundColor: statusInfo.color,
            color: 'black',
            padding: '8px 12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '500'
          }}
        >
          {statusInfo.text}
        </div>
      )
    },
    width: 150
  },
  {
    title: 'Tanggal Pemeriksaan',
    key: 'createdAt',
    render(row: any) {
      return new Date(row.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    width: 180
  }
]

// Computed untuk mengecek apakah data kosong
const isDataEmpty = computed(() => {
  return !loading.value && (!formattedMonitorData.value || formattedMonitorData.value.length === 0)
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex md:flex-row md:items-center mb-6 flex-col gap-y-2 md:justify-between">
      <div>
        <h1 class="text-base font-semibold">Pemantauan Ibu Hamil</h1>
        <p class="text-gray-600 font-normal text-sm">Lembar Pemantauan Ibu Hamil</p>
      </div>
      <div class="w-full md:w-auto flex justify-end">
        <div class="w-40 mt-6">
          <n-select
            :options="dayOptions"
            placeholder="Pilih Minggu"
            v-model:value="selectedDay"
            @update:value="selectDay"
            size="small"
            filterable
          />
        </div>
      </div>
    </div>

    <NCard class="shadow-md rounded-lg">
      <div class="flex justify-end mb-4">
        <n-button
          class="text-white rounded-md ml-2 flex items-center justify-end"
          size="small"
          type="primary"
          @click="openCreateModal"
        >
          <i-mdi:plus></i-mdi:plus> Tambah Pantauan
        </n-button>
      </div>

      <div class="bg-white rounded-lg w-full">
        <div class="flex flex-col justify-between items-center mb-5 w-full">
          <div class="w-full overflow-x-auto">
            <div class="min-w-[1000px]">
              <!-- Tampilkan pesan kosong jika tidak ada data -->
              <div v-if="isDataEmpty" class="flex justify-center items-center py-20">
                <n-empty
                  description="Tidak ada data pemantauan untuk hari yang dipilih"
                  class="text-gray-500"
                >
                  <template #icon>
                    <i-mdi:clipboard-text-outline class="text-4xl text-gray-400" />
                  </template>
                  <template #extra>
                    <n-button size="small" type="primary" @click="openCreateModal" class="mt-4">
                      <i-mdi:plus class="mr-1" />
                      Tambah Data Pemantauan
                    </n-button>
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
        :selected-day="selectedDay"
      />
    </n-modal>
  </div>
</template>