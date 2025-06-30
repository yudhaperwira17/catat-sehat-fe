<script setup lang="tsx">
import EditParent from '@/components/componen-user/edit-parents.vue'
import AddParent from '@/components/modal/input-user/data-parents.vue'
// import ModalDeleteAccount from '@/components/modal/input-user/modal-delete-account.vue'
// import ModalEditUser from '@/components/modal/input-user/modal-edit-account.vue'
import { useAuthProfile } from '@/services/auth-user'
import { useReadParent, type Daum } from '@/services/parents'
import { ref } from 'vue'

const addParent = ref(false)

const { data } = useAuthProfile()
const { data: parents } = useReadParent()
// const openDeleteModal = (id: string) => {
//   deleteUser.value = true
// }


const items = computed(() => {
  return parents.value?.data?.map((parent: Daum) => {
    return {
      id: parent.id,
      name: parent.name,
      dateOfBirth: parent.dateOfBirth
        ? new Date(parent.dateOfBirth).toLocaleDateString('id-ID')
        : null,
      placeOfBirth: parent.placeOfBirth,
      address: parent.address
    }
  })
})

const columns = ref([
  {
    title: 'Nama',
    key: 'name'
  },
  {
    title: 'Tanggal Lahir',
    key: 'dateOfBirth'
  },
  {
    title: 'Tempat Lahir',
    key: 'placeOfBirth'
  },
  {
    title: 'Alamat',
    key: 'address'
  },
  {
    title: 'Aksi',
    key: 'action',
    render(row: Daum) {
      return <EditParent id={row.id} key={row.id} />
    }
  }
])
const showModal = ref(false)
</script>

<template>
  <div class="bg-gray-50">
    <div class="py-4 px- text-left">
      <div class="hidden md:flex justify-between items-center pb-4">
        <!-- Container untuk tombol di sebelah kanan -->
      </div>
      <!-- tampilan mobile -->

      <!-- form mobile -->
    </div>
    <!-- profil desktop -->
    <div class="flex w-full gap-3 flex-col lg:flex-row">
      <!-- Profil Pengguna -->
      <div class="w-full md:w-1/2 lg:w-1/3">
        <div class="bg-white p-6 ml-2 md:ml-0 rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Profil Pengguna</h2>
            <n-button
              @click="showModal = true"
              class="text-black bg-white px-4 py-2 rounded-lg border border-gray-400"
            >
              Ubah Profil
            </n-button>
          </div>
          <div class="flex flex-col items-center mt-4">
            <!-- <ui-avatar :seed="data?.fullName" class="w-20 h-20" /> -->
            <!-- <h3 class="mt-4 text-xl font-semibold">{{ data?.fullName }}</h3>
            <p class="text-gray-500">{{ data?.email }}</p> -->
            <hr class="w-full mt-2 border-t border-gray-200" />
            <div class="mt-4 space-y-2 text-gray-500">
              <div class="flex items-center space-x-2">
                <i-ic:round-phone></i-ic:round-phone>
                <span>{{ data?.user?.phone }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <i-mdi:address-marker></i-mdi:address-marker>
                <span>{{ data?.user?.address || '-' }}</span>
              </div>
              <div class="flex justify-center mt-6">
                <!-- <NButton type="error" class="mt-4" size="small" @click="openDeleteModal(data?.id)">
                  Hapus Akun
                </NButton> -->
                <NButton type="error" class="mt-4" size="small"> Hapus Akun </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Data Orang Tua -->
      <div class="flex w-full">
        <div class="bg-white p-6 w-full rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Data Ibu</h2>
            <n-button v-if="!((parents?.data?.length ?? 0) > 0)" @click="addParent = true" type="primary">
              Tambah Profil Orang Tua
            </n-button>
            <n-modal v-model:show="addParent">
              <AddParent @close="addParent = false" />
            </n-modal>
          </div>
          <div class="w-full overflow-x-auto mt-4">
            <div class="min-w-[800px]">
              <n-data-table :columns="columns" :data="items" class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tambahkan style kustom jika diperlukan */
</style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
