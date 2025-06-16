<script setup lang="ts"></script>
<template>
  <div class="bg-white p-6 rounded-lg overflow-auto">
    <!-- Breadcrumb Navigation -->
    <!-- <div class="hidden md:flex justify-between items-center mb-6"> -->
    <div>
      <n-breadcrumb separator=">" class="mb-2">
        <div class="flex items-center space-x-1">
          <i-material-symbols:home class="text-lg"></i-material-symbols:home>
          <n-breadcrumb-item href="dashboard">Dashboard</n-breadcrumb-item>
          <n-breadcrumb-item>Imunisasi</n-breadcrumb-item>
        </div>
      </n-breadcrumb>
    </div>
    <!-- </div> -->

    <!-- Heading -->
    <!-- Table for Desktop -->
    <div class="hidden md:block bg-white rounded-lg overflow-auto">
      <!-- <div class="flex justify-between items-center mb-6"> -->
      <componen-user-table-immunization />
      <!-- <div class="flex items-center space-x-2">
        </div> -->
      <!-- </div> -->
    </div>
    <!-- Card for Mobile -->
    <div class="block md:hidden">
      <!-- Input Search -->
      <div class="relative flex items-center mb-4 gap-2">
        <componen-user-card-immunization />
        <!-- <n-input
          v-model:value="search"
          class="rounded-lg"
          placeholder="Search"
          type="text"
          @keydown.enter="onSearch"
        /> -->
        <i class="fas fa-search absolute left-3 top-3 text-gray-600"></i>
        <!-- <n-button type="primary" @click="onSearch" class="rounded-lg">
          <i-material-symbols:search></i-material-symbols:search>
        </n-button>
      </div>
      <n-button @click="showModal = true" class="mb-4 rounded-lg" type="primary"
        >Laporkan Stunting</n-button
      > -->

        <!-- Display each report as a card on mobile view -->
        <!-- <div
        v-for="(row, index) in itemsReport"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-md mb-4"
      >
        <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-300">
          <p class="text-sm font-normal bg-pink-100 px-2 rounded-lg py-2 gap-3">
            <span class="font-semibold text-gray-800">Tanggal</span>
            {{ row.createdAt ? formatDate(row.createdAt) : 'Tanggal tidak tersedia' }}
          </p> -->

        <!-- <DetailReportStunting :id="row.id" />
        </div> -->

        <!-- Flex container for Reporter, Child Name, and Child Address -->
        <!-- <div class="flex justify-between mb-2">
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Nama Pelapor</p>
            <p class="text-gray-600">{{ row.reporter }}</p>
          </div>
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Nama Anak</p>
            <p class="text-gray-600">{{ row.childName }}</p>
          </div>
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Alamat Anak</p>
            <p class="text-gray-600">{{ row.childAddress }}</p>
          </div>
        </div> -->

        <!-- Flex container for Gender and Phone Number -->
        <!-- <div class="flex">
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">Jenis Kelamin</p>
            <p class="text-gray-600">{{ row.gender }}</p>
          </div>
          <div class="w-1/3">
            <p class="text-gray-800 font-bold">No Telepon</p>
            <p class="text-gray-600">{{ row.phoneNumber }}</p>
          </div>
        </div> -->
      </div>
      <div>
        <!-- <n-pagination
          v-model:page="params.page"
          :page-count="reportData?.meta?.totalPage"
          class="mt-4"
        /> -->
      </div>
    </div>
    <div class="flex justify-center items-center mt-4"></div>
  </div>
</template>
<style scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
