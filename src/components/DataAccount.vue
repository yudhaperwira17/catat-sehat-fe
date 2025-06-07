<script setup lang="tsx">
import EditParent from '@/components/componen-user/edit-parents.vue'
import AddParent from '@/components/modal/input-user/data-parents.vue'
// import ModalDeleteAccount from '@/components/modal/input-user/modal-delete-account.vue'
// import ModalEditUser from '@/components/modal/input-user/modal-edit-account.vue'
// import { useAuthProfile } from '@/services/auth-user'
import { useReadParent, type Daum } from '@/services/parents'
import { ref } from 'vue'

const addParent = ref(false)

// const { data, refetch } = useAuthProfile()
const { data: parents } = useReadParent()
const deleteUser = ref(false)
// const openDeleteModal = (id: string) => {
//   deleteUser.value = true
// }
const closeDeleteModal = () => {
  deleteUser.value = false
}

const items = computed(() => {
  return parents.value?.data?.map((parent: Daum) => {
    return {
      id: parent.id,
      name: parent.name,
      dateOfBirth: parent.dateOfBirth
        ? new Date(parent.dateOfBirth).toLocaleDateString('id-ID')
        : null,
      placeOfBirth: parent.placeOfBirth,
      address: parent.address,
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
  <div class=" bg-gray-50">
    <div class="py-4 px- text-left">
      <div class="hidden md:flex justify-between items-center pb-4">
        <!-- Container untuk tombol di sebelah kanan -->
      </div>
      <!-- tampilan mobile -->
      <div class="flex items-center justify-center lg:hidden">
        <div class="bg-white w-full rounded-lg p-2 shadow-sm">
          <div class="flex justify-between items-center mx-4 mt-2">
            <h2 class="text-base font-semibold">Profil Pengguna</h2>
            <n-button
              @click="showModal = true"
              type="primary"
              class="text-black text-xs font-medium bg-white px-4 py-2 rounded-lg border border-gray-400"
            >
              Ubah Profil
            </n-button>
            <n-modal v-model:show="showModal">
              <!-- <ModalEditUser :id="data?.id" @close="showModal = false" /> -->
            </n-modal>
          </div>
          <div class="flex flex-col items-center mt-4">
            <div class="flex flex-col items-center">
              <!-- <ui-avatar :seed="data?.fullName" class="w-20 h-20" /> -->
              <h3 class="mt-4 text-xs font-bold md:text-lg md:font-semibold">
                <!-- {{ data?.fullName }} -->
              </h3>
              <p class="text-gray-500 text-xs font-bold md:text-lg md:font-semibold">
                <!-- {{ data?.email }} -->
              </p>
            </div>

            <div class="mt-4 space-y-2 text-gray-500">
              <div class="flex items-center space-x-2 text-xs md:text-sm font-normal">
                <i-ic:round-phone></i-ic:round-phone>
                <!-- <span>{{ data?.phone }}</span> -->
              </div>
              <!-- <div class="flex items-center space-x-2 text-xs md:text-sm font-normal">
                <i-prime:address-book></i-prime:address-book>
                <span>{{ data?.identityNumber || '-' }}</span>
              </div> -->
              <div class="flex items-center space-x-2 text-xs md:text-sm font-normal">
                <i-mdi:address-marker></i-mdi:address-marker>
                <!-- <span>{{ data?.address }}</span> -->
              </div>
            </div>
            <!-- <NButton type="error" class="mt-4" size="small" @click="openDeleteModal(data?.id)">
              Hapus Akun
            </NButton> -->
            <NButton type="error" class="mt-4" size="small">
              Hapus Akun
            </NButton>
            <!-- <n-modal v-model:show="deleteUser" @close="closeDeleteModal">
              <template #default>
                <ModalDeleteAccount :id="data?.id" @close="closeDeleteModal" @refetch="refetch()" />
              </template>
            </n-modal> -->
             <n-modal v-model:show="deleteUser" @close="closeDeleteModal">
              <template #default>
                <!-- <ModalDeleteAccount /> -->
              </template>
            </n-modal>
          </div>
        </div>
      </div>
      <!-- form mobile -->
      <div class="flex justify-center mt-2 w-full lg:hidden">
    <div class="w-full max-w-md px-4">
      <div class="bg-white p-4 rounded-lg w-full shadow-sm">
        <div class="flex justify-between items-center mt-6">
          <h3 class="text-lg font-semibold">Data Orang Tua</h3>
        </div>
        <div class="flex justify-end my-4">
          <n-button @click="addParent = true" type="primary">
            Tambah Profil Orang Tua
          </n-button>
          <n-modal v-model:show="addParent">
            <AddParent @close="addParent = false" />
          </n-modal>
        </div>
        <div class="flex flex-col items-center">
          <!-- <n-card
            v-for="parent in items"
            :key="parent.id"
            hoverable
            class="mb-4 p-4 shadow-md rounded-lg w-full max-w-sm"
          > -->
          <n-card
            hoverable
            class="mb-4 p-4 shadow-md rounded-lg w-full max-w-sm"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-2">
              <div class="w-full">
                <!-- <span class="font-semibold text-lg">{{ parent.name }}</span> -->
                <p class="text-sm text-gray-500 border-b border-gray-300 pb-2">
                  <!-- <strong>NIK:</strong> {{ parent.identityNumber }} -->
                </p>
              </div>
              <!-- <EditParent :id="parent.id" :type="parent.type" /> -->
            </div>
            <!-- Body -->
            <div class="grid grid-cols-1 gap-2 mt-2"> <!-- Ubah grid menjadi 1 kolom -->
              <div>
                <strong>Tempat Lahir:</strong>
                <!-- <div>{{ parent.placeOfBirth }}</div> -->
              </div>
              <div>
                <strong>Tanggal Lahir:</strong>
                <!-- <div>{{ parent.dateOfBirth }}</div> -->
              </div>
              <div>
                <strong>Alamat:</strong>
                <!-- <div>{{ parent.address }}</div> -->
              </div>
              <div>
                <strong>Status:</strong>
                <!-- <div>{{ parent.type }}</div> -->
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </div>
    </div>
    <!-- profil desktop -->
    <div class="hidden lg:flex w-full gap-3 md:hidden">
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
                <!-- <span>{{ data?.phone }}</span> -->
              </div>
              <div class="flex items-center space-x-2">
                <i-mdi:address-marker></i-mdi:address-marker>
                <!-- <span>{{ data?.address }}</span> -->
              </div>
              <div class="flex justify-center mt-6">
                <!-- <NButton type="error" class="mt-4" size="small" @click="openDeleteModal(data?.id)">
                  Hapus Akun
                </NButton> -->
                <NButton type="error" class="mt-4" size="small">
                  Hapus Akun
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Data Orang Tua -->
      <div class="sm:hidden md:hidden lg:flex w-full">
        <div class="bg-white p-6 w-full rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Data Orang Tua</h2>
            <n-button @click="addParent = true" type="primary"> Tambah Profil Orang Tua </n-button>
            <n-modal v-model:show="addParent">
              <AddParent @close="addParent = false" />
            </n-modal>
          </div>
          <div class="w-full mt-4">
            <n-data-table :columns="columns" :data="items"  class="w-full overflow-x-auto" />
            <!-- <n-data-table :columns="columns" class="w-full overflow-x-auto" /> -->

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
