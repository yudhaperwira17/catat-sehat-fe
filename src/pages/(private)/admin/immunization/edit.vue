<script setup lang="ts">
import { NButton, NCard, NForm, NFormItem, NInput, NTag } from 'naive-ui'
import { ref } from 'vue'

interface RowData {
  age: string
  typeofVaccine: string
  note: string
  date: string
  status: string[]
}

const data = ref<RowData[]>([
  {
    age: '0-24 Jam',
    typeofVaccine: 'Hepatitis B',
    note: '',
    date: '2024-11-01',
    status: ['selesai']
  },
  {
    age: '1 Bulan',
    typeofVaccine: 'BCG',
    note: '',
    date: '2024-10-15',
    status: ['sedang berlangsung']
  },
  {
    age: '0-1 Bulan',
    typeofVaccine: 'Polio',
    note: '',
    date: '2024-09-10',
    status: ['belum dilakukan']
  },
  {
    age: '2 Bulan',
    typeofVaccine: 'Polio',
    note: '',
    date: '2024-11-10',
    status: ['kejar']
  }
])

// const vaksinData = ref([])
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <!-- <div class="flex justify-center items-center  bg-gray-100"> -->
    <!-- Card Utama -->
    <NCard class="max-w-md rounded-lg shadow-md p-6">
      <!-- Content -->
      <!-- <NCard class="rounded-lg shadow-md p-6  max-w-md"> -->
      <div class="bg-white flex flex-col items-center space-y-4">
        <!-- SVG Logo -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="39"
          height="36"
          viewBox="0 0 39 36"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M19.4954 1.00529C18.1978 0.0395943 16.5666 -0.246903 15.0174 0.217748L4.53846 3.36137C2.37968 4.0094 0.928406 5.95839 0.928406 8.21314V30.6102C0.928406 32.2275 1.67242 33.7085 2.96992 34.6727C4.26766 35.6385 5.90066 35.9249 7.44802 35.4603L15.2706 33.1129C15.026 32.3061 14.9021 31.4642 14.9021 30.6102V20.4387C14.9021 18.3027 15.681 16.2628 17.0991 14.6979C18.14 13.5451 19.4902 12.6947 20.9991 12.2406L21.537 12.087V5.06941C21.537 3.45211 20.793 1.9711 19.4953 1.00529H19.4954Z"
            fill="#E74694"
          />
          <path
            d="M39.0021 17.2951V27.4666C39.0021 29.7197 37.5525 31.6705 35.3921 32.3167L24.9131 35.4605C24.4276 35.6071 23.9334 35.6788 23.4444 35.6788C22.3736 35.6788 21.3258 35.3366 20.435 34.6728C20.028 34.369 19.6753 34.0179 19.3853 33.625C19.0326 33.1534 18.7688 32.6277 18.6029 32.0636C18.6011 32.0636 18.5995 32.0636 18.5977 32.0652L18.6011 32.0618C18.4668 31.5989 18.3934 31.1117 18.3934 30.6104V20.4388C18.3934 19.3944 18.7042 18.4147 19.2527 17.6008C19.8011 16.7868 20.587 16.1372 21.5371 15.7512C21.6891 15.6901 21.8445 15.634 22.0035 15.5871L23.2855 15.2028L32.4826 12.4433C34.0317 11.9787 35.663 12.2652 36.9606 13.231C38.2583 14.1968 39.0022 15.6778 39.0022 17.2951H39.0021Z"
            fill="#E74694"
          />
        </svg>

        <!-- Title Text -->
        <h2 class="text-xl font-bold">Stunting Apps</h2>
        <p class="text-gray-700 font-medium text-center">Penambahan Data Imunisasi</p>
        <p class="text-gray-500 text-sm text-center pb-6">
          Silahkan mengisikan data pada form di bawah ini
        </p>

        <!-- Form -->
        <NForm class="mt-6 w-full flex flex-row gap-4" ref="formRef">
          <!-- Nama Ibu -->
          <NFormItem label="Nama Ibu">
            <NInput placeholder="Masukan Nama Ibu" required />
          </NFormItem>

          <!-- Nama Anak -->
          <NFormItem label="Nama Anak">
            <NInput placeholder="Masukan Nama Anak" required />
          </NFormItem>
        </NForm>

        <!-- Horizontal Line -->
        <hr class="border-t border-gray-300 w-full mt-4" />
      </div>

      <div class="flex flex-row justify-between pt-4">
        <p>Daftar Vaksin</p>
        <p class="text-pink-600">+ Tambah Daftar Vaksin</p>
      </div>

      <!-- Daftar Vaksin -->
      <div>
        <div v-if="data.length === 0" class="text-center mt-6 text-gray-900">
          <img src="/public/EmptyState.png" class="mx-auto w-48 mt-4" alt="empty-state" />
          <p class="text-base font-medium">Tidak ada vaksin</p>
          <p class="tex-sm font-normal">Anda Belum Menambahkan Jenis Vaksin</p>
        </div>
        <div v-else class="mt-4 rounded-lg drop-shadow-md grid md:grid-cols-2 gap-4">
          <div v-for="(vaksin, index) in data" :key="index">
            <n-card class="bg-white mx-2 shadow-md rounded-lg my-6">
              <div class="flex flex-row justify-between my-3">
                <div class="flex flex-row rounded-lg px-2">
                  <!-- <p class="text-xs font-bold">Jenis Vaksin</p> -->
                  <NTag>Vaksin {{ index + 1 }}</NTag>
                </div>
                <div class="flex flex-row gap-2">
                  <div class="rounded-lg px-2">
                    <i-mage:dots></i-mage:dots>
                  </div>
                </div>
              </div>
              <hr />
              <div class="flex flex-col my-2">
                <div class="flex flex-col justify-between space-y-3 my-3">
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Nama Ibu</p>
                    <p class="text-xs font-normal">{{ vaksin.typeofVaccine }}</p>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Anak Ke</p>
                    <p class="text-xs font-normal">{{ vaksin.age }}</p>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Tanggal Pemberian</p>
                    <p class="text-xs font-normal">{{ vaksin.date }}</p>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p class="text-xs font-bold">Catatan</p>
                    <p class="text-xs font-normal">{{ vaksin.note || '-' }}</p>
                  </div>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>
      <NButton type="primary" class="w-full mt-4"> Kirim </NButton>
    </NCard>
  </div>
</template>
<route lang="yaml">
meta:
  layout: blank
</route>
