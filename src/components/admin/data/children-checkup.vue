<script setup lang="ts">
import DetailCheckupChild from '@/components/componen-admin/detail-checkup-child.vue';
import { computed } from 'vue';

const props = defineProps<{
  id: string
  date: string
  time: string
  status: string
  name: string
  healthpost: string | undefined
  officer: string | undefined
  fileDiagnosedId: string | undefined
}>()

const statusMapper: Record<string, string> = {
  UNVERIFIED: 'Belum Verifikasi',
  VERIFIED: 'Verifikasi'
}

const statusClass = computed(() => {
  const status = statusMapper[String(props.status)]
  switch (status) {
    case 'Belum Verifikasi':
      return 'bg-red-100 text-red-800'
    case 'Verifikasi':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})
</script>
<template>
  <n-card class="bg-white mx-2 shadow-md rounded-lg my-6">
    <div class="flex flex-row items-center justify-between my-3">
      <div class="flex flex-row bg-pink-50 rounded-lg space-x-3 px-2">
        <p class="text-xs font-bold text-grey-800">{{ time || '-' }}</p>
        <!-- <p class="text-sm font-normal text-gray-500">{{ date }}</p> -->
      </div>
      <div :class="['rounded-lg py-1 px-2', statusClass]">
        <p class="text-xs font-medium">{{ statusMapper[String(status)] }}</p>
      </div>
      <DetailCheckupChild :id="id" />
    </div>
    <hr />
    <div class="flex flex-col my-2">
      <div class="flex flex-row justify-between my-3 space-x-4">
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Nama Bayi</p>
          <p class="text-xs font-normal">{{ name }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Posyandu</p>
          <p class="text-xs font-normal">{{ healthpost }}</p>
        </div>
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Petugas</p>
          <p class="text-xs font-normal">{{ officer }}</p>
        </div>
      </div>
      <div class="flex flex-row my-3 space-x-4">
        <div class="flex flex-col flex-1">
          <p class="text-xs font-bold">Diagnosa</p>
          <p class="text-sm font-normal">
            <template v-if="fileDiagnosedId">
              <a
                :href="fileDiagnosedId"
                target="_blank"
                rel="noopener noreferrer"
                download
                class="text-blue-500 hover:underline"
              >
                Surat Rujukan
              </a>
            </template>
            <template v-else>
              <span class="text-gray-500">Tidak Ada File</span>
            </template>
          </p>
        </div>
      </div>
    </div>
  </n-card>
</template>
