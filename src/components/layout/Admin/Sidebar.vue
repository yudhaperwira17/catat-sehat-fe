<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import IIcOutlineMessage from '~icons/ic/outline-message'
import IcomoonFreePaste from '~icons/icomoon-free/paste'
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
    label: 'Kesehatan Anak',
    key: 'Kesehatan Anak',
    icon: () => <IUilCalender class="text-xl" />,
    children: [
      {
        label: 'Pemeriksaan Anak',
        key: '/admin/checkup-child'
      },
      {
        label: 'Imunisasi',
        key: '/admin/checkup-child'
      }
    ]
  },

  {
    label: 'Kesehatan Ibu',
    key: 'Kesehatan Ibu',
    icon: () => <IUilCalender class="text-xl" />,
    children: [
      {
        label: 'BMI Ibu Hamil',
        key: '/admin/checkup-mother'
      },
      {
        label: 'Pantau Ibu Hamil',
        key: '/admin/monitor-mom'
      },
      {
        label: 'Pantau Ibu Nifas',
        key: '/admin/monitor-postpartum'
      },
      {
        label: 'Tablet Tambah Darah',
        key: '/admin/blood-suplement'
      },
      {
        label: 'Daftar Hadir Posyandu Ibu Hamil',
        key: '/admin/checkup-mother'
      }
    ]
  },
  {
    label: 'Kesehatan Lansia',
    key: '/admin/checkup-elderly',
    icon: () => <IMaterialSymbolArticleOutline class="text-xl" />
  },
  {
    label: 'Jadwal Posyandu',
    key: '/admin/schedule',
    icon: () => <IIcOutlineMessage class="text-xl" />
  },
  {
    label: 'Artikel',
    key: '/admin/article',
    icon: () => <IIcOutlineMessage class="text-xl" />
  },
  {
    label: 'Laporkan Stunting',
    key: '/admin/report-stunting',
    icon: () => <IcomoonFreePaste class="text-xl" />
  },
  {
    label: 'Master Data',
    key: 'master data',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'Data Admin',
        key: '/admin/data-admin'
      },
      {
        label: 'Data Anak',
        key: '/admin/data-child'
      },
      {
        label: 'Data Ibu',
        key: '/admin/data-mother'
      },
      {
        label: 'Data Lansia',
        key: '/admin/data-elderly'
      },
      {
        label: 'Data Skreening Paru',
        key: '/admin/data-lung'
      },
      {
        label: 'Data Posyandu',
        key: '/admin/data-healthpost'
      }
    ]
  }
]
</script>

<template>
  <aside
    class="overflow-auto hidden md:block fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 dark:bg-white dark:border-gray-200 z-10"
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
