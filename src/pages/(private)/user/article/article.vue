<script setup lang="ts">
//import { useReadArticle } from '@/services/article';
import { ref } from 'vue';

// Define the types for article data if necessary
interface Article {
  id: string
  image: string
  title: string
  description: string
}

interface PaginatedResponse<T> {
  data: T[]
}

// Declare and type reactive variables
const params = ref<{ page: number }>({
  page: 1
})

const search = ref<string>('')

// Fetch articles using the composable and type the data
const { data: articles } = useReadArticle(params)

// Method to search articles
const searchArticles = () => {
  // Add search logic here if necessary
  console.log('Searching for:', search.value)
}
</script>

<template>
  <div class="p-4">
    <div class="hidden md:flex justify-end items-center mb-4 shadow-md">
      <div class="flex items-center space-x-4">
        <i class="fas fa-bell text-xl"></i>
      </div>
    </div>
    <div class="bg-white p-6 rounded-lg">
      <h1 class="text-lg md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>
      <nav class="flex items-center text-gray-600 mt-4">
        <a class="flex items-center text-gray-600 hover:text-gray-800" href="#">
          <i class="fas fa-home mr-2"></i>
          Dashboard
        </a>
        <span class="mx-2">/</span>
        <span>Artikel</span>
      </nav>
    </div>
    <div class="bg-white p-6 mt-6 rounded-lg shadow-md">
      <h2 class="text-lg md:text-2xl font-semibold mb-4">Artikel Berita Kesehatan</h2>
      <div class="flex justify-between md:justify-end mb-6 w-full">
        <div class="w-full flex items-center mb-6 md:w-1/3">
          <n-input
            v-model:value="search"
            class="border border-gray-300 rounded-lg h-12 p-2 flex-grow"
            placeholder="Search"
            type="text"
          />
          <button
            class="bg-pink-500 text-white h-12 w-12 rounded-lg ml-2 flex items-center justify-center"
            @click="searchArticles"
          >
            <i-material-symbols:search></i-material-symbols:search>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-6">
        <div
          class="bg-white p-4 rounded-lg shadow-md"
          v-for="article in articles?.data"
          :key="article.id"
        >
          <n-image
            :src="article.image"
            alt="Illustration"
            class="rounded-t-l"
            height="400"
            width="600"
          />
          <h3 class="text-lg font-semibold mt-4">{{ article.title }}</h3>
          <p class="text-gray-600 truncate">{{ article.description }}</p>
          <a class="text-pink-500 mt-4 inline-block" :href="`/user/article/${article.id}`">
            Baca Selengkapnya
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
      <n-pagination v-model:page="params.page" />
    </div>
  </div>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
