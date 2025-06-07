<script setup lang="ts">
import { useReadArticleById, useReadArticle } from '@/services/article';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { NImage } from 'naive-ui';

// Retrieve article id from route
const route = useRoute();
const articleId = ref(route.params.id as string);

// Fetch articles by ID
const { data: articleData } = useReadArticleById(articleId);

// Update articleId if route changes
watch(() => route.params.id, (newId) => {
  articleId.value = newId as string;
});

// Function to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Tanggal tidak ditemukan';
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Format tanggal salah';
  }
};

// Fetch related articles
// This assumes useReadArticle can be used to fetch related articles based on certain parameters.
// You might need to adjust the parameters or use a different service function if available.
const relatedArticlesParams = computed(() => ({
  // Add parameters here to filter related articles, e.g., categoryId: articleData.value?.categoryId
  limit: 3, // Limit to 3 related articles
  excludeId: articleId.value // Exclude the current article
}));

const { data: relatedArticlesData } = useReadArticle(relatedArticlesParams);

// Use the fetched data for related articles
const relatedArticles = computed(() => relatedArticlesData.value?.data || []);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Breadcrumb at the very top -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <a href="/admin/dashboard" class="hover:underline">Dashboard</a>
        <span class="mx-1">></span>
        <a href="/admin/article" class="hover:underline">Artikel</a>
        <span class="mx-1">></span>
        <span>Detail</span>
      </nav>
    </div>

    <div class="container mx-auto px-0 py-6 flex flex-col md:flex-row md:space-x-6">
      <!-- Main Article Content -->
      <div class="w-full md:w-3/4">
        <n-image
          v-if="articleData?.image"
          :src="articleData.image"
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
            <a class="text-sm text-blue-600 hover:underline" href="/admin/article">Lihat Semua</a>
          </div>

          <div class="space-y-4">
            <div
              v-for="(related, index) in relatedArticles"
              :key="index"
              class="bg-white border rounded-lg overflow-hidden shadow-sm"
            >
              <img
                :src="related.image"
                alt="Gambar"
                class="w-full h-32 object-cover"
              />
              <div class="p-3">
                <h4 class="text-sm font-semibold mb-1">
                  {{ related.title }}
                </h4>
                <p class="text-xs text-gray-500 line-clamp-2 mb-2">
                  {{ related.description }}
                </p>
                <a :href="`/admin/article/${related.id}`" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
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
  