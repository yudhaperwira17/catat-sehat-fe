<script setup lang="ts">
import router from '@/router';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const message = useMessage()
const selectedCard = ref<string>('')

const handleCardClick = (card: string) => {
  selectedCard.value = card
  message.info(`Anda memilih: ${card}`)
}
const code = route.query.code as string;
const handleSubmit = () => {
  if (!selectedCard.value) {
    message.error('Silahkan pilih salah satu pemeriksaan terlebih dahulu!')
    return
  }

  if (selectedCard.value === 'health-checkup') {
    router.push(`/public/checkup-child/${code}`)
  } else if (selectedCard.value === 'immunization') {
    router.push(`/public/immunization/${code}`)
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div class="flex flex-col justify-center gap-2 items-center mb-6">
        <div class="flex flex-row items-center justify-center gap-2">
          <img
          src="/src/assets/images/LOGO.png"
          alt="Logo"
          width="39"
          height="36"
        />
          <p class="text-sm font-bold">Catat Sehat</p>
          <div>
            </div>
        </div>
        <p class="text-base font-semibold">Pemeriksaan</p>
        <p class="text-xs font-normal">Silahkan Memilih Melakukan Pemeriksaan</p>
      </div>

      <div class="flex flex-col md:flex-row gap-4 px-6 pb-6">
        <NCard
          class="flex flex-col justify-center rounded-lg drop-shadow-md text-center cursor-pointer"
          :style="{ borderColor: selectedCard === 'health-checkup' ? '#1678F2' : '' }"
          @click="handleCardClick('health-checkup')"
        >
          <img src="/src/assets/images/pemeriksaan1.png" />
          <p class="text-xs font-bold">Pemeriksaan Ibu Hamil</p>
          <p class="text-xs font-normal">Petugas melakukan pemeriksaan ibu</p>
        </NCard>

        <!-- Data Imunisasi -->
        <NCard
          class="flex flex-col justify-center rounded-lg drop-shadow-md text-center cursor-pointer"
          :style="{ borderColor: selectedCard === 'immunization' ? '#1678F2' : '' }"
          @click="handleCardClick('immunization')"
        >
          <img src="/src/assets/images/pemeriksaan2.png" />
          <p class="text-xs font-bold">Pencatatan Tablet Tambah Darah Ibu</p>
          <p class="text-xs font-normal">Petugas melakukan pencatata ttd</p>
        </NCard>
      </div>

      <!-- Tombol Lanjutkan -->
      <n-button
        type="primary"
        class="w-full flex justify-center"
        @click="handleSubmit"
      >
        Lanjutkan
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
