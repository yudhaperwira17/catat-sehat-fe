<script setup lang="ts">



</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white">
    <div class="bg-white p-8 rounded-lg w-full max-w-md">
      <!-- Logo and Title -->
      <div class="flex flex-col items-center space-y-4 mb-6">
        <!-- SVG Logo -->
        <img src="@/assets/images/LOGO.png" alt="Logo" class="w-auto h-12" />
      </div>

      <!-- Form Content -->
      <h3 class="text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
        Data Lansia
      </h3>
      <p class="text-center font-medium leading-9 text-gray-900">
        Masukkan Data Diri Lansia
      </p>

      <form class="space-y-6 mt-10" action="#" method="POST">
        <!-- Add Member Button -->
        <div class="text-center">
          <RouterLink
            to="/auth/registration-elderly"
            class="flex items-center justify-center w-full rounded-md border-2 border-blue-600 bg-white text-blue-600 py-2 px-4 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:text-sm"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Tambah Data
          </RouterLink>
        </div>

        <!-- Space between buttons -->
        <div class="mt-8">
          <!-- Submit Button -->
          <div class="flex justify-center">
            <router-link to="/user/dashboard">
              <n-button type="primary">Mungkin nanti</n-button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
