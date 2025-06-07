

<script setup lang="ts">
</script>
<template>
  <div class="flex min-h-screen">
    <div class="flex-1 p-6">
      <header class="flex justify-between items-center mb-6">
        <div>
          <h1 class="sm:text-base md:text-2xl font-semibold">Laporan Stunting</h1>
          <p class="text-gray-600 sm:text-sm sm:font-normal">Informasi tentang laporan stunting</p>
        </div>
      </header>
      <div class="bg-white p-6 rounded-lg  mt-6 lg:block hidden">
        <AdminTableReport></AdminTableReport>
      </div>
      <!-- report stunting mobile -->
      <div class="flex flex-col justify-center lg:hidden gap-2">
        <admin-data-report-stunting></admin-data-report-stunting>
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>
