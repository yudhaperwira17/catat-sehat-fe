<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  bloodData: Array<{
    id: string
    date: string
    type: string
    staffName: string | null
    staffJob: string | null
    note: string
    adminId: string | null
    motherId: string
    monthId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    monthBlood: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    }
    admin: {
      id: string
      name: string
      email: string
      phone: string
      type: string
      healthPostId: string
    }
  }>
  monthName: string
}>()




const formattedData = computed(() => {
  return props.bloodData.map((item, index) => ({
    ...item,
    index: index + 1,
    formattedDate: new Date(item.date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    formattedCreatedAt: new Date(item.createdAt).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }))
})
</script>

<template>
  <div class="ml-8 border-l-4 border-blue-200 pl-6">
    <!-- Header dengan informasi bulan -->
    <div class="bg-blue-50 p-4 rounded-lg mb-4">
      <h4 class="font-semibold text-blue-800 mb-2">{{ monthName }}</h4>
      <p class="text-sm text-gray-600">Total {{ bloodData.length }} catatan konsumsi</p>
    </div>

    <!-- Detail Data Konsumsi -->
    <div class="bg-white rounded-lg border">
      <div class="font-bold p-4 bg-gray-50 border-b">Detail Konsumsi Tablet Darah</div>
      
      <div class="grid grid-cols-7 bg-gray-100 font-semibold p-3 border-b border-gray-300 text-sm">
        <div>No</div>
        <div>Tanggal</div>
        <div>Admin/Staff</div>
        <div>Catatan</div>
        <div>Dibuat</div>
      </div>
      
      <div v-if="!formattedData.length" class="text-center p-4 text-gray-500">
        Tidak ada data konsumsi yang tersedia.
      </div>
      
      <div v-else>
        <div
          v-for="item in formattedData"
          :key="item.id"
          class="grid grid-cols-7 p-3 border-b border-gray-200 hover:bg-gray-50 text-sm gap-2"
        >
          <div class="font-medium text-gray-600">{{ item.index }}</div>
          <div class="font-medium">{{ item.formattedDate }}</div>
          <div>
            <div class="font-medium">{{ item?.admin?.name || item.staffName}}</div>
            <div class="text-xs text-gray-500">{{ item?.admin?.type || item.staffJob }}</div>
          </div>
          <div class="text-gray-700">
            {{ item.note || '-' }}
          </div>
          <div class="text-xs text-gray-500">
            {{ item.formattedCreatedAt }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  align-items: center;
}

.grid > div {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>