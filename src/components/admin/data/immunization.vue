<script setup lang="ts">
import DetailImmunization from '../../componen-admin/detail-immunization.vue'
import { computed } from 'vue'

const props = defineProps<{
  id: string
  mother?: string
  children?: string
  vaccine?: string
  dateGiven: number
  vaccineStatus: number | string
  note: string
}>()

const dategivenMapper: Record<number, string> = {
  0: 'Bulan 0',
  1: 'Bulan 1',
  2: 'Bulan 2',
  3: 'Bulan 3',
  4: 'Bulan 4',
  5: 'Bulan 5',
  6: 'Bulan 6',
  7: 'Bulan 7',
  8: 'Bulan 8',
  9: 'Bulan 9',
  10: 'Bulan 10',
  11: 'Bulan 11',
  12: 'Bulan 12',
  18: 'Bulan 18',
  23: 'Bulan 23',
  24: 'Bulan 24-59'
}

const vaccineStatusMapper: Record<number, string> = {
  0: 'Dilarang',
  1: 'Tepat Waktu',
  2: 'Terlambat',
  3: 'Kejar'
}

// Computed properties
const vaccineStatusClass = computed(() => {
  const status = vaccineStatusMapper[Number(props.vaccineStatus)]
  switch (status) {
    case 'Dilarang':
      return 'bg-gray-500 text-white'
    case 'Tepat Waktu':
      return 'bg-green-100 text-green-800'
    case 'Terlambat':
      return 'bg-yellow-100 text-yellow-800'
    case 'Kejar':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-500 text-white'
  }
})
</script>

<template>
  <n-card class="bg-white mx-auto shadow-md rounded-lg my-6" style="max-width: 400px">
    <div class="flex flex-row justify-between my-3">
      <div class="flex flex-col">
        <p class="text-xs font-bold">Jenis Vaksin</p>
        <p class="text-xs font-normal">{{ vaccine || 'Tidak Diketahui' }}</p>
      </div>
      <div class="flex flex-row gap-2">
        <div :class="['px-2 py-1 rounded-lg text-xs font-medium', vaccineStatusClass]">
          <p class="text-xs font-medium">
            {{ vaccineStatusMapper[Number(vaccineStatus)] || 'Tidak Diketahui' }}
          </p>
        </div>
        <DetailImmunization :id="id" />
      </div>
    </div>
    <hr />
    <div class="flex flex-col my-2">
      <div class="flex flex-col justify-between space-y-3 my-3">
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Nama Ibu</p>
          <p class="text-xs font-normal">{{ mother || 'Tidak Diketahui' }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Anak</p>
          <p class="text-xs font-normal">{{ children || 'Tidak Diketahui' }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Tanggal Pemberian</p>
          <p class="text-xs font-normal">{{ dategivenMapper[dateGiven] }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Catatan</p>
          <p class="text-xs font-normal">{{ note || 'Tidak Ada Catatan' }}</p>
        </div>
      </div>
    </div>
  </n-card>
</template>
