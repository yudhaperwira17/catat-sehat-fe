<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import IIcOutlineMessage from '~icons/ic/outline-message'
import ILucideFileChartLine from '~icons/lucide/file-chart-line'
import IMaterialSymbolArticleOutline from '~icons/material-symbols/article-outline'
import IMaterialSymbolHomeOutline from '~icons/material-symbols/home-outline'
import IUilCalender from '~icons/uil/calender'

const router = useRouter()

const handleUpdateValue = (key: string) => {
  router.push(key)
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
    label: 'Master Data',
    key: 'master data',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'Data Bayi',
        key: '/admin/data-child'
      },
      {
        label: 'Data User Admin',
        key: '/admin/data-admin'
      }
    ]
  }
]
</script>

<template>
  <aside
    class="hidden md:block fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 dark:bg-white dark:border-gray-200 z-10"
  >
    <div class="flex items-center justify-center mb-8 my-6">
      <router-link to="/admin/dashboard" class="flex items-center">
        <img
          src="/src/assets/images/Logo transparan catatsehat.png"
          alt="Logo"
          width="207"
          height="41"
        />
      </router-link>
    </div>
    <div class="flex justify-center flex-col py-5 px-3">
      <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
    </div>
  </aside>

  <main class="md:pl-64"></main>
</template>

<style scoped></style>
