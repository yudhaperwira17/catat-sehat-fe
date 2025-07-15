<script setup lang="tsx">
import DetailKesehatanAnak from '@/components/componen-user/detail-kesehatan-anak.vue'
import { API } from '@/composable/http/api-constant'
import { http } from '@/composable/http/http'
import { useReadChildCheckup, useReadChildCheckupGraphic } from '@/services/checkup-children'
import { useReadChild } from '@/services/child'
import { DateTime } from 'luxon'
import { NButton, useMessage } from 'naive-ui'
import { computed, h, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'

//export data
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
const selectedChild = ref<string | null>(null)
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
const { data: graphic, refetch } = useReadChildCheckupGraphic(params)

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
  return [{ label: 'Pilih Anak', value: undefined }, ...options]
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
  OVERWEIGHT: 'Berat Lebih',
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
        UNDERNUTRITION: '#FCD34D', // Kuning Muda
        NORMAL: '#34D399', // Hijau
        OVERWEIGHT: '#FCD34D', // Kuning Muda
        OBESITY: '#F87171' // Merah
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
      yaxis: [
        {
          y: 11.9,
          borderColor: '#EF4444', // Merah
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Batas Malnutrisi (11.9)'
          }
        },
        {
          y: 13.1,
          borderColor: '#F97316', // Oranye
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F97316',
            style: {
              color: '#fff',
              background: '#F97316',
              fontSize: '12px'
            },
            text: 'Batas Gizi Kurang (13.1)'
          }
        },
        {
          y: 18.4,
          borderColor: '#10B981', // Hijau
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Batas Normal (18.4)'
          }
        },
        {
          y: 20.4,
          borderColor: '#3B82F6', // Biru
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Overweight (20.4)'
          }
        },
        {
          y: 20.5,
          borderColor: '#8B5CF6', // Ungu
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#8B5CF6',
            style: {
              color: '#fff',
              background: '#8B5CF6',
              fontSize: '12px'
            },
            text: 'Obesitas (20.5+)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI Anak (Perempuan 0-2)',

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

//option 2
const options2 = computed(() => {
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
      yaxis: [
        {
          y: 11.6,
          borderColor: '#EF4444', // Merah
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Batas Malnutrisi (11.6)'
          }
        },
        {
          y: 12.6,
          borderColor: '#F97316', // Oranye
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F97316',
            style: {
              color: '#fff',
              background: '#F97316',
              fontSize: '12px'
            },
            text: 'Batas Gizi Kurang (12.6)'
          }
        },
        {
          y: 18.7,
          borderColor: '#10B981', // Hijau
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Batas Normal (18.7)'
          }
        },
        {
          y: 20.9,
          borderColor: '#3B82F6', // Biru
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Overweight (20.9)'
          }
        },
        {
          y: 21,
          borderColor: '#8B5CF6', // Ungu
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#8B5CF6',
            style: {
              color: '#fff',
              background: '#8B5CF6',
              fontSize: '12px'
            },
            text: 'Obesitas (21+)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI Anak (Perempuan 2-5)',
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

//option 3
const options3 = computed(() => {
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
      yaxis: [
        {
          y: 11.7,
          borderColor: '#EF4444', // Merah - Malnutrisi
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Batas Malnutrisi (11.7)'
          }
        },
        {
          y: 12.7,
          borderColor: '#F97316', // Oranye - Gizi Kurang
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F97316',
            style: {
              color: '#fff',
              background: '#F97316',
              fontSize: '12px'
            },
            text: 'Batas Gizi Kurang (12.7)'
          }
        },
        {
          y: 17.1,
          borderColor: '#10B981', // Hijau - Normal
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Batas Normal (17.1)'
          }
        },
        {
          y: 19.7,
          borderColor: '#3B82F6', // Biru - Overweight
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Overweight (19.7)'
          }
        },
        {
          y: 19.8,
          borderColor: '#8B5CF6', // Ungu - Obesitas
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#8B5CF6',
            style: {
              color: '#fff',
              background: '#8B5CF6',
              fontSize: '12px'
            },
            text: 'Obesitas (19.8+)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI Anak (Perempuan-5-6)',
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

const options4 = computed(() => {
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
      yaxis: [
        {
          y: 12.5,
          borderColor: '#EF4444', // Merah - Malnutrisi
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Batas Malnutrisi (12.5)'
          }
        },
        {
          y: 13.5,
          borderColor: '#F97316', // Oranye - Gizi Kurang
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F97316',
            style: {
              color: '#fff',
              background: '#F97316',
              fontSize: '12px'
            },
            text: 'Batas Gizi Kurang (13.5)'
          }
        },
        {
          y: 18.5,
          borderColor: '#10B981', // Hijau - Normal
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Batas Normal (18.5)'
          }
        },
        {
          y: 20.1,
          borderColor: '#3B82F6', // Biru - Overweight
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Overweight (20.1)'
          }
        },
        {
          y: 20.2,
          borderColor: '#8B5CF6', // Ungu - Obesitas
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#8B5CF6',
            style: {
              color: '#fff',
              background: '#8B5CF6',
              fontSize: '12px'
            },
            text: 'Obesitas (20.2+)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI Anak (Laki-laki 0-2)',
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

const options5 = computed(() => {
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
      yaxis: [
        {
          y: 11.9,
          borderColor: '#EF4444', // Merah - Malnutrisi
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Batas Malnutrisi (11.9)'
          }
        },
        {
          y: 12.8,
          borderColor: '#F97316', // Oranye - Gizi Kurang
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F97316',
            style: {
              color: '#fff',
              background: '#F97316',
              fontSize: '12px'
            },
            text: 'Batas Gizi Kurang (12.8)'
          }
        },
        {
          y: 18.1,
          borderColor: '#10B981', // Hijau - Normal
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Batas Normal (18.1)'
          }
        },
        {
          y: 20.1,
          borderColor: '#3B82F6', // Biru - Overweight
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Overweight (20.1)'
          }
        },
        {
          y: 20.2,
          borderColor: '#8B5CF6', // Ungu - Obesitas
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#8B5CF6',
            style: {
              color: '#fff',
              background: '#8B5CF6',
              fontSize: '12px'
            },
            text: 'Obesitas (20.2+)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI Anak (Laki-laki 2-5)',
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

const options6 = computed(() => {
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
      yaxis: [
        {
          y: 12.1,
          borderColor: '#EF4444', // Merah - Malnutrisi
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '12px'
            },
            text: 'Batas Malnutrisi (12.1)'
          }
        },
        {
          y: 13.1,
          borderColor: '#F97316', // Oranye - Gizi Kurang
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#F97316',
            style: {
              color: '#fff',
              background: '#F97316',
              fontSize: '12px'
            },
            text: 'Batas Gizi Kurang (13.1)'
          }
        },
        {
          y: 16.9,
          borderColor: '#10B981', // Hijau - Normal
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#10B981',
            style: {
              color: '#fff',
              background: '#10B981',
              fontSize: '12px'
            },
            text: 'Batas Normal (16.9)'
          }
        },
        {
          y: 18.9,
          borderColor: '#3B82F6', // Biru - Overweight
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '12px'
            },
            text: 'Batas Overweight (18.9)'
          }
        },
        {
          y: 19,
          borderColor: '#8B5CF6', // Ungu - Obesitas
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#8B5CF6',
            style: {
              color: '#fff',
              background: '#8B5CF6',
              fontSize: '12px'
            },
            text: 'Obesitas (19+)'
          }
        }
      ]
    },
    series: [
      {
        name: 'BMI Anak (Laki-laki 5-6)',
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

const activeTab = ref('female-0-2') // default tab

watch(activeTab, () => {
  selectedChild.value = null
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
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane name="female-0-2" tab="Perempuan 0-2">
          <div class="flex justify-between mb-4">
            <h2 class="text-sm md:text-lg font-semibold">
              Grafik BMI {{ childrenFilter }} (Perempuan 0-2 Tahun)
            </h2>

            <!-- Dropdown Bulan -->
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
              <n-date-picker v-model:value="range" type="daterange" clearable />
            </div>
          </div>

          <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
            <VueApexCharts :height="298" type="line" :options="options" :series="options?.series" />
          </div>
        </n-tab-pane>

        <n-tab-pane name="female-2-5" tab="Perempuan 2-5" @click="refetch">
          <div class="flex justify-between mb-4">
            <h2 class="text-sm md:text-lg font-semibold">
              Grafik BMI {{ childrenFilter }} (Perempuan 2-5 Tahun)
            </h2>

            <!-- Dropdown Bulan -->
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
              <n-date-picker v-model:value="range" type="daterange" clearable />
            </div>
          </div>

          <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
            <VueApexCharts
              :height="298"
              type="line"
              :options="options2"
              :series="options2?.series"
            />
          </div>
        </n-tab-pane>

        <n-tab-pane name="female-5-6" tab="Perempuan 5-6">
          <div class="flex justify-between mb-4">
            <h2 class="text-sm md:text-lg font-semibold">
              Grafik BMI {{ childrenFilter }} (Perempuan 2-5 Tahun)
            </h2>

            <!-- Dropdown Bulan -->
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
              <n-date-picker v-model:value="range" type="daterange" clearable />
            </div>
          </div>

          <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
            <VueApexCharts
              :height="298"
              type="line"
              :options="options3"
              :series="options2?.series"
            />
          </div>
        </n-tab-pane>

        <n-tab-pane name="male-0-2" tab="Laki-laki 0-2">
          <div class="flex justify-between mb-4">
            <h2 class="text-sm md:text-lg font-semibold">
              Grafik BMI {{ childrenFilter }} (Laki-laki 0-2 Tahun)
            </h2>

            <!-- Dropdown Bulan -->
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
              <n-date-picker v-model:value="range" type="daterange" clearable />
            </div>
          </div>

          <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
            <VueApexCharts
              :height="298"
              type="line"
              :options="options4"
              :series="options3?.series"
            />
          </div>
        </n-tab-pane>

        <n-tab-pane name="male-2-5" tab="Laki-laki 2-5">
          <div class="flex justify-between mb-4">
            <h2 class="text-sm md:text-lg font-semibold">
              Grafik BMI {{ childrenFilter }} (Laki-laki 0-2 Tahun)
            </h2>

            <!-- Dropdown Bulan -->
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
              <n-date-picker v-model:value="range" type="daterange" clearable />
            </div>
          </div>

          <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
            <VueApexCharts
              :height="298"
              type="line"
              :options="options5"
              :series="options3?.series"
            />
          </div>
        </n-tab-pane>

        <n-tab-pane name="male-5-6" tab="Laki-laki 5-6">
          <div class="flex justify-between mb-4">
            <h2 class="text-sm md:text-lg font-semibold">
              Grafik BMI {{ childrenFilter }} (Laki-laki 0-2 Tahun)
            </h2>

            <!-- Dropdown Bulan -->
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg min-w-0">
              <n-date-picker v-model:value="range" type="daterange" clearable />
            </div>
          </div>

          <div class="h-full w-full bg-white rounded-lg shadow dark:bg-white p-4">
            <VueApexCharts
              :height="298"
              type="line"
              :options="options6"
              :series="options3?.series"
            />
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
    <div class="md:flex justify-between">
      <div>
        <h2 class="text-lg font-semibold mb-4">Riwayat Perkembangan</h2>
      </div>
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
