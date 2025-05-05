<script setup lang="ts">
// import CardChild from '@/components/admin/data/child-card.vue'
// import TableChild from '@/components/admin/table/child.vue'
</script>
<template>
  <div class="flex h-screen" id="app">
    <div class="flex-1 p-6">
      <header class="flex justify-between items-center mb-6">
        <div>
          <h1 class="md:-2xl sm:text-base font-semibold">Master data</h1>
          <p class="text-gray-600 sm:text-sm font-normal">
            Informasi tentang laporan tentang data ibu
          </p>
        </div>
      </header>
      <div class="bg-white lg:block hidden rounded-lg mt-6">
        <TableChild></TableChild>
      </div>
      <!-- mobile baby's data -->
      <div class="block lg:hidden bg-white mb-2">
        <!-- <CardChild></CardChild> -->
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>
