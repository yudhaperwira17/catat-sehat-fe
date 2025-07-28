<script setup lang="tsx">
import Expand from '@/components/mother/ExpandBloodMom.vue'
import { useReadMonthsBlood, userMonitorBlood } from '@/services/user-blood-record'
import { NCard, NDataTable, NSelect, type DataTableColumns } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const { data: months } = useReadMonthsBlood()
const selectedMonth = ref<string>('')

const monitorParams = computed(() => {
  return {
    monthId: selectedMonth.value
  }
})

const { data: monitor, isLoading: loading, refetch } = userMonitorBlood(monitorParams)

watch([selectedMonth], async ([newMonth], [oldMonth]) => {
  if (newMonth && newMonth !== oldMonth) {
    await refetch()
  }
})

export interface MonthBlood {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface BloodMonitorData {
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
    healthPostId: string
  }
}

export interface BloodMonitorMonth {
  monthName: string
  totalConsume: number
  statusBlood: string
  data: BloodMonitorData[]
}

const monthOptions = computed(() => {
  const options =
    months.value?.map((item: MonthBlood) => ({
      label: item.name,
      value: item.id
    })) || []

  return [{ label: 'Pilih Bulan', disabled: true, value: '' }, ...options]
})

const selectMonth = (value: string) => {
  selectedMonth.value = value
}

const formattedMonitorData = computed(() => {
  const raw = monitor.value

  if (!Array.isArray(raw)) {
    return []
  }

  const mapped = raw.map((item) => ({
    id: item.monthName + '_' + item.totalConsume,
    monthName: item.monthName,
    totalConsume: item.totalConsume,
    statusBlood: item.statusBlood,
    data: item.data
  }))

  return mapped
})



const statusMapper: Record<string, { text: string; color: string }> = {
  DONE: { text: 'Sudah Dilakukan', color: '#DEF7EF' },
  PENDING: { text: 'Belum Dilakukan', color: '#FDF6B2' },
}

const columns: DataTableColumns = [
  {
    type: 'expand',
    renderExpand: (rowData: any) => {
      return <Expand bloodData={rowData.data} monthName={rowData.monthName} />
    }
  },
  {
    title: 'Nama Bulan',
    key: 'monthName',
    width: 200
  },
  {
    title: 'Total Konsumsi',
    key: 'totalConsume',
    width: 150,
    render(row: any) {
      return (
        <div style={{ textAlign: 'center', fontWeight: '500' }}>
          {row.totalConsume}
        </div>
      )
    }
  },
  {
    title: 'Status',
    key: 'statusBlood',
    render(row: any) {
      const statusInfo = statusMapper[row.statusBlood] || { text: row.statusBlood, color: '#E3E3E3' }
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
  }
]

const isDataEmpty = computed(() => {
  return !loading.value && (!formattedMonitorData.value || formattedMonitorData.value.length === 0)
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex md:flex-row md:items-center mb-6 flex-col gap-y-2 md:justify-between">
      <div>
        <h1 class="text-base font-semibold">Pemantauan Konsumsi Tablet Darah</h1>
        <p class="text-gray-600 font-normal text-sm">Lembar Pemantauan Konsumsi Tablet Darah Ibu Hamil</p>
      </div>
      <div class="w-full md:w-auto flex gap-3 justify-end">
        <div class="w-40 mt-6">
          <n-select
            :options="monthOptions"
            placeholder="Pilih Bulan"
            v-model:value="selectedMonth"
            @update:value="selectMonth"
            size="small"
            :clearable="true"
            filterable
          />
        </div>
      </div>
    </div>
    <NCard class="shadow-md rounded-lg">
      <div class="bg-white rounded-lg w-full">
        <div class="flex flex-col justify-between items-center mb-5 w-full">
          <div class="w-full overflow-x-auto">
            <div class="min-w-[1000px]">
              <div v-if="isDataEmpty" class="flex justify-center items-center py-20">
                <n-empty
                  description="Tidak ada data pemantauan untuk bulan yang dipilih"
                  class="text-gray-500"
                >
                  <template #icon>
                    <i-mdi:clipboard-text-outline class="text-4xl text-gray-400" />
                  </template>
                </n-empty>
              </div>
              <n-data-table
                v-else
                :columns="columns"
                :data="formattedMonitorData"
                class="min-w-max overflow-auto"
                style="margin-top: 28px"
                :row-key="(r) => r.id"
                :scroll-x="800"
                :loading="loading"
                :pagination="false"
                :bordered="false"
              />
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>