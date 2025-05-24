<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { NDropdown, NButton, NIcon, DataTableColumns } from 'naive-ui';
// import ApexCharts from 'apexcharts';
// import { useReadElderlyCheckup } from '@/services/checkup-elderly';

interface ApexChartContext {
  seriesIndex: number;
  dataPointIndex: number;
  w: any; // ApexCharts types are complex, using any for now
}

interface Checkup {
  id: string;
  date: string;
  height: number;
  weight: number;
  gender: string;
  age: number;
  bmi: string;
  bmiStatus: string;
  referralLetter?: string;
}
const checkupData = ref<{ data: Checkup[] }>({
  data: [
    {
      id: '1',
      date: '2025-05-01',
      height: 160,
      weight: 60,
      gender: 'Perempuan',
      age: 68,
      bmi: '23.4',
      bmiStatus: 'Normal',
      referralLetter: 'https://example.com/suratrujukan.pdf'
    },
    {
      id: '2',
      date: '2025-05-05',
      height: 155,
      weight: 45,
      gender: 'Laki-laki',
      age: 70,
      bmi: '18.5',
      bmiStatus: 'Stunting'
    },
    {
      id: '2',
      date: '2025-05-05',
      height: 155,
      weight: 45,
      gender: 'Laki-laki',
      age: 70,
      bmi: '18.5',
      bmiStatus: 'Stunting'
    },
    {
      id: '2',
      date: '2025-05-05',
      height: 155,
      weight: 45,
      gender: 'Laki-laki',
      age: 70,
      bmi: '18.5',
      bmiStatus: 'Stunting'
    },
    {
      id: '2',
      date: '2025-05-05',
      height: 155,
      weight: 45,
      gender: 'Laki-laki',
      age: 70,
      bmi: '18.5',
      bmiStatus: 'Stunting'
    }
  ]
});

const page = ref(1);
const pageSize = 5;

const itemsCheckup = computed(() => {
  return checkupData.value.data.map((checkup: Checkup) => ({
    id: checkup.id,
    date: checkup.date,
    height: `${checkup.height} cm`,
    weight: `${checkup.weight} kg`,
    gender: checkup.gender,
    age: `${checkup.age} Tahun`,
    bmi: `${checkup.bmi} ${checkup.bmiStatus}`,
    referralLetter: checkup.referralLetter || '-'
  }));
});

const paginatedItemsCheckup = computed(() => {
  const start = (page.value - 1) * pageSize;
  const end = start + pageSize;
  return itemsCheckup.value.slice(start, end);
});

// Define pagination and data
const pagination = {
  page: 1,
  pageSize: 5,
  itemCount: 0
};

interface TableRow {
  id: string;
  date: string;
  height: string;
  weight: string;
  gender: string;
  age: string;
  bmi: string;
  referralLetter: string;
}

const columns: DataTableColumns<TableRow> = [
  { title: 'Tanggal', key: 'date' },
  { title: 'Tinggi Badan', key: 'height' },
  { title: 'Berat Badan', key: 'weight' },
  { title: 'Jenis Kelamin', key: 'gender' },
  { title: 'Umur', key: 'age' },
  {
    title: 'IMT',
    key: 'bmi',
    render(row) {
      const [value, status] = row.bmi.split(' ');
      let bgColor = '';
      let textColor = '';

      switch (status) {
        case 'Normal':
          bgColor = '#E8F5E9';  // Light green background
          textColor = '#2E7D32'; // Dark green text
          break;
        case 'Obesitas':
          bgColor = '#FFF3E0';  // Light yellow background
          textColor = '#E65100'; // Dark orange text
          break;
        case 'Stunting':
          bgColor = '#FFEBEE';  // Light red background
          textColor = '#C62828'; // Dark red text
          break;
      }

      return h('div', {
        style: {
          backgroundColor: bgColor,
          color: textColor,
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
          fontSize: '14px',
          fontWeight: '500'
        }
      }, `${value} ${status}`);
    }
  },
  {
    title: 'Surat Rujukan',
    key: 'referralLetter',
    render(row) {
      return row.referralLetter !== '-' 
        ? h('a', {
            href: row.referralLetter,
            class: 'text-blue-500 underline',
            target: '_blank'
          }, 'suratrujukan.pdf') 
        : '-';
    }
  },
  {
    title: 'Aksi',
    key: 'actions',
    width: 80,
    align: 'center',
    render(row: TableRow) {
      return h(
        NDropdown,
        {
          trigger: 'click',
          options: [
            {
              label: 'Detail',
              key: 'detail'
            }
          ]
        },
        () => h(
          NButton,
          {
            text: true,
            style: {
              padding: '4px'
            }
          },
          () => h(
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
      );
    }
  }
];

// Add type for date range
interface DateRange {
  start: number | null;
  end: number | null;
}

const dateRange = ref<DateRange>({
  start: null,
  end: null
});

const handleDateRangeChange = (dates: [number, number] | null) => {
  if (dates) {
    dateRange.value = {
      start: dates[0],
      end: dates[1]
    };
  }
};

const options = {
  chart: {
    height: 300,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  series: [{
    name: 'IMT',
    data: computed(() => checkupData.value.data.map(item => ({
      x: new Date(item.date).getTime(),
      y: parseFloat(item.bmi),
      status: item.bmiStatus
    })))
  }],
  colors: ['#0F5BC0'],
  dataLabels: {
    enabled: true,
    formatter: function(val: number, context: ApexChartContext) {
      const status = context.w.config.series[context.seriesIndex].data[context.dataPointIndex].status;
      return `${val} (${status})`;
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
    shape: "circle",
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
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
      formatter: function(val: number, context: ApexChartContext) {
        const status = context.w.config.series[context.seriesIndex].data[context.dataPointIndex].status;
        return `IMT: ${val} (${status})`;
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
};

// Update the onMounted hook
onMounted(() => {
  const chartContainer = document.getElementById('bmi-chart');
  // @ts-ignore - Ignoring ApexCharts type check since it's loaded globally
  if (chartContainer && typeof window.ApexCharts !== 'undefined') {
    // @ts-ignore
    const chart = new window.ApexCharts(chartContainer, options);
    chart.render();

    // Add point colors based on BMI status
    chart.updateOptions({
      markers: {
        colors: checkupData.value.data.map(item => {
          switch (item.bmiStatus) {
            case 'Obesitas':
              return '#EAB308'; // yellow-500
            case 'Stunting':
              return '#EF4444'; // red-500
            case 'Normal':
              return '#22C55E'; // green-500
            default:
              return '#0F5BC0'; // default blue
          }
        })
      }
    });
  }
});
</script>

<template>
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
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            :clearable="false"
            start-placeholder="Tanggal Awal"
            end-placeholder="Tanggal Akhir"
            @update:value="handleDateRangeChange"
            class="w-72"
            style="--n-border: #0F5BC0; --n-text-color: #0F5BC0;"
          />
        </div>
      </div>

      <div class="h-full w-full bg-white rounded-lg dark:bg-white p-4">
        <div class="flex justify-between mb-4">
        </div>
        <div id="bmi-chart" class="h-[300px]"></div>
      </div>
    </div>

    <div class="rounded-lg mb-6">
      <div class="flex justify-between mb-6">
        <h2 class="text-lg font-semibold">Riwayat Pemeriksaan</h2>
      </div>

      <div class="hidden md:block">
        <n-data-table
          :columns="columns"
          :data="paginatedItemsCheckup"
          :pagination="false"
        />
      </div>
    </div>
    <!-- Pagination -->
    <div class="mt-2 flex justify-center">
      <n-pagination
        v-model:page="page"
        :page-size="pageSize"
        :item-count="itemsCheckup.length"
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
  background-color: #A6C9F5 !important;
}

:deep(.n-data-table-th) {
  background-color: #A6C9F5 !important;
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
  --n-border: #0F5BC0 !important;
  --n-border-hover: #0F5BC0 !important;
  --n-border-focus: #0F5BC0 !important;
  --n-text-color: #0F5BC0 !important;
  --n-placeholder-color: #0F5BC0 !important;
  border: 1px solid #0F5BC0 !important;
  border-radius: 6px;
}

:deep(.n-date-picker .n-input__input-el) {
  color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-input__placeholder) {
  color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-input__border) {
  border-color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-input-wrapper) {
  border-color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-input.n-input--focused) {
  border: 2px solid #0F5BC0 !important;
}

:deep(.n-date-picker .n-input:hover) {
  border: 1px solid #0F5BC0 !important;
}

:deep(.n-date-picker .n-input__suffix) {
  color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-input__suffix svg) {
  fill: #0F5BC0 !important;
  color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-base-icon) {
  color: #0F5BC0 !important;
}

:deep(.n-date-picker .n-base-icon svg) {
  fill: #0F5BC0 !important;
  color: #0F5BC0 !important;
}

:deep(.n-date-picker-icon) {
  color: #0F5BC0 !important;
}

:deep(.n-button) {
  --n-text-color: #0F5BC0;
  --n-border: #0F5BC0;
  --n-border-hover: #0F5BC0;
  --n-border-focus: #0F5BC0;
  --n-border-active: #0F5BC0;
  --n-color: transparent;
}

:deep(.n-date-panel .n-date-panel-calendar .n-date-panel-month-calendar .n-date-panel-cell.n-date-panel-cell--selected) {
  background-color: #0F5BC0;
}

:deep(.n-button.n-button--quaternary) {
  color: #666;
}

:deep(.n-button.n-button--quaternary:hover) {
  color: #333;
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
