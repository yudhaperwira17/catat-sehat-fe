<script setup lang="ts"></script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="justify-center flex">
        <img
          src="/src/assets/images/Logo transparan catatsehat.png"
          alt="Logo"
          width="150"
          height="40"
        />
      </div>
      <img
        src="/src/assets/images/Shield.png"
        alt="Placeholder Image"
        class="w-full h-full object-cover"
      />
      <div class="flex flex-col items-center">
        <p class="text-base font-medium">Data Berhasil Dikirim</p>
        <p class="text-sm font-normal">Data Pemeriksaan berhasil dikirim ke sistem</p>
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: blank
</route>
