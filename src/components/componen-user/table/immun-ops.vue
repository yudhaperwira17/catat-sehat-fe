<script setup lang="tsx">
import { useReadChild } from '@/services/child';
import { useUserReadImmunizationOptional } from '@/services/immunization';
import { DateTime } from 'luxon';
import { NCard, NDataTable, NSelect, type DataTableColumns } from 'naive-ui';
import { computed, ref, watch } from 'vue';



export interface RootObject {
  message: string;
  data: Data;
  status: number;
}
export interface Data {
  data: Datum[];
  meta: Meta;
}
export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
export interface Datum {
  id: string;
  name: string;
  dateGiven: number;
  note: string;
  childrenId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  children: Children;
}
export interface Children {
  id: string;
  name: string;
  dateOfBirth: string;
  placeOfBirth: string;
  childOrder: number;
  bloodType: string;
  height: number;
  weight: number;
  address: string;
  gender: string;
  code: string;
  userId: string;
  motherId: string;
  childPictureId?: any;
  birthCertificateId?: any;
  kiaCardId?: any;
  familyCardId?: any;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  mother: Mother;
}
export interface Mother {
  id: string;
  name: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  code: string;
  userId: string;
  subDistrictId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
}
// State anak
const selectedChild = ref('')

// Ambil data anak untuk pilihan dropdown
const { data: childrenData } = useReadChild()
const childOptions = computed(() => {
  const options =
    childrenData.value?.data?.map((item) => {
      return { label: item.name, value: item.id }
    }) || []

  // Sisipkan opsi placeholder di awal daftar
  return [{ label: 'Pilih Anak', disabled: true, value: '' }, ...options]
})

// Param untuk query imunisasi berdasarkan anak
const immunizationParams = computed(() => ({
  childrenId: selectedChild.value
}))
const {
  data: immunizations,
  isLoading: loading,
  refetch
} = useUserReadImmunizationOptional(immunizationParams)

// Refetch saat anak berubah
watch(selectedChild, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await refetch()
  }
})
const immunizationTableData = computed(() => {
  return immunizations.value?.data.map((schedule: Datum) => {
    return {
      id: schedule.id,
      createdAt: DateTime.fromISO(schedule.createdAt).toFormat('dd LLL yyyy'),
      childName: schedule.children.name,
      motherName: schedule.children.mother.name,
      vaccine: schedule.name,
      date: schedule.dateGiven,
      note: schedule.note
    }
  })
})

// Kolom tabel
const columns: DataTableColumns = [
  {
    title: 'No',
    key: 'no',
    render: (_row, index) => `${index + 1}`,
    width: 60
  },
  {
    title: 'Nama Anak',
    key: 'childName',
    width: 180
  },
  {
    title: 'Nama Ibu',
    key: 'motherName',
    width: 200
  },
  {
    title: 'Nama Vaksin',
    key: 'vaccine',
    width: 180
  },
  {
    title: 'Catatan',
    key: 'note'
  },
  {
    title: 'Tanggal Diberikan',
    key: 'date',
    width: 180
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-semibold">Imunisasi Opsional Anak</h1>
      <n-select
        class="w-60"
        v-model:value="selectedChild"
        :options="childOptions"
        placeholder="Pilih Anak"
        filterable
      />
    </div>

    <n-card>
      <n-data-table
        :columns="columns"
        :data="immunizationTableData"
        :loading="loading"
        :pagination="false"
        :bordered="false"
        :row-key="row => row.id"
      />
    </n-card>
  </div>
</template>
