<script setup lang="tsx">
import Expand from '@/components/componen-user/table/expand.vue'
import { API } from '@/composable/http/api-constant'
import { http } from '@/composable/http/http'
import { useReadChild } from '@/services/child'
import { useUserReadImmunization, type Daum } from '@/services/immunization.ts'
import { NAlert, NDataTable, NTag, useMessage, type DataTableColumns } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

const isExporting = ref(false)
const message = useMessage()
type VaccineDetail = {
  id: string | number
  name: string
  vaccineStage?: Array<{ name: string; suggestedAge: string }>
}
const vaccineList = ref<VaccineDetail[]>([])

const fetchVaccineList = async () => {
  try {
    const response = await http.get('/v1/vaccine')
    vaccineList.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching vaccine list:', error)
  }
}

const calculateAgeInMonths = (dateOfBirth: string) => {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - birthDate.getTime())
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44))
  return diffMonths
}

const convertSuggestedAgeToMonths = (suggestedAge: string) => {
  const ageStr = suggestedAge.toLowerCase()
  
  if (ageStr.includes('24 jam') || ageStr.includes('dibawah 24 jam')) {
    return 0
  }
  
  const monthMatch = ageStr.match(/(\d+)\s*bulan/)
  if (monthMatch) {
    return parseInt(monthMatch[1])
  }
  const rangeMatch = ageStr.match(/(\d+)\s*-\s*(\d+)\s*bulan/)
  if (rangeMatch) {
    return parseInt(rangeMatch[1])
  }
  
  return 0
}

const analyzeVaccineStatus = computed(() => {
  if (!selectedChild.value || !childrenData.value?.data || !immunization.value || !vaccineList.value.length) {
    return { upcoming: [], overdue: [], completed: [] }
  }

  const child = childrenData.value.data.find(c => c.id === selectedChild.value)
  if (!child) return { upcoming: [], overdue: [], completed: [] }

  const childAgeInMonths = calculateAgeInMonths(child.dateOfBirth)
  const upcoming: Array<{ name: string; nextVaccine?: string; requiredAge?: string; childAge?: number; status: string }> = []
  const overdue: Array<{ name: string; nextVaccine?: string; requiredAge?: string; childAge?: number; status: string }> = []
  const completed: Array<{ name: string; status: string }> = []

  immunization.value.forEach((vaccine: Daum) => {
    const vaccineDetail = vaccineList.value.find(v => v.id === vaccine.vaccineId)
    if (!vaccineDetail) return

    if (vaccine.immunizationStatus === 2) {
      completed.push({
        name: vaccine.name,
        status: 'completed'
      })
    } else if (vaccine.immunizationStatus === 1) {
      // Status sedang berlangsung - cek apakah sudah terlambat
      if (vaccine.upcomingVaccine) {
        const nextStage = vaccineDetail.vaccineStage?.find(stage => 
          stage.name === vaccine.upcomingVaccine
        )
        
        if (nextStage) {
          const requiredAgeInMonths = convertSuggestedAgeToMonths(nextStage.suggestedAge)
          console.log(`${vaccine.name} - Next: ${vaccine.upcomingVaccine}, Required: ${requiredAgeInMonths} months, Child: ${childAgeInMonths} months`)
          
          if (childAgeInMonths >= requiredAgeInMonths + 2) {
            overdue.push({
              name: vaccine.name,
              nextVaccine: vaccine.upcomingVaccine,
              requiredAge: nextStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'overdue'
            })
          } else if (childAgeInMonths >= requiredAgeInMonths) {
            upcoming.push({
              name: vaccine.name,
              nextVaccine: vaccine.upcomingVaccine,
              requiredAge: nextStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'due'
            })
          }
        }
      } else {
        const allStages = vaccineDetail.vaccineStage || []
        const lastStage = allStages[allStages.length - 1]
        
        if (lastStage) {
          const requiredAgeInMonths = convertSuggestedAgeToMonths(lastStage.suggestedAge)
          console.log(`${vaccine.name} - No upcoming, checking last stage: ${lastStage.name}, Required: ${requiredAgeInMonths} months`)
          
          if (childAgeInMonths >= requiredAgeInMonths + 2) {
            overdue.push({
              name: vaccine.name,
              nextVaccine: `${vaccine.name} (Stadium Terakhir)`,
              requiredAge: lastStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'overdue'
            })
          }
        }
      }
    } else if (vaccine.immunizationStatus === 0) {
      if (vaccine.upcomingVaccine) {
        const nextStage = vaccineDetail.vaccineStage?.find(stage => 
          stage.name === vaccine.upcomingVaccine
        )
        
        if (nextStage) {
          const requiredAgeInMonths = convertSuggestedAgeToMonths(nextStage.suggestedAge)
          console.log(`${vaccine.name} - Status 0 with upcoming: ${vaccine.upcomingVaccine}, Required: ${requiredAgeInMonths} months`)
          
          if (childAgeInMonths >= requiredAgeInMonths + 2) {
            overdue.push({
              name: vaccine.name,
              nextVaccine: vaccine.upcomingVaccine,
              requiredAge: nextStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'overdue'
            })
          } else if (childAgeInMonths >= requiredAgeInMonths) {
            upcoming.push({
              name: vaccine.name,
              nextVaccine: vaccine.upcomingVaccine,
              requiredAge: nextStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'due'
            })
          }
        }
      } else {
        const firstStage = vaccineDetail.vaccineStage?.[0]
        
        if (firstStage) {
          const requiredAgeInMonths = convertSuggestedAgeToMonths(firstStage.suggestedAge)
          console.log(`${vaccine.name} - Status 0 no upcoming, checking first stage: ${firstStage.name}, Required: ${requiredAgeInMonths} months`)
          
          if (childAgeInMonths >= requiredAgeInMonths + 2) {
            overdue.push({
              name: vaccine.name,
              nextVaccine: firstStage.name,
              requiredAge: firstStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'overdue'
            })
          } else if (childAgeInMonths >= requiredAgeInMonths) {
            upcoming.push({
              name: vaccine.name,
              nextVaccine: firstStage.name,
              requiredAge: firstStage.suggestedAge,
              childAge: childAgeInMonths,
              status: 'due'
            })
          }
        }
      }
    }
  })

  console.log('Analysis Result:', { upcoming, overdue, completed })
  return { upcoming, overdue, completed }
})

const handleExport = async () => {
  if (!selectedChild.value) {
    message.warning('Silakan pilih anak terlebih dahulu.')
    return
  }

  try {
    isExporting.value = true
    const params = new URLSearchParams({ childrenId: selectedChild.value }).toString()
    const fullUrl = `${API.USER_GET_EXPORT_IMMUNIZATION}?${params}`

    const response = await http.get(fullUrl, {
      responseType: 'blob',
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })

    if (response.data && response.data.size > 0) {
      const blobUrl = window.URL.createObjectURL(response.data)

      const contentDisposition = response.headers['content-disposition']
      let filename = 'export_imunisasi.xlsx'
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

const { data: childrenData } = useReadChild()
const selectedChild = ref<string>('')
const { data: immunization } = useUserReadImmunization(computed(() => selectedChild.value))

const childrenOptions = computed(() => {
  const options =
    childrenData.value?.data?.map((item) => {
      return { label: item.name, value: item.id }
    }) || []

  return [{ label: 'Pilih Anak', disabled: true, value: '' }, ...options]
})

const childrenFilter = ref<string>()
const selectChildren = (value: string) => {
  selectedChild.value = value
  childrenFilter.value = childrenData.value?.data?.find((item) => item.id === value)?.name
}

const formattedImmunization = computed(() => {
  return (
    immunization.value?.map((item: Daum) => ({
      id: item.id,
      name: item.name,
      lastVaccineGiven: item.lastVaccineGiven,
      upcomingVaccine: item.upcomingVaccine,
      immunizationStatus: item.immunizationStatus,
      vaccineId: item.vaccineId
    })) || []
  )
})

const immunizationStatusMapper: Record<number, string> = {
  0: 'Belum Dilakukan',
  1: 'Sedang Berlangsung',
  2: 'Selesai'
}

const columns: DataTableColumns<Daum> = [
  {
    type: 'expand',
    renderExpand: (rowData: Daum) => {
      return <Expand childrenId={selectedChild.value} vaccineId={rowData.vaccineId} />
    }
  },
  {
    title: '',
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    }
  },
  {
    title: 'JENIS VAKSIN',
    key: 'name'
  },
  {
    title: 'VAKSIN TERAKHIR',
    key: 'lastVaccineGiven',
    render(row: Daum) {
      return row.lastVaccineGiven || '-'
    }
  },
  {
    title: 'VAKSIN AKAN DATANG',
    key: 'upcomingVaccine',
    render(row: Daum) {
      return row.upcomingVaccine || '-'
    }
  },
  {
    title: 'STATUS IMUNISASI',
    key: 'immunizationStatus',
    render(row: Daum) {
      const statusCategory = row.immunizationStatus
      const statusDisplay = `${immunizationStatusMapper[statusCategory] || '-'}`
      const color = {
        0: '#E3E3E3',
        1: '#FDF6B2',
        2: '#DEF7EF'
      }
      return (
        <div
          style={{
            backgroundColor: color[statusCategory as keyof typeof color] || '-',
            color: 'black',
            padding: '5px',
            borderRadius: '6px',
            textAlign: 'center'
          }}
        >
          {statusDisplay}
        </div>
      )
    }
  }
]

onMounted(() => {
  fetchVaccineList()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between">
      <div>
        <h1 class="text-base font-semibold">Perkembangan Imunisasi</h1>
        <p class="text-gray-600 font-normal text-sm">Informasi Perkembangan Anak Imunisasi Anak</p>
      </div>
      <div class="hidden md:block w-28 md:w-1/3 lg:w-1/6 md:p-4 rounded-lg">
        <n-select
          @update:value="selectChildren"
          :options="childrenOptions"
          placeholder="Pilih Anak"
          v-model:value="selectedChild"
        />
      </div>
    </div>

    <!-- Alert Section for Vaccine Status -->
    <div v-if="selectedChild" class="mb-4 space-y-3">
      <!-- Overdue Vaccines Alert -->
      <n-alert
        v-if="analyzeVaccineStatus.overdue.length > 0"
        title="⚠️ Vaksin Terlambat"
        type="error"
        closable
      >
        <div class="space-y-2">
          <p class="font-medium">Vaksin berikut sudah terlambat dan perlu segera dilakukan:</p>
          <div class="flex flex-wrap gap-2">
            <n-tag
              v-for="vaccine in analyzeVaccineStatus.overdue"
              :key="vaccine.name"
              type="error"
              size="small"
            >
              {{ vaccine.nextVaccine }} ({{ vaccine.requiredAge }})
            </n-tag>
          </div>
        </div>
      </n-alert>

      <!-- Upcoming Vaccines Alert -->
      <n-alert
        v-if="analyzeVaccineStatus.upcoming.length > 0"
        title="📅 Vaksin Akan Datang"
        type="warning"
        closable
      >
        <div class="space-y-2">
          <p class="font-medium">Vaksin yang perlu dilakukan segera:</p>
          <div class="flex flex-wrap gap-2">
            <n-tag
              v-for="vaccine in analyzeVaccineStatus.upcoming"
              :key="vaccine.name"
              type="warning"
              size="small"
            >
              {{ vaccine.nextVaccine || vaccine.name }}
              <span v-if="vaccine.requiredAge"> ({{ vaccine.requiredAge }})</span>
            </n-tag>
          </div>
        </div>
      </n-alert>

      <!-- Completed Vaccines Info -->
      <n-alert
        v-if="analyzeVaccineStatus.completed.length > 0"
        title="✅ Vaksin Selesai"
        type="success"
        closable
      >
        <div class="space-y-2">
          <p class="font-medium">Vaksin yang sudah selesai:</p>
          <div class="flex flex-wrap gap-2">
            <n-tag
              v-for="vaccine in analyzeVaccineStatus.completed"
              :key="vaccine.name"
              type="success"
              size="small"
            >
              {{ vaccine.name }}
            </n-tag>
          </div>
        </div>
      </n-alert>
    </div>

    <NCard class="shadow-md rounded-lg">
      <div class="bg-white rounded-lg w-full">
        <!-- Header: Search and Add Button -->
        <div class="flex flex-col justify-between items-center mb-5 w-full">
          <div class="flex flex-row justify-between w-full mb-3">
            <h3 class="text-lg font-semibold">Riwayat Imunisasi Anak</h3>
            <n-button type="primary" :loading="isExporting" @click="handleExport" class="ml-2">
              Export Data
            </n-button>
          </div>
          <div class="w-full overflow-auto">
            <n-data-table
              :columns="columns"
              :data="formattedImmunization"
              class="min-w-max overflow-auto"
              style="margin-top: 28px"
              :row-key="(r) => r.id"
              :scroll-x="1000"
            />
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>