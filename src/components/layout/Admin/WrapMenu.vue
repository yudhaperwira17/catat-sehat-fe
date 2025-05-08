<script setup lang="ts">
import MenuMobile from '@/components/layout/Admin/MenuMobile.vue';
import { ref } from 'vue';

const isOpen = ref(false)
</script>

<template>
  <div v-if="isOpen" class="w-full h-screen bg-white fixed z-50">
    <MenuMobile @close="isOpen = !isOpen" />
  </div>
  <div class="mt-4">
    <div class="flex-1 max-w-full mt-6">
      <div class="flex items-center justify-between mb-2 md:hidden">
        <div class="flex flex-row items-center px-2 space-x-2">
          <img
            src="/src/assets/images/Logo transparan catatsehat.png"
            alt="Logo"
            width="207"
            height="41"
          />
        </div>
        <div @click="isOpen = !isOpen" class="mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M3 6h18M3 12h18M3 18h18"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
