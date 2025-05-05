<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import IIcOutlineMessage from '~icons/ic/outline-message'
import ILucideFileChartLine from '~icons/lucide/file-chart-line'
import IMaterialSymbolArticleOutline from '~icons/material-symbols/article-outline'
import IMaterialSymbolHomeOutline from '~icons/material-symbols/home-outline'
import IUilCalender from '~icons/uil/calender'

const router = useRouter()
const emit = defineEmits(['close'])

const message = useMessage()
const handleUpdateValue = (key: string) => {
  router.push(key)
  emit('close')
}

const handleLogout = () => {
  localStorage.removeItem('userToken')
  message.info('Berhasil keluar')
  router.push('/auth/user-login')
}
const handleSetting = () => {
  router.push('/user/setting-account')
  emit('close')
}
const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: '/user/dashboard',
    icon: () => <IMaterialSymbolHomeOutline class="text-xl" />
  },
  {
    label: 'Kesehatan Ibu',
    key: 'Kesehatan',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'BMI Ibu Hamil',
        key: '/user/checkup'
      },
      {
        label: 'Pantau Kesehatan Ibu Hamil',
        key: '/user/health-mom'
      },
      {
        label: 'Pantau Kesehatan Ibu Nifas',
        key: '/user/history-mom'
      },
      {
        label: 'Tablet Tambah Darah',
        key: '/user/history-mom'
      }
    ]
  },
  {
    label: 'Kesehatan Anak',
    key: 'Kesehatan',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'BMI Anak',
        key: '/user/checkup'
      },
      {
        label: 'Imunisasi',
        key: '/user/health-mom'
      }
    ]
  },
  {
    label: 'Kesehatan lansia',
    key: 'Kesehatan',
    icon: () => <ILucideFileChartLine class="text-xl" />,
  },
  {
    label: 'Posyandu',
    key: '/user/schedule',
    icon: () => <IUilCalender class="text-xl" />
  },
  {
    label: 'Artikel',
    key: '/user/article',
    icon: () => <IMaterialSymbolArticleOutline class="text-xl" />
  },
  {
    label: 'Laporkan Stunting',
    key: '/user/report-stunting',
    icon: () => <IIcOutlineMessage class="text-xl" />
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
          <img
            src="/src/assets/images/Logo transparan catatsehat.png"
            alt="Logo"
            width="207"
            height="41"
          />
        </div>
      </div>

      <div class="flex justify-center flex-col py-5 px-3">
        <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
      </div>
      <div class="mt-auto p-4">
        <router-link
          to="/user/setting-account"
          @click="handleSetting"
          role="button"
          class="block p-4 text-gray-800 hover:bg-pink-200"
        >
          Pengaturan
        </router-link>
        <router-link
          to="/auth/logout"
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
