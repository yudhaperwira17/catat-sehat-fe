<script setup lang="tsx">
import Expand from '@/components/componen-user/table/expand.vue'
import { useReadChild } from '@/services/child'
import { useUserReadImmunization, type Daum } from '@/services/immunization.ts'
import { NDataTable, type DataTableColumns } from 'naive-ui'
import { computed, ref } from 'vue'

const { data: childrenData } = useReadChild()
const selectedChild = ref<string>('')
const { data: immunization } = useUserReadImmunization(computed(() => selectedChild.value))

const childrenOptions = computed(() => {
  const options =
    childrenData.value?.data?.map((item) => {
      return { label: item.name, value: item.id }
    }) || []

  // Sisipkan opsi placeholder di awal daftar
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
            backgroundColor: color[statusCategory as keyof typeof color] || '-', // Warna default jika kategori tidak ditemukan
            color: 'black', // Warna teks untuk kontras
            padding: '5px',
            borderRadius: '6px',
            textAlign: 'center'
          }}
        >
          {statusDisplay} {/* Tampilkan angka BMI dan kategori */}
        </div>
      )
    }
  }
]
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
    <NCard class="shadow-md rounded-lg">
      <div class="bg-white rounded-lg w-full">
        <!-- Header: Search and Add Button -->
        <div class="flex flex-col justify-between items-center mb-5 w-full">
          <div class="flex flex-row justify-between w-full mb-3">
            <h3 class="text-lg font-semibold">Riwayat Imunisasi</h3>
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
