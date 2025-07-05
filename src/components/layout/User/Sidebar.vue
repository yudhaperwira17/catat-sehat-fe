<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IIcOutlineMessage from '~icons/ic/outline-message'
import ILucideFileChartLine from '~icons/lucide/file-chart-line'
import IMaterialSymbolArticleOutline from '~icons/material-symbols/article-outline'
import IMaterialSymbolHomeOutline from '~icons/material-symbols/home-outline'
import IUilCalender from '~icons/uil/calender'

const activeKey = ref<string>('')
const sidebarColor = ref<string>('bg-white')

const router = useRouter()
const route = useRoute()

const handleUpdateValue = (key: string) => {
  activeKey.value = key
  router.push(key)
}

const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: '/user/dashboard',
    icon: () => <IMaterialSymbolHomeOutline class="text-xl" />
  },
  {
    label: 'Kesehatan Anak',
    key: 'Kesehatan Anak',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'Pemeriksaan Anak',
        key: '/user/checkup-child'
      },
      {
        label: 'Imunisasi',
        key: '/user/immunization'
      },
      {
        label: 'Imunisasi Tambahan',
        key: '/user/immunization-optional'
      }
    ]
  },
  {
    label: 'Kesehatan Ibu',
    key: 'Kesehatan Ibu',
    icon: () => <ILucideFileChartLine class="text-xl" />,
    children: [
      {
        label: 'BMI Ibu Hamil',
        key: '/user/bmi-mother'
      },
      {
        label: 'Pantau Ibu Hamil',
        key: '/user/monitor-mom'
      },
      {
        label: 'Pantau Ibu Nifas',
        key: '/user/monitor-postpartum'
      },
      {
        label: 'Tablet Tambah Darah',
        key: '/user/blood-suplement'
      }
    ]
  },
  {
    label: 'Kesehatan lansia',
    key: '/user/checkup-elderly',
    icon: () => <ILucideFileChartLine class="text-xl" />
  },
  {
    label: 'Jadwal Posyandu',
    key: '/user/health-post',
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
onMounted(() => {
  activeKey.value = route.path
})

watch(
  () => route.path,
  (newPath) => {
    activeKey.value = newPath
  }
)
</script>
<template>
  <aside
    :class="`hidden md:block fixed top-0 left-0 w-64 h-screen ${sidebarColor} border-r border-gray-200 dark:border-gray-200 z-10 transition-colors duration-200`"
  >
    <div class="flex items-center justify-center mb-8 my-6">
      <router-link
        to="/user/dashboard"
        class="flex items-center"
        @click.prevent="handleUpdateValue('/user/dashboard')"
      >
        <img
          src="/src/assets/images/Logo transparan catatsehat.png"
          alt="Logo"
          width="207"
          height="41"
        />
      </router-link>
    </div>
    <div class="flex justify-center flex-col py-5 px-3">
      <n-menu :options="menuOptions" :value="activeKey" @update:value="handleUpdateValue" />
    </div>
  </aside>

  <main class="md:pl-64"></main>
</template>

<style scoped></style>
