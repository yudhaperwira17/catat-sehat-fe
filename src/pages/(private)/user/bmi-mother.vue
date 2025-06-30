<script setup lang="tsx">
import DetailKesehatanIbu from '@/components/componen-user/detail-kesehatan-ibu.vue'
import {
  useReadParentsCheckup,
  useReadParentsCheckupGraphic,
  type DataCheckup
} from '@/services/checkup-parents'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'

const pagination = ref({
  page: 1,
  pageSize: 6,
  itemCount: 0,
  search: ''
})

const range = ref<[number, number]>([DateTime.now().minus({ month: 1 }).toMillis(), Date.now()])

const params = computed(() => {
  return {
    startDate: DateTime.fromMillis(range.value[0]).toISO() || undefined,
    endDate: DateTime.fromMillis(range.value[1]).toISO() || undefined,
    page: pagination.value.page,
    limit: pagination.value.pageSize,
    search: pagination.value.search
  }
})

const { data: graphic } = useReadParentsCheckupGraphic(params)

const { data: checkupData, isLoading, refetch } = useReadParentsCheckup(
  computed(() => {
    return {
      page: pagination.value.page,
      limit: pagination.value.pageSize
    }
  })
)

const itemsCheckup = computed(() => {
  return checkupData.value?.data.map((checkup) => {
    return {
      id: checkup.id,
      date: checkup.createdAt,
      height: checkup.height,
      weight: checkup.weight,
      bmi: Math.round(checkup.bmi),
      bmiStatus: checkup.bmiStatus,
      healthPost: checkup.healthPost,
      upperArmCircumference: checkup.upperArmCircumference,
      fundusMeasurement: checkup.fundusMeasurement,
      createdAt: checkup.createdAt ? new Date(checkup.createdAt).toLocaleDateString('id-ID') : '',

      option:
        checkup.type === 'USER'
          ? 'Mandiri'
          : checkup.type === 'ADMIN'
            ? 'Posyandu'
            : 'Tidak Diketahui',
      fileDiagnosed: checkup.fileDiagnosed?.path
    }
  })
})

const bmiCategoryMapper: Record<string, string> = {
  MALNUTRITION: 'Malnutrisi',
  UNDERNUTRITION: 'Kurang Gizi',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Kelebihan Berat Badan',
  OBESITY: 'Obesitas'
}



const columns = [
  {
    title: 'Tanggal',
    key: 'date',
    render(row: any) {
      return DateTime.fromISO(row.date).toFormat('dd LLLL yyyy')
    }
  },
  {
    title: 'Tinggi Badan (cm)',
    key: 'height',
    render: (row: DataCheckup) => {
      return <div class="w-full text-center">{row.height}</div>
    }
  },
  {
    title: 'Berat Badan (kg)',
    key: 'weight',
    render: (row: DataCheckup) => {
      return <div class="w-full text-center">{row.weight}</div>
    }
  },
  {
    title: 'Fundus Uteri (cm)',
    key: 'fundusMeasurement',
    render: (row: DataCheckup) => {
      return <div class="w-full text-center">{row.fundusMeasurement}</div>
    }
  },
  {
    title: 'Lingkar Lengan (cm)',
    key: 'upperArmCircumference',
    render: (row: DataCheckup) => {
      return <div class="w-full text-center">{row.upperArmCircumference}</div>
    }
  },
  {
    title: 'BMI Ibu',
    key: 'bmi',
    render(row: DataCheckup) {
      const bmiCategory = row.bmiStatus
      const bmiDisplay = `${row.bmi} ${bmiCategoryMapper[bmiCategory] || 'Tidak Diketahui'}`
      const color = {
        MALNUTRION: '#F87171',
        UNDERNUTRITION: '#F87171',
        NORMAL: '#34D399',
        OVERWEIGHT: '#FBBF24',
        OBESITY: '#FBBF24'
      }

      return (
        <div
          style={{
            backgroundColor: color[bmiCategory as keyof typeof color] || 'gray',
            color: 'black',
            padding: '5px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          {bmiDisplay}
        </div>
      )
    }
  },
  {
    title: 'Surat Rujukan',
    key: 'fileDiagnosed',
    render(row: { fileDiagnosed: string }) {
      return row.fileDiagnosed ? (
        <a
          class="z-50 text-blue-500 hover:underline"
          href={row.fileDiagnosed}
          target="_blank"
          rel="noopener noreferrer"
          title="Unduh Surat Rujukan"
        >
          Surat Rujukan
        </a>
      ) : (
        <span class="text-gray-500">Tidak Ada File</span>
      )
    }
  },
  {
    title: 'Pemeriksaan',
    key: 'option',
    render(row: DataCheckup & { option: string }) {
      return <div class="w-full text-center">{row.option}</div>
    }
  },
  {
    title: 'Aksi ',
    key: 'action',
    render(row: DataCheckup) {
      return h(
        DetailKesehatanIbu,
        {
          size: 'small',
          id: row.id,
          onRefetch: () => refetch(),
          onClick: () => console.log(row)
        },
        { default: () => 'Lihat Detail' }
      )
    }
  }
]

const options = computed(() => {
  return {
    chart: {
      height: '100%',
      maxWidth: '100%',
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      dropShadow: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        format: 'dd MMM yyyy'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: '#1C64F2',
        gradientToColors: ['#1C64F2']
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 6
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      }
    },
    annotations: {
      yaxis: [
        {
          y: 18.4,
          borderColor: '#3B82F6',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Kurang Gizi (18.4)'
          }
        },
        {
          y: 18.5,
          borderColor: '#10B981',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Normal Min (18.5)'
          }
        },
        {
          y: 24.9,
          borderColor: '#10B981',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Normal Max (24.9)'
          }
        },
        {
          y: 25,
          borderColor: '#F59E0B',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F59E0B',
            style: {
              color: '#fff',
              background: '#F59E0B',
              fontSize: '12px'
            },
            text: 'Kelebihan Berat (25)'
          }
        },
        {
          y: 30,
          borderColor: '#EF4444',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Obesitas (30)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI',
        data: graphic.value?.map((checkup) => checkup.bmi),
        color: '#1C64F2'
      }
    ],
    xaxis: {
      categories: graphic.value?.map(
        (checkup) => DateTime.fromISO(checkup.day).toFormat('dd LLL') || 0
      ),
      labels: {
        show: true
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: true,
      min: 15, // Set minimum untuk memastikan semua garis terlihat
      max: 35, // Set maximum yang reasonable
      title: {
        text: 'BMI Value',
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    }
  }
})

const router = useRouter()

watchEffect(() => {
  if (range.value[0] && range.value[1]) {
    router.push({
      path: '/user/bmi-mother',
      query: {
        start: DateTime.fromMillis(range.value[0]).toISO(),
        end: DateTime.fromMillis(range.value[1]).toISO()
      }
    })
  }
})

const search = ref('')
const onSearch = () => {
  params.value.search = search.value
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow overflow-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <div>
          <n-breadcrumb separator=">" class="mb-2">
            <div class="flex items-center space-x-1">
              <i-material-symbols:home class="text-lg"></i-material-symbols:home>
              <n-breadcrumb-item href="dashboard">Dashboard</n-breadcrumb-item>
              <n-breadcrumb-item>Kesehatan Ibu</n-breadcrumb-item>
            </div>
          </n-breadcrumb>
        </div>
        <h1 class="text-2xl font-semibold">Kesehatan Ibu</h1>
      </div>
    </div>
    <div class="bg-white p-2 rounded-lg shadow mb-6">
      <div class="flex justify-between">
        <h2 class="text-lg font-semibold">Grafik BMI Ibu</h2>
        <div class="relative inline-block text-left">
          <div class="relative inline-block text-left mb-2">
            <n-date-picker v-model:value="range" type="daterange" clearable />
          </div>
        </div>
      </div>

      <div class="h-1/4 w-full bg-white rounded-lg dark:bg-white p-4">
        <VueApexCharts
          class="h-1/4"
          type="line"
          :height="298"
          :options="options"
          :series="options?.series"
        />

        <div
          class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"
        ></div>
      </div>
    </div>
    <div class="flex flex-col bg-white rounded-lg overflow-auto">
      <div
        class="flex flex-col md:flex-row w-full justify-between mb-6 space-y-4 md:items-center md:space-y-0"
      >
        <h2 class="text-lg font-semibold">Riwayat Perkembangan</h2>
        <div class="flex items-center">
          <div class="flex flex-row flex-grow gap-2">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-12 p-2 flex-grow"
              placeholder="Search"
              type="text"
              size="small"
              @keydown.enter="onSearch"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
          </div>
          <n-button
            class="text-white h-12 w-12 rounded-lg ml-2 flex items-center justify-center"
            @click="onSearch"
            type="primary"
          >
            <i-material-symbols:search></i-material-symbols:search>
          </n-button>
        </div>
      </div>
      <div class="overflow-auto min-w-max">
        <n-data-table
          pagination-behavior-on-filter="first"
          :columns="columns"
          :data="itemsCheckup"
          :loading="isLoading"
        />
        <n-pagination
          v-model:page="pagination.page"
          :page-count="checkupData?.meta?.totalPage"
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your styles here */
</style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
