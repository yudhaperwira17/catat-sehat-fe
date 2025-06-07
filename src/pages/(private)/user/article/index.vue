<script setup lang="ts">
import { useReadArticle } from '@/services/article'
import { ref } from 'vue'
import { NInput, NButton, NIcon, NPagination } from 'naive-ui';
import { Search } from '@vicons/ionicons5';

interface Article {
  id: string
  image: string
  title: string
  content: string
}

interface PaginatedResponse<T> {
  data: T[]
}

const params = ref<{ page: number }>({ page: 1 })
const search = ref<string>('')

const { data: articles } = useReadArticle(params)

const searchArticles = () => {
  console.log('Searching for:', search.value)
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Top Header with Breadcrumb -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="#" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <span>Artikel</span>
      </nav>
    </div>

    <!-- Second Heading and Search Bar -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Artikel Berita Kesehatan</h2>
      <div class="flex items-center">
        <n-input
          v-model:value="search"
          type="text"
          placeholder="Search"
          clearable
          class="w-64"
        >
          <template #prefix>
            <n-icon size="18">
              <Search />
            </n-icon>
          </template>
        </n-input>
        <n-button
          @click="searchArticles"
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
          :src="article.image"
          alt="Gambar Artikel"
          class="w-full h-36 object-cover"
        />
        <div class="p-4">
          <h3 class="text-sm font-semibold mb-1 truncate">{{ article.title }}</h3>
          <p class="text-xs text-gray-500 mb-2 truncate">
            {{ article.content }}
          </p>
          <a
            :href="`/user/article/${article.id}`"
            class="text-sm text-blue-500 flex items-center gap-1 hover:underline"
          >
            Baca Selengkapnya
            <i-lsicon:arrow-right-filled />
          </a>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <n-pagination v-model:page="params.page" :item-count="articles?.meta?.totalItems" />
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
