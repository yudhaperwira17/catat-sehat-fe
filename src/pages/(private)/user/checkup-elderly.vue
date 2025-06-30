<script setup lang="ts">
import { useCheckupList, type Daum } from '@/services/checkup-elderly'
import { DateTime } from 'luxon'
import { NButton, NDropdown, type DataTableColumns } from 'naive-ui'
import { computed, h, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
// import { useReadElderlyCheckup } from '@/services/checkup-elderly';

interface ApexChartContext {
  seriesIndex: number
  dataPointIndex: number
  w: any // ApexCharts types are complex, using any for now
}

const params = ref({ page: 1, limit: 5, search: '' })

const { data } = useCheckupList(params)

const columns: DataTableColumns<Daum> = [
  {
    title: 'Tanggal',
    key: 'createdAt',
    render(row) {
      return DateTime.fromISO(row.createdAt).toFormat('dd LLLL yyyy')
    }
  },
  { title: 'Tinggi Badan', key: 'height' },
  { title: 'Berat Badan', key: 'weight' },
  {
    title: 'Jenis Kelamin',
    key: 'elderly.gender',
    render: (row) => (row.elderly?.gender == 'MALE' ? 'Laki-laki' : 'Perempuan')
  },
  {
    title: 'Umur',
    key: 'age',
    render: (row) => {
      return DateTime.fromISO(row.elderly?.dateOfBirth || DateTime.now().toISO()).diffNow().years
    }
  },
  {
    title: 'IMT',
    key: 'bmi',
    render(row) {
      let bgColor = ''
      let textColor = ''

      switch (row.bmiStatus) {
        case 'NORMAL':
          bgColor = '#E8F5E9' // Light green background
          textColor = '#2E7D32' // Dark green text
          break
        case 'OBESITY':
          bgColor = '#FFF3E0' // Light yellow background
          textColor = '#E65100' // Dark orange text
          break
        case 'UNDERWEIGHT':
          bgColor = '#FFEBEE' // Light red background
          textColor = '#C62828' // Dark red text
          break
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
  // {
  //   title: 'Surat Rujukan',
  //   key: 'referralLetter',
  //   render(row) {
  //     return row.referralLetter !== '-'
  //       ? h(
  //           'a',
  //           {
  //             href: row.referralLetter,
  //             class: 'text-blue-500 underline',
  //             target: '_blank'
  //           },
  //           'suratrujukan.pdf'
  //         )
  //       : '-'
  //   }
  // },
  {
    title: 'Aksi',
    key: 'actions',
    width: 80,
    align: 'center',
    render(row) {
      return h(
        NDropdown,
        {
          onSelect(value) {
            if (value === 'detail') {
              showHistoryCheckup.value = true
              checkupDetail.value = row
            }
          },
          trigger: 'click',
          options: [
            {
              label: 'Detail',
              key: 'detail'
            }
          ]
        },
        () =>
          h(
            NButton,
            {
              text: true,
              style: {
                padding: '4px'
              }
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

// Add type for date range
// interface DateRange {
//   start?: number | null
//   end?: number | null
// }

// const dateRange = ref<DateRange>({
//   start: null,
//   end: null
// })

// const handleDateRangeChange = (dates: [number, number] | null) => {
//   if (dates) {
//     dateRange.value = {
//       start: dates[0],
//       end: dates[1]
//     }
//   }
// }

const options = computed(() => ({
  chart: {
    height: 300,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  series: [
    {
      name: 'IMT',
      data: data.value?.data.map((item) => ({
        x: new Date(item.createdAt).getTime(),
        y: item.bmi,
        status: item.bmiStatus
      }))
    }
  ],
  colors: ['#0F5BC0'],
  dataLabels: {
    enabled: true,
    formatter: function (val: number, context: ApexChartContext) {
      const status =
        context.w.config.series[context.seriesIndex].data[context.dataPointIndex].status

      return `${val} (${status})`
    }
  },
  markers: {
    size: 6,
    colors: undefined,
    strokeColors: '#fff',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    fillOpacity: 1,
    discrete: [],
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'dd MMM yyyy',
      style: {
        colors: '#64748b'
      }
    }
  },
  yaxis: {
    title: {
      text: 'IMT',
      style: {
        color: '#64748b'
      }
    },
    labels: {
      style: {
        colors: '#64748b'
      }
    }
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    },
    y: {
      formatter: function (val: number, context: ApexChartContext) {
        const status =
          context.w.config.series[context.seriesIndex].data[context.dataPointIndex].status
        return `IMT: ${val} (${status})`
      }
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  theme: {
    mode: 'light',
    palette: 'palette1',
    monochrome: {
      enabled: false,
      color: '#0F5BC0',
      shadeTo: 'light',
      shadeIntensity: 0.65
    }
  }
}))

const showHistoryCheckup = ref(false)
const checkupDetail = ref<Daum>()
</script>

<template>
  <n-modal
    v-model:show="showHistoryCheckup"
    preset="card"
    title="Riwayat Pemeriksaan"
    class="max-w-xl"
  >
    <div>
      <n-table>
        <tbody>
          <n-tr>
            <n-td>Tanggal</n-td>
            <n-td>
              {{ DateTime.fromISO(checkupDetail?.createdAt as string).toFormat('dd LLLL yyyy') }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td>IMT</n-td>
            <n-td>{{ checkupDetail?.bmi }} ({{ checkupDetail?.bmiStatus }})</n-td>
          </n-tr>
          <n-tr>
            <n-td>Berat Badan</n-td>
            <n-td>{{ checkupDetail?.weight }} kg</n-td>
          </n-tr>
          <n-tr>
            <n-td>Tinggi</n-td>
            <n-td>{{ checkupDetail?.height }} cm</n-td>
          </n-tr>
          <n-tr>
            <n-td>Jenis Kelamin</n-td>
            <n-td>
              {{ checkupDetail?.elderly?.gender }}
            </n-td>
          </n-tr>
          <n-tr>
            <n-td>Umur</n-td>
            <n-td
              >{{
                DateTime.fromISO(checkupDetail?.elderly?.dateOfBirth as string).diffNow().years || 0
              }}
              tahun</n-td
            >
          </n-tr>
        </tbody>
      </n-table>
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

    <div class="bg-white p-2 rounded-lg shadow mb-6">
      <div class="flex justify-between">
        <h2 class="text-lg font-semibold">Grafik Indeks Massa Tubuh</h2>

        <div class="relative inline-block text-center">
          <!-- <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            :clearable="false"
            start-placeholder="Tanggal Awal"
            end-placeholder="Tanggal Akhir"
            @update:value="handleDateRangeChange"
            class="w-72"
            style="--n-border: #0f5bc0; --n-text-color: #0f5bc0"
          /> -->
        </div>
      </div>

      <div class="h-full w-full bg-white rounded-lg dark:bg-white p-4">
        <VueApexCharts id="bmi-chart" type="line" :options="options" :series="options.series" />
      </div>
    </div>

    <div class="rounded-lg mb-6">
      <div class="flex justify-between mb-6">
        <h2 class="text-lg font-semibold">Riwayat Pemeriksaan</h2>
      </div>

      <div class="hidden md:block">
        <n-data-table :columns="columns" :data="data?.data" :pagination="false" />
      </div>
    </div>
    <!-- Pagination -->
    <div class="mt-2 flex justify-center">
      <n-pagination
        v-model:page="params.page"
        :page-size="params.limit"
        :item-count="data?.meta.totalData"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.n-data-table) .n-data-table-wrapper .n-data-table-bottom {
  justify-content: center !important;
}

:deep(.n-data-table-pagination) {
  margin: 0 auto;
}

:deep(.n-data-table-thead) {
  background-color: #a6c9f5 !important;
}

:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
}

.elderly-table :deep(.n-data-table-bottom) {
  display: flex;
  justify-content: center;
}

:deep(.n-data-table) {
  position: relative;
  padding-bottom: 5px;
}

:deep(.n-data-table-wrapper) {
  .n-data-table-bottom {
    justify-content: center !important;
  }
}

:deep(.n-data-table-pagination) {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
}

:deep(.n-data-table-bottom) {
  display: flex;
  justify-content: center !important;
  flex-direction: column;
  align-items: center;
}

:deep(.n-date-picker) {
  background-color: white;
}

:deep(.n-date-picker .n-input) {
  --n-border: #0f5bc0 !important;
  --n-border-hover: #0f5bc0 !important;
  --n-border-focus: #0f5bc0 !important;
  --n-text-color: #0f5bc0 !important;
  --n-placeholder-color: #0f5bc0 !important;
  border: 1px solid #0f5bc0 !important;
  border-radius: 6px;
}

:deep(.n-date-picker .n-input__input-el) {
  color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-input__placeholder) {
  color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-input__border) {
  border-color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-input-wrapper) {
  border-color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-input.n-input--focused) {
  border: 2px solid #0f5bc0 !important;
}

:deep(.n-date-picker .n-input:hover) {
  border: 1px solid #0f5bc0 !important;
}

:deep(.n-date-picker .n-input__suffix) {
  color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-input__suffix svg) {
  fill: #0f5bc0 !important;
  color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-base-icon) {
  color: #0f5bc0 !important;
}

:deep(.n-date-picker .n-base-icon svg) {
  fill: #0f5bc0 !important;
  color: #0f5bc0 !important;
}

:deep(.n-date-picker-icon) {
  color: #0f5bc0 !important;
}

:deep(.n-button) {
  --n-text-color: #0f5bc0;
  --n-border: #0f5bc0;
  --n-border-hover: #0f5bc0;
  --n-border-focus: #0f5bc0;
  --n-border-active: #0f5bc0;
  --n-color: transparent;
}

:deep(
  .n-date-panel
    .n-date-panel-calendar
    .n-date-panel-month-calendar
    .n-date-panel-cell.n-date-panel-cell--selected
) {
  background-color: #0f5bc0;
}

:deep(.n-button.n-button--quaternary) {
  color: #666;
}

:deep(.n-button.n-button--quaternary:hover) {
  color: #333;
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
