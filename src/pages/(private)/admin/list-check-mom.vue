<script setup lang="tsx">
import DetailCheckupChild from '@/components/mother/action-checkup.vue'
import { useAdminReadCheckupMother, type Daum } from '@/services/admin-checkup-mother'
import { DateTime } from 'luxon'
import { computed, h, ref } from 'vue'

const pagination = ref({
  page: 1,
  pageSize: 10,
  search: ''
  // itemCount: 100 // Adjust as needed
})

const selectedDate = ref<number | null>(DateTime.now().toMillis())

const { data: checkupData, refetch } = useAdminReadCheckupMother(
  computed(() => {
    return {
      page: pagination.value.page,
      limit: pagination.value.pageSize,
      search: pagination.value.search,
      createdAt: selectedDate.value
        ? DateTime.fromMillis(selectedDate.value).toFormat('yyyy-MM-dd')
        : undefined
    }
  })
)

const itemsCheckup = computed(() => {
  return checkupData.value?.data.map((checkup) => {
    return {
      id: checkup.id,
      name: checkup.mother.name,
      month: checkup.month,
      location: checkup.location || checkup.healthPost?.name,
      date: checkup.createdAt ? DateTime.fromISO(checkup.createdAt).toFormat('dd LLL yyyy') : '',
      staff: checkup.publicStaff || checkup.admin.name,
      bmi: checkup.bmi,
      bmiStatus: checkup.bmiStatus,
      status: checkup.status,
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
  { title: 'NAMA IBU', key: 'name' },
  { title: 'NAMA USIA KEHAMILAN', key: 'month' },
  {
    title: 'LOKASI',
    key: 'location'
  },
  { title: 'TANGGAL', key: 'date' },
  { title: 'PETUGAS', key: 'staff' },
  {
    title: 'BMI',
    key: 'bmi',
    render(row: any) {
      // Ambil kategori langsung dari backend
      const bmiCategory = row.bmiStatus
      const bmiDisplay = `${row.bmi} ${bmiCategoryMapper[bmiCategory] || 'Tidak Diketahui'}`
      const color = {
        MALNUTRION: '#FFFFF', // Merah
        UNDERNUTRITION: '#FFFFF', // Merah
        NORMAL: '#FFFFF', // Hijau
        OVERWEIGHT: '#FFFFF', // Kuning
        OBESITY: '#FFFFF' // Kuning
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
    title: 'STATUS',
    key: 'status',
    render(row: any) {
      console.log(row.status) // Debug: Periksa nilai status

      if (row.status === 'UNVERIFIED') {
        return h(
          'span',
          {
            class: 'inline-block px-4 py-2 bg-red-500 text-white rounded whitespace-nowrap'
          },
          'Belum Terverifikasi'
        )
      } else if (row.status === 'VERIFIED') {
        return h(
          'span',
          {
            class: 'inline-block px-4 py-2 bg-green-500 text-white rounded whitespace-nowrap'
          },
          'Terverifikasi'
        )
      } else {
        return h(
          'span',
          {
            class: 'inline-block px-4 py-2 bg-gray-500 text-white rounded whitespace-nowrap'
          },
          'Status Tidak Diketahui'
        )
      }
    }
  },
  {
    title: 'DIAGNOSIS',
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
          {' '}
          Surat Rujukan
        </a>
      ) : (
        <span class="text-gray-500">Tidak Ada File</span>
      )
    }
  },
  {
    title: ' ',
    key: 'action',
    render(row: Daum) {
      return h(
        DetailCheckupChild,
        {
          type: 'primary',
          size: 'small',
          id: row.id,
          key: row.id,
          isList: true,
          onRefetch: () => refetch(),
          onClick: () => console.log(row)
        },
        { default: () => 'Lihat Detail' }
      )
    }
  }
]
const search = ref('')
watch(selectedDate, () => {
  refetch()
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow overflow-auto">
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col space-y-2 text-black">
        <h1 class="text-base font-semibold">Pemeriksaan Ibu Hamil</h1>
        <p class="text-sm font-normal">Informasi tentang data pemeriksaan ibu hamil</p>
      </div>
    </div>
    <div class="bg-white rounded-lg p-4">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 class="text-base font-medium">Data Pemeriksaan</h3>
        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <n-date-picker
              v-model:value="selectedDate"
              type="date"
              clearable
              placeholder="Pilih tanggal"
              :default-value="DateTime.now().toMillis()"
            />
          <div class="flex w-full sm:w-auto gap-2">
            <n-input
              v-model:value="search"
              class="border border-gray-300 rounded-lg h-9 w-80"
              placeholder="Search"
              type="text"
              @keydown.enter="pagination.search = search"
            />
            <n-button @click="pagination.search = search" type="primary" class="rounded-lg ml-2">
              <i-material-symbols:search></i-material-symbols:search>
            </n-button>
          </div>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
        <div class="min-w-[900px]">
          <n-data-table
            pagination-behavior-on-filter="first"
            class="md:min-w-max text-center whitespace-nowrap"
            :columns="columns"
            :data="itemsCheckup"
          />
        </div>
      </div>
      <n-pagination
        v-model:page="pagination.page"
        :page-count="checkupData?.meta?.totalPage"
        class="mt-4"
      />
      <!-- <n-pagination v-model:page="pagination.page" class="mt-4" /> -->
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
</route>
