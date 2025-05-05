<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import IIcOutlineMessage from '~icons/ic/outline-message'
import IcomoonFreePaste from '~icons/icomoon-free/paste'
import ILucideFileChartLine from '~icons/lucide/file-chart-line'
import IMaterialSymbolArticleOutline from '~icons/material-symbols/article-outline'
import IMaterialSymbolHomeOutline from '~icons/material-symbols/home-outline'
import IUilCalender from '~icons/uil/calender'

const router = useRouter()
const message = useMessage()
const emit = defineEmits(['close'])

const handleUpdateValue = (key: string) => {
  router.push(key)
  emit('close')
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  message.info('Berhasil keluar')
  router.push('/auth/admin-login')
}

const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: '/admin/dashboard',
    icon: () => <IMaterialSymbolHomeOutline class="text-xl" />
  },
  {
    label: 'Laporkan Stunting',
    key: '/admin/report-stunting',
    icon: () => <IIcOutlineMessage class="text-xl" />
  },
  {
    label: 'Pemeriksaan Ibu Hamil',
    key: '/admin/checkup-mother',
    icon: () => <IUilCalender class="text-xl" />
  },
  {
    label: 'Kesehatan Ibu',
    key: 'Kesehatan Ibu',
    icon: () => <IUilCalender class="text-xl" />,
    children: [
      {
        label: 'BMI Ibu Hamil',
        key: '/admin/data-child'
      },
      {
        label: 'Pantau Ibu Hamil',
        key: '/admin/data-healthpost'
      },
      {
        label: 'Pantau Ibu Nifas',
        key: '/admin/data-admin'
      },
      {
        label: 'Tablet Tambah Darah',
        key: '/admin/data-admin'
      },
      {
        label: 'Daftar Hadir Posyandu Ibu Hamil',
        key: '/admin/data-admin'
      }
    ]
  },
  {
    label: 'Pemeriksaan Bayi',
    key: '/admin/checkup-child',
    icon: () => <IMaterialSymbolArticleOutline class="text-xl" />
  },
  {
    label: 'Artikel',
    key: '/admin/article',
    icon: () => <IIcOutlineMessage class="text-xl" />
  },
  {
    label: 'Jadwal Posyandu',
    key: '/admin/schedule',
    icon: () => <IIcOutlineMessage class="text-xl" />
  },
  {
    label: 'Master Data',
    key: 'master data',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'Data Bayi',
        key: '/admin/data-child'
      },
      {
        label: 'Data Ibu',
        key: '/admin/data-mother'
      },
      {
        label: 'Data User Admin',
        key: '/admin/data-admin'
      }
    ]
  },
  {
    label: 'Imunisasi',
    key: '/admin/immunization',
    icon: () => <IcomoonFreePaste class="text-xl" />
  }
]
</script>

<template>
  <div class="flex h-screen">
    <div class="w-full bg-white border-l border-gray-300 ml-auto overflow-y-auto">
      <div class="flex items-center justify-between p-4 mb-8">
        <div @click="$emit('close')">
          <i-fe-arrow-left></i-fe-arrow-left>
        </div>
        <div class="flex items-center">
          <img src="/src/assets/images/Logo transparan catatsehat.png" alt="Logo" width="207" height="41" />
        </div>
      </div>

      <div class="flex justify-center flex-col py-5 px-3">
        <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
      </div>

      <div class="mt-auto p-4">
        <router-link
          to="/auth/logout-admin"
          @click="handleLogout"
          class="block p-4 text-gray-800 hover:bg-pink-200"
        >
          Keluar
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
