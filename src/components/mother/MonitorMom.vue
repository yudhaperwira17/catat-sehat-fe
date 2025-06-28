<script setup lang="tsx">
import Expand from '@/components/mother/ExpandMom.vue'
// import { useReadChild } from '@/services/child';
// import { useUserReadImmunization, type Daum } from '@/services/immunization';
import { NDataTable, type DataTableColumns } from 'naive-ui'
import { ref } from 'vue'

// const { data: childrenData } = useReadChild()
const selectedChild = ref<string>('')
// const { data: immunization } = useUserReadImmunization(computed(() => selectedChild.value))

// const childrenOptions = computed(() => {
//   const options =
//     childrenData.value?.data?.map((item) => {
//       return { label: item.name, value: item.id }
//     }) || []

//   return [{ label: 'Pilih Anak', disabled: true, value:'' }, ...options]
// })

const childrenFilter = ref<string>()
// const selectChildren = (value: string) => {
//   selectedChild.value = value
//   childrenFilter.value = childrenData.value?.data?.find((item) => item.id === value)?.name
// }

// const formattedImmunization = computed(() => {
//   return immunization.value?.map((item: Daum) => ({
//     id: item.id,
//     name: item.name,
//     lastVaccineGiven: item.lastVaccineGiven,
//     upcomingVaccine: item.upcomingVaccine,
//     immunizationStatus: item.immunizationStatus,
//     vaccineId: item.vaccineId
//   })) || [];
// });
const immunizationStatusMapper: Record<number, string> = {
  0: 'Belum Dilakukan',
  1: 'Sedang Berlangsung',
  2: 'Selesai'
}
const columns: DataTableColumns<Daum> = [
  {
    type: 'expand',
    renderExpand: (rowData: Daum) => {
      return <Expand childId={selectedChild.value} vaccineId={rowData.vaccineId} />
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
    title: 'PEMERIKSAAN KEHAMILAN',
    key: 'name'
  },
  {
    title: 'KELAS IBU HAMIL',
    key: 'lastVaccineGiven',
    render(row: Daum) {
      return row.lastVaccineGiven || '-'
    }
  },
  {
    title: 'PEMENUHAN GIZI SESUAI KEBUTUHAN',
    key: 'upcomingVaccine',
    render(row: Daum) {
      return row.upcomingVaccine || '-'
    }
  },
  {
    title: 'STATUS',
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
</script>

<template>
  <div class="flex flex-col">
    <div class="flex md:flex-row md:items-center mb-6 flex-col gap-y-2 md:justify-between">
      <div>
        <h1 class="text-base font-semibold">Pemantauan Ibu Hamil</h1>
        <p class="text-gray-600 font-normal text-sm">Lembar Pemantauan Ibu Hamil</p>
      </div>
      <div class="w-full md:w-auto flex justify-end">
        <div class="w-28 mt-6">
            <!-- <n-select
              @update:value="selectChildren"
              :options="childrenOptions"
              placeholder="Pilih Anak"
              v-model:value="selectedChild"
            /> -->
            <n-select
              :options="[
                { label: 'Minggu ke', disabled: true, value: '' },
                { label: 'Minggu 1', value: '1' },
                { label: 'Minggu 2', value: '2' }
              ]"
              placeholder="Minggu ke"
              v-model:value="selectedChild"
              default-value="Minggu 1"
              size="small"
            />
          </div>
        </div>
    </div>
    <NCard class="shadow-md rounded-lg">
      <div class="flex justify-end mb-4">
        <n-button
          class="text-white rounded-md ml-2 flex items-center justify-end "
          size="small"
        >
          <i-mdi:plus></i-mdi:plus> Tambah Pantauan
        </n-button>
      </div>
      <div class="bg-white rounded-lg w-full">
        <!-- Header: Search and Add Button -->
        <div class="flex flex-col justify-between items-center mb-5 w-full">
          <div class="w-full overflow-x-auto">
            <div class="min-w-[1000px]">
              <!-- <n-data-table
              :columns="columns"
              :data="formattedImmunization"
              class="min-w-max overflow-auto"
              style="margin-top: 28px"
              :row-key="(r)=> r.id"
              :scroll-x="1000"
            /> -->
              <n-data-table
                :columns="columns"
                class="min-w-max overflow-auto"
                style="margin-top: 28px"
                :row-key="(r) => r.id"
                :scroll-x="1000"
              />
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>
