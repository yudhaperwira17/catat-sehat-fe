<script setup lang="ts">
import { useArticleDetail, useArticleList, type ArticleResponse } from '@/services/article';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { NImage } from 'naive-ui';

// Retrieve article id from route
const route = useRoute();
const articleId = ref(route.params.id as string); // Make sure articleId is reactive

// Fetch artikel berdasarkan ID
const { data: article } = useArticleDetail(computed(() => articleId.value)); // Call the service with articleId
const articleData = computed(() => article.value);

// Update articleId if route changes
watch(() => route.params.id, (newId) => {
  articleId.value = newId as string;
});

// Function to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Tanggal tidak ditemukan';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Memeriksa apakah tanggal valid
      return 'Format tanggal salah'; 
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Format tanggal salah';
  }
};

const articleListParams = ref({}); // Define params for useArticleList

// Fetch related articles
const { data: relatedArticlesData } = useArticleList(computed(() => ({ limit: 3 })));

// Use the fetched data for related articles
const relatedArticles = computed(() => {
  if (!relatedArticlesData.value) return [];
  // Filter out current article and limit to 3 articles
  return relatedArticlesData.value?.data
  .filter((article) => article.id !== articleId.value)
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Breadcrumb at the very top -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="/user/dashboard" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <a href="/user/article" class="hover:underline">Artikel</a>
        <span class="mx-1">></span>
        <span>Detail</span>
      </nav>
    </div>

    <div class="container mx-auto px-0 py-6 flex flex-col md:flex-row md:space-x-6">
      <!-- Main Article Content -->
      <div class="w-full md:w-3/4">
        <n-image
          v-if="articleData?.filePicture?.path"
          :src="articleData.filePicture.path"
          alt="Article Image"
          class="w-full h-64 object-cover rounded-md mb-4"
        />

        <div class="text-sm text-gray-500 mb-2">
          <span class="text-black">{{ articleData?.newsMaker || 'Penulis Tidak Ditemukan' }}</span>
          <span class="mx-1">|</span> {{ formatDate(articleData?.createdAt) }}
        </div>
        <h2 class="text-2xl font-bold mb-4">{{ articleData?.title || 'Judul Tidak Ditemukan' }}</h2>

        <p class="text-gray-700 leading-relaxed">
          {{ articleData?.content || 'Deskripsi Tidak Ditemukan' }}
        </p>
      </div>

      <!-- Sidebar Artikel Terkait -->
      <div class="w-full md:w-1/4 mt-6 md:mt-0">
        <div class="bg-white shadow-md rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Artikel</h3>
            <a class="text-sm text-blue-600 hover:underline" href="/user/article">Lihat Semua</a>
          </div>

          <div class="space-y-4">
            <div
              v-for="related in relatedArticles"
              :key="related.id"
              class="bg-white border rounded-lg overflow-hidden shadow-sm"
            >
              <img
                :src="related.filePicture?.path || '/placeholder-image.jpg'"
                alt="Gambar"
                class="w-full h-32 object-cover"
              />
              <div class="p-3">
                <h4 class="text-sm font-semibold mb-1">
                  {{ related.title || 'Judul Tidak Ditemukan' }}
                </h4>
                <p class="text-xs text-gray-500 line-clamp-2 mb-2">
                  {{ related.content || 'Deskripsi Tidak Ditemukan' }}
                </p>
                <a :href="`/user/article/${related.id}`" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Baca Selengkapnya
                  <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: true
</route>
