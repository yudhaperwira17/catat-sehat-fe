<script setup lang="tsx">
import EditProfilChild from '@/components/componen-user/edit-profil-child.vue'
import { useReadChild } from '@/services/child'
import { DateTime } from 'luxon'
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'
import ModalInputUserModalInputDataChild from '@/components/modal/input-user/modal-input-data-child.vue'

const selectedChild = ref<Child | null>(null)

const showModal = ref(false)
const TambahAnak = ref(false)

const selectChild = (child: Child) => {
  selectedChild.value = child // Simpan data anak yang dipilih
  showModal.value = true // Tampilkan modal
}

// Definisikan interface untuk tipe data anak
interface Child {
  id: string
  name: string
  address: string
  placeOfBirth: string
  dateOfBirth: string
  age: string
  childPicture: string
}

// Data anak

const columns = ref([
  { title: 'Nama Anak', key: 'name', sorter: (a: Child, b: Child) => a.name.localeCompare(b.name) },
  { title: 'Alamat Rumah', key: 'address' },
  { title: 'Tempat Lahir', key: 'placeOfBirth' },
  { title: 'Tanggal Lahir', key: 'dateOfBirth' },
  { title: 'Umur', key: 'age' },
  {
    title: 'Aksi',
    key: 'action',
    render(row: Child) {
      return (
        <EditProfilChild
          id={row.id}
          onRefetch={() => {
            // Logic to refetch data or update the state
            // For example, you might call a method to refresh the parent data
            // refreshData();
          }}
        />
      )
    }
  }
])

const { data, isLoading, refetch } = useReadChild() // Call the API using your custom hook

// Definisikan tipe untuk pagination
interface Pagination {
  page: number
  pageSize: number
}

// Data untuk pagination
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 4
})

// Handler untuk perubahan pagination
const handlePaginationChange = (newPagination: Pagination) => {
  pagination.value = newPagination
  refetch() // Panggil kembali data sesuai halaman dan ukuran halaman
}

const items = computed(() => {
  return data.value?.data.map((child) => {
    return {
      id: child.id,
      name: child.name,
      address: child.address,
      placeOfBirth: child.placeOfBirth,
      dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString('id-ID') : '',
      age: calculateAge(child.dateOfBirth),
      childPicture: child.childPicture
    }
  })
})

// Menghitung usia dengan Luxon menggunakan computed property
function calculateAge(birthDate: string): number {
  if (!birthDate) return 0
  const birthDateTime = DateTime.fromISO(birthDate) // Konversi ke Luxon DateTime
  const currentDate = DateTime.now() // Tanggal saat ini
  const diffInYears = currentDate.diff(birthDateTime, 'years').years // Hitung selisih tahun
  return Math.floor(diffInYears) // Kembalikan usia dalam bilangan bulat
}
</script>

<template>
  <div class="mt-4">
    <div class="block sm:flex sm:flex-wrap md:hidden">
      <div class="flex justify-between items-center mb-4 w-full px-4">
        <h3 class="font-bold text-md">Data Anak</h3>
        <n-button @click="TambahAnak = true" type="tertiary">Tambah Data Anak</n-button>
      </div>

      <div class="flex flex-col items-center w-full px-4">
        <n-card
          v-for="child in items"
          :key="child.address"
          hoverable
          class="mb-4 p-4 shadow-md rounded-lg w-full max-w-sm"
        >
          <div class="flex items-center mb-2">
            <img
              :src="child.childPicture?.path"
              alt="Profile Picture"
              class="w-12 h-12 md:w-16 md:h-16 rounded-full mr-4"
            />
            <div class="w-full">
              <span class="font-semibold text-lg">{{ child.name }}</span>
              <p class="text-sm text-gray-500"><strong>Alamat:</strong> {{ child.address }}</p>
            </div>
            <EditProfilChild :id="child.id" :onRefetch="refetch" />
          </div>
          <div class="flex flex-wrap">
            <div class="mr-4 mb-2">
              <strong>Tempat Lahir:</strong>
              <div>{{ child.placeOfBirth }}</div>
            </div>
            <div class="mr-4 mb-2">
              <strong>Tanggal Lahir:</strong>
              <div>{{ child.dateOfBirth }}</div>
            </div>
            <div class="mb-2">
              <strong>Umur:</strong>
              <div>{{ child.age }} Tahun</div>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Tampilan Desktop -->
    <div class="hidden md:block bg-white w-full rounded-md shadow-md">
      <div class="flex flex-wrap justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Anak</h2>
        <n-button
        type = "primary"
          class="px-3 py-2 text-white rounded-md flex items-center md:mr-9 lg:mr-0"
          @click="TambahAnak = true"
        >
          Tambah Profil Anak
        </n-button>
        <n-modal v-model:show="TambahAnak">
          <modal-input-user-modal-input-data-child @close="TambahAnak = false" />
        </n-modal>
      </div>
      <div class="w-full overflow-auto">
        <n-data-table
          class="min-w-max"
          pagination-behavior-on-filter="first"
          :columns="columns"
          :data="items"
          :loading="isLoading"
          @refetch="refetch"
          @update:pagination="handlePaginationChange"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Tambahkan style jika diperlukan */
</style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
