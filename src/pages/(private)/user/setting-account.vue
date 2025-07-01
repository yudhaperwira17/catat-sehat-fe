<script setup lang="ts">
import Anak from '../user/setting-data-child.vue'
import DataLansia from "../user/setting-data-elderly.vue"
// import Keamanan from '../user/user-change-password.vue'

const handleRefetch = () => {
  console.log('Refetching data...')
  // Implement your refetch logic here
}
</script>

<template>
  <div>
    <div class="ml-6">
      <n-breadcrumb class="mb-2">
        <div class="flex items-center space-x-1">
          <i-material-symbols:home class="text-lg"></i-material-symbols:home>
          <n-breadcrumb-item href="dashboard" class="text-sm font-medium"
            >Dashboard</n-breadcrumb-item
          >
          <n-breadcrumb-item class="text-sm font-medium">Profil Pengguna</n-breadcrumb-item>
        </div>
      </n-breadcrumb>
    </div>

    <div></div>
    <div class="md:flex flex-col hidden pb-4 pl-6">
      <h1 class="text-base font-semibold">Pengaturan Akun</h1>
      <!-- <p class="text-sm font-normal text-gray-500">Silahkan manage akun anda disini</p> -->
    </div>

    <!-- tampilan mobile -->
    <div class="flex md:hidden pb-4">
      <div class="pl-6">
        <h3 class="text-base font-semibold">Pengaturan Akun</h3>
        <!-- <p class="text-sm font-normal text-gray-500">Silahkan manage akun anda disini</p> -->
      </div>
    </div>

    <div class="flex justify-start">
      <div class="w-full mx-6">
        <n-tabs type="segment" animated>
          <n-tab-pane class="text-sm font-medium" name="Data Akun" tab="Data Akun">
            <DataLansia id="data-akun" :onRefetch="handleRefetch" />
          </n-tab-pane>
          <n-tab-pane class="text-sm font-medium" name="Anak" tab="Anak">
            <Anak id="anak" :onRefetch="handleRefetch" />
          </n-tab-pane>
          <n-tab-pane class="text-sm font-medium" name="Keamanan" tab="Keamanan">
            <!-- <Keamanan id="keamanann" :onRefetch="handleRefetch" /> -->
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
