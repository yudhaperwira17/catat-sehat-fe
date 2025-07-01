<script setup lang="ts">
import { useArticleList} from '@/services/article'
import { ref } from 'vue'
import { NInput, NButton, NIcon, NPagination } from 'naive-ui'
import { Search } from '@vicons/ionicons5'

const params = ref({
  page: 1,
  limit: 10,
  search: ''
})

const { data: articles, refetch } = useArticleList(params)

const handleSearch = () => {
  params.value.page = 1 // Reset page when searching
  refetch()
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Top Header with Breadcrumb -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <router-link to="/user/dashboard" class="hover:underline">Dashboard</router-link>

        <span class="mx-1">></span>
        <span>Artikel</span>
      </nav>
    </div>

    <!-- Second Heading and Search Bar -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Artikel Berita Kesehatan</h2>
      <div class="flex items-center">
        <n-input
          v-model:value="params.search"
          type="text"
          placeholder="Cari"
          clearable
          class="w-64 rounded-md"
          @keydown.enter="handleSearch"
        >
          <template #prefix>
            <n-icon size="18">
              <Search />
            </n-icon>
          </template>
        </n-input>
        <n-button
          @click="handleSearch"
          type="primary"
          class="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 rounded-md ml-2"
        >
          <i-material-symbols:search />
        </n-button>
      </div>
    </div>

    <!-- Grid Artikel -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
      <div
        v-for="article in articles?.data"
        :key="article.id"
        class="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-all"
      >
        <img
          :src="article.image?.path || '/placeholder-image.jpg'"
          alt="Gambar Artikel"
          class="w-full h-36 object-cover"
        />
        <div class="p-4">
          <h3 class="text-sm font-semibold mb-1 truncate">
            {{ article.title || 'Judul Tidak Ditemukan' }}
          </h3>
          <p class="text-xs text-gray-500 mb-2 truncate">
            {{ article.content || 'Deskripsi Tidak Ditemukan' }}
          </p>
          <router-link
            :to="`/user/article/${article.id}`"
            class="text-sm text-blue-500 flex items-center gap-1 hover:underline"
          >
            Baca Selengkapnya
            <i-lsicon:arrow-right-filled />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <n-pagination v-model:page="params.page" :item-count="articles?.meta?.totalItems || 0" />
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
