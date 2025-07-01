<script setup lang="ts">
import ModalDetailChild from '@/components/modal/input-admin/master-data/detail-child.vue'
// import ModalDetail from '@/components/modal/input-admin/report/modal-detail.vue';
import { useAdminReadChild } from '@/services/admin-child'
import { DateTime } from 'luxon'
import { ref } from 'vue'

const params = ref<{ page: number; limit?: number; search?: string }>({
  page: 1,
  limit: 10,
  search: ''
})

const { data: children } = useAdminReadChild(params)
const search = ref('')
const showModal = ref(false)
const selectedChildId = ref<string | null>(null)

const openModal = (id: string) => {
  selectedChildId.value = id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedChildId.value = null
}

defineProps<{}>()
</script>

<template>
  <!-- Search Bar and Icon -->
  <div class="relative flex items-center w-full mb-6 gap-2">
    <n-input
      v-model:value="search"
      class="border border-gray-300 rounded-lg h-9 w-80"
      placeholder="Search"
      type="text"
      @keydown.enter="params.search = search"
    />
    <n-button @click="params.search = search" class="bg-pink-500 rounded-lg text-white">
      <i-material-symbols:search></i-material-symbols:search>
    </n-button>
  </div>
  <h2 class="text-base items-center font-medium">Data Bayi</h2>

  <n-card
    class="bg-white shadow-md rounded-lg my-6"
    v-for="child in children?.data"
    :key="child.id"
    @click="openModal(child.id)"
  >
    <div class="flex flex-row justify-between my-3">
      <div class="bg-red-100 rounded-lg p-2">
        <p class="text-xs font-bold">{{ child?.name }}</p>
      </div>
      <ModalDetailChild :id="selectedChildId as string" @close="closeModal" />
    </div>
    <hr />
    <div class="flex flex-col my-2">
      <div class="flex flex-row justify-between my-3 space-x-4">
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">NIK</p>
          <p class="text-xs font-normal">{{ child?.identityNumber }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Anak Ke-</p>
          <p class="text-xs font-normal">{{ child?.childOrder }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Tanggal Lahir</p>
          <p class="text-xs font-normal">
            {{
              child?.dateOfBirth ? DateTime.fromISO(child.dateOfBirth).toFormat('yyyy-MM-dd') : ''
            }}
          </p>
        </div>
      </div>
      <div class="my-3">
        <p class="text-xs font-bold">Tempat Lahir</p>
        <p class="text-sm font-normal">
          {{ child?.placeOfBirth }}
        </p>
      </div>
    </div>
  </n-card>
  <n-pagination v-model:page="params.page" :page-count="children?.meta?.totalPage" />
</template>
