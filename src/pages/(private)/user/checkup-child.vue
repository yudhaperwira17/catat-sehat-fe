<script setup lang="tsx">
import DetailKesehatanAnak from '@/components/componen-user/detail-kesehatan-anak.vue'
import { API } from '@/composable/http/api-constant'
import { http } from '@/composable/http/http'
import { BMI_RANGES } from '@/composable/http/utils'
import { useReadChildCheckup, useReadChildCheckupGraphic } from '@/services/checkup-children'
import { useReadChild } from '@/services/child'
import { DateTime } from 'luxon'
import { NButton, useMessage } from 'naive-ui'
import { computed, h, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'

const isExporting = ref(false)
const message = useMessage()

const handleExport = async () => {
  if (!selectedChild.value) {
    message.warning('Silakan pilih anak terlebih dahulu.')
    return
  }

  try {
    isExporting.value = true
    const params = new URLSearchParams({ childrenId: selectedChild.value }).toString()
    const fullUrl = `${API.USER_GET_EXPORT_CHILD}?${params}`

    const response = await http.get(fullUrl, {
      responseType: 'blob',
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })

    if (response.data && response.data.size > 0) {
      const blobUrl = window.URL.createObjectURL(response.data)

      // Ambil nama file dari header jika ada
      const contentDisposition = response.headers['content-disposition']
      let filename = 'export_bmianak.xlsx'
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (match) {
          filename = match[1].replace(/['"]/g, '')
        }
      }

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(blobUrl)
      message.success('Export berhasil!')
    } else {
      message.warning('File kosong atau tidak ada data.')
    }
  } catch (error) {
    console.error(error)
    message.error('Gagal melakukan export.')
  } finally {
    isExporting.value = false
  }
}

// Konfigurasi pagination
const pagination = ref({
  page: 1,
  pageSize: 6,
  itemCount: 0
})

// Mengelola state dropdown
const selectedChild = ref<string>()
const { data: checkupData, isLoading } = useReadChildCheckup(
  computed(() => {
    return {
      childId: selectedChild.value,
      page: pagination.value.page,
      limit: pagination.value.pageSize
    }
  })
)

const showDetail = ref(false) // Reactive state for toggling

const range = ref<[number, number]>([DateTime.now().minus({ month: 1 }).toMillis(), Date.now()])

const params = computed(() => {
  return {
    startDate: DateTime.fromMillis(range.value[0]).toISO() || undefined,
    endDate: DateTime.fromMillis(range.value[1]).toISO() || undefined,
    childId: selectedChild.value,
    page: pagination.value.page,
    limit: pagination.value.pageSize
  }
})
const { data: graphic } = useReadChildCheckupGraphic(params)

interface CheckupItem {
  id: string
  date: string
  height: number
  weight: number
  bmi: number
  headCircumference: number
  childName: string
  bmiStatus: string
  fileDiagnosed?: string
}

const itemsCheckup = computed<CheckupItem[]>(() => {
  return (
    checkupData.value?.data?.map((checkup) => {
      return {
        id: checkup.id,
        date: checkup.createdAt || 'Tanggal tidak tersedia',
        height: checkup.height,
        weight: checkup.weight,
        bmi: Math.round(checkup.bmi),
        headCircumference: checkup.headCircumference,
        childName: checkup.children?.name || '-',
        bmiStatus: checkup.bmiStatus,
        fileDiagnosed: checkup.fileDiagnosed?.path
      }
    }) || []
  )
})

const { data: childrenData, error } = useReadChild()

// cara menampilkan data string
const childrenOptions = computed(() => {
  const options =
    childrenData.value?.data?.map((item) => {
      return { label: item.name, value: item.id }
    }) || []

  // Sisipkan opsi placeholder di awal daftar
  return [{ label: 'Pilih Anak', disabled: true, selectedOption: '', value: undefined }, ...options]
})

const childrenFilter = ref<string>()
const genderValue = ref<string>()
const ageValue = ref<number>()

const selectChildren = (value: string) => {
  childrenFilter.value = childrenData.value?.data?.find((item) => item.id === value)?.name
}

const bmiCategoryMapper: Record<string, string> = {
  MALNUTRITION: 'Malnutrisi',
  UNDERNUTRITION: 'Kurang Gizi',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Kelebihan Berat Badan',
  OBESITY: 'Obesitas'
}
// Kolom untuk NDataTable
const columns = [
  {
    title: 'Nama',
    key: 'age',
    render: (row: CheckupItem) => {
      return <div class="w-full text-center">{row.childName}</div>
    }
  },
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
    render: (row: CheckupItem) => {
      return <div class="w-full text-center">{row.height}</div>
    }
  },
  {
    title: 'Berat Badan (kg)',
    key: 'weight',
    render: (row: CheckupItem) => {
      return <div class="w-full text-center">{row.weight}</div>
    }
  },
  {
    title: 'Lingkar Kepala (cm)',
    key: 'headCircumference',
    render: (row: CheckupItem) => {
      return <div class="w-full text-center">{row.headCircumference}</div>
    }
  },
  {
    title: 'BMI Anak',
    key: 'bmi',
    render(row: CheckupItem) {
      // Ambil kategori langsung dari backend
      const bmiCategory = row.bmiStatus
      const bmiDisplay = `${row.bmi} ${bmiCategoryMapper[bmiCategory] || 'Tidak Diketahui'}`
      const color = {
        MALNUTRION: '#F87171', // Merah
        UNDERNUTRITION: '#F87171', // Merah
        NORMAL: '#34D399', // Hijau
        OVERWEIGHT: '#FBBF24', // Kuning
        OBESITY: '#FBBF24' // Kuning
      }

      return (
        <div
          style={{
            backgroundColor: color[bmiCategory as keyof typeof color] || 'gray', // Warna default jika kategori tidak ditemukan
            color: 'black', // Warna teks untuk kontras
            padding: '5px',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          {bmiDisplay} {/* Tampilkan angka BMI dan kategori */}
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
    render(row: CheckupItem & { option: string }) {
      return <div class="w-full text-center">{row.option}</div>
    }
  },
  {
    title: 'Aksi',
    key: 'action',
    render(row: CheckupItem) {
      return h(
        DetailKesehatanAnak,
        {
          type: 'primary',
          size: 'small',
          id: row.id,
          onClose: () => {
            showDetail.value = false
          },
          onClick: () => console.log(row) // Panggil modal saat tombol diklik
        },
        { default: () => 'Lihat Detail' }
      )
    }
  }
]

const series = [
  {
    name: 'BMI Anak',
    data: [
      { x: '2023-07-01', y: 18.5 },
      { x: '2023-07-08', y: 19.2 },
      { x: '2023-07-15', y: 20.4 }
      // Tambahkan data lain di sini
    ]
  }
]

const annotationsY = computed(() => {
  const gender = genderValue.value
  const age = ageValue.value

  if (!gender || !BMI_RANGES[gender] || age === undefined) return []

  const matched = BMI_RANGES[gender].find((range) => age >= range.min && age <= range.max)
  if (!matched) return []

  return matched.ranges.map((range) => ({
    y: range.max,
    borderColor: '#E5E7EB',
    strokeDashArray: 4,
    label: {
      borderColor: '#E5E7EB',
      style: {
        color: '#000',
        background: '#F3F4F6',
        fontSize: '12px'
      },
      text: range.status // atau pakai mapper string
    }
  }))
})

// Opsi untuk ApexCharts
const options = computed(() => {
  const bmiData = (graphic.value ?? []).map((checkup) => checkup.bmi)
  const dateLabels = (graphic.value ?? []).map((checkup) =>
    DateTime.fromISO(checkup.day).toFormat('dd LLL')
  )

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
      yaxis: annotationsY.value ?? []
    },
    series: [
      {
        name: 'BMI Anak',
        data: bmiData
      }
    ],
    xaxis: {
      categories: dateLabels,
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
      show: true
    }
  }
})

onMounted(() => {
  const chartContainer = document.getElementById('area-chart')
  if (chartContainer && graphic.value) {
    const chart = new ApexCharts(chartContainer, options.value)
    chart.render()
  }
})

const router = useRouter()

watchEffect(() => {
  if (range.value[0] && range.value[1]) {
    router.push({
      path: '/user/checkup-child',
      query: {
        start: DateTime.fromMillis(range.value[0]).toISO(),
        end: DateTime.fromMillis(range.value[1]).toISO()
      }
    })
  }
})

// Render chart setelah komponen dimount
onMounted(() => {
  // Logic untuk chart
  const chartContainer = document.getElementById('area-chart')
  if (chartContainer) {
    const chart = new ApexCharts(chartContainer, options)
    chart.render()
  }

  // Logic untuk checkupData dan childData
  if (checkupData.value) {
    console.log('Checkup Data:', checkupData.value)
    // Lakukan pemrosesan atau penugasan checkupData sesuai kebutuhan
  }

  if (checkupData.value) {
    console.log('Child Data:', checkupData.value)
    // Lakukan pemrosesan atau penugasan childData sesuai kebutuhan
  }

  if (error.value) {
    console.error('Error fetching child data:', error.value)
  }
})

function getBackgroundColor(bmi: number): string {
  if (bmi < 18.5) {
    return '#F87171' // Warna merah untuk kategori 'Stunting'
  } else if (bmi < 25) {
    return '#34D399' // Warna hijau untuk kategori 'Normal'
  } else {
    return '#FBBF24' // Warna kuning untuk kategori 'Obesitas'
  }
}

watchEffect(() => {
  const selected = childrenData.value?.data?.find((child) => child.id === selectedChild.value)
  if (selected) {
    genderValue.value = selected.gender
    ageValue.value = selected.age
  }
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow overflow-auto">
    <!-- <div class="hidden md:flex justify-between items-center mb-6"></div> -->
    <div class="flex flex-wrap justify-between items-center mb-6">
      <div class="flex flex-col justify-between w-full md:w-2/3">
        <!-- Bagian Kiri: Tulisan Dashboard -->
        <div>
          <n-breadcrumb separator=">" class="mb-2">
            <div class="flex items-center space-x-1">
              <i-material-symbols:home class="text-lg"></i-material-symbols:home>
              <n-breadcrumb-item href="dashboard">Dashboard</n-breadcrumb-item>
              <n-breadcrumb-item>Kesehatan Anak</n-breadcrumb-item>
            </div>
          </n-breadcrumb>
        </div>

        <!-- Bagian Kanan: Dropdown dengan latar belakang merah -->
        <div class="lg:block md:block hidden">
          <h1 class="text-lg md:text-2xl font-semibold">Kesehatan Anak</h1>
        </div>
      </div>

      <div
        class="lg:block md:block hidden w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:pt-8 rounded-lg min-w-0"
      >
        <n-select
          @update:value="selectChildren"
          :options="childrenOptions"
          placeholder="Pilih Anak"
          v-model:value="selectedChild"
          class="w-full"
        />
      </div>

      <div class="md:hidden lg:hidden flex flex-row justify-between w-full p-2 gap-6">
        <div class="flex">
          <h1 class="text-lg md:text-2xl font-semibold">Kesehatan Anak</h1>
        </div>
        <div class="flex w-full">
          <n-select
            @update:value="selectChildren"
            :options="childrenOptions"
            placeholder="Pilih Anak"
            v-model:value="selectedChild"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- div BIM -->
    <div class="bg-white p-2 rounded-lg mb-6">
      <div class="flex justify-between">
        <h2 class="text-sm md:text-lg font-semibold mb-2">Grafik BMI {{ childrenFilter }}</h2>

        <!-- Dropdown Bulan -->
        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
          <!-- Dropdown Bulan -->

          <n-date-picker v-model:value="range" type="daterange" clearable />
        </div>
      </div>

      <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
        <div class="flex justify-between">
          <div></div>
        </div>

        <VueApexCharts :height="298" type="line" :options="options" :series="series" />

        <div
          class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"
        ></div>
      </div>
    </div>
    <div class="md:flex justify-between">
      <div>
        <h2 class="text-lg font-semibold mb-4">Riwayat Perkembangan</h2>
      </div>
      <!-- <div class="flex justify-start md:justify-end mb-6 mx-4">
        <n-button @click="showModal = true" type="primary">Tambah Perkembangan Mandiri</n-button>
        <n-modal v-model:show="showModal">
          <modal-input-user-modal-input-checkupchild @close="showModal = false" />
        </n-modal>
      </div> -->
      <n-button type="primary" :loading="isExporting" @click="handleExport" class="ml-2">
        Export Data
      </n-button>
    </div>

    <div>
      <!-- Tabel untuk tampilan Desktop -->
      <div class="hidden md:block overflow-x-auto">
        <n-data-table
          class="justify-center text-center overflow-x-auto min-w-max"
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

      <!-- Card Layout untuk tampilan Mobile -->
      <div class="block md:hidden space-y-4">
        <div
          v-for="checkup in itemsCheckup"
          :key="checkup.id"
          class="p-4 bg-white rounded-lg shadow-md"
        >
          <div class="flex items-center mb-2 gap-2">
            <div class="flex items-center space-x-2 bg-red-100 p-2 rounded-lg">
              <strong class="text-xs">Tanggal</strong>
              <h3 class="text-xs text-gray-600">
                {{ DateTime.fromISO(checkup.date).toFormat(' LLL dd, yyyy') }}
              </h3>
            </div>
            <span
              class="px-2 py-1 text-xs rounded-lg"
              :style="{ backgroundColor: getBackgroundColor(checkup.bmi) }"
            >
              {{ checkup.bmiStatus }}
            </span>
            <div class="flex gap-2">
              <DetailKesehatanAnak
                :id="checkup.id"
                type="primary"
                size="small"
                @close="showDetail = false"
              >
              </DetailKesehatanAnak>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Nama:</strong> {{ checkup.childName }}</p>
            <p><strong>Tinggi:</strong> {{ checkup.height }} cm</p>
            <p><strong>Berat:</strong> {{ checkup.weight }} kg</p>
            <p><strong>Lingkar Kepala:</strong> {{ checkup.headCircumference }} cm</p>
          </div>

          <div class="flex justify-between mt-2">
            <a
              v-if="checkup.fileDiagnosed"
              :href="checkup.fileDiagnosed"
              target="_blank"
              class="text-blue-500 underline text-sm"
            >
              Surat Rujukan
            </a>
          </div>
        </div>

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
