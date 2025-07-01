<script setup lang="ts">
//import { useReadArticleById } from '@/services/article';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// Mengambil id artikel dari route
const route = useRoute();
const articleId = ref(route.params.id as string); // Make sure articleId is reactive

// Fetch artikel berdasarkan ID
const { data: article } = useReadArticleById(articleId); // Call the service with articleId

// Update articleId if route changes
watch(() => route.params.id, (newId) => {
  articleId.value = newId as string;
});

// Sample data for the related articles
const relatedArticles = ref([
  {
    image:
      'https://storage.googleapis.com/a1aa/image/6fMUiedn2KuQu0kOLrkMn9ffb2PFbrbFb8PZw1fDHLDRgIlcC.jpg',
    title: 'Pentingnya Gosok Gigi',
    description: 'Here are the biggest enterprise technology acquisitions of 2021.'
  },
  {
    image:
      'https://storage.googleapis.com/a1aa/image/hhXFER66FjY6Pl5eDZgKdUWw2Cezb4d52duXHtzt10rEEpkTA.jpg',
    title: 'Pentingnya ASI',
    description: 'Here are the biggest enterprise technology acquisitions of 2021.'
  },
  {
    image:
      'https://storage.googleapis.com/a1aa/image/6fMUiedn2KuQu0kOLrkMn9ffb2PFbrbFb8PZw1fDHLDRgIlcC.jpg',
    title: 'Pentingnya Gosok Gigi',
    description: 'Here are the biggest enterprise technology acquisitions of 2021.'
  },
  {
    image:
      'https://storage.googleapis.com/a1aa/image/hhXFER66FjY6Pl5eDZgKdUWw2Cezb4d52duXHtzt10rEEpkTA.jpg',
    title: 'Pentingnya ASI',
    description: 'Here are the biggest enterprise technology acquisitions of 2021.'
  }
]);
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold">Artikel Berita Kesehatan</h1>
      </div>
    </div>

    <!-- Debugging: show the article data -->
    <!-- <pre>{{ article }}</pre> -->

    <div class="container w-full mx-auto px-2 py-6">
      <div class="flex space-x-6">
        <!-- Konten Artikel -->
        <div class="w-full md:w-3/4 h-full bg-white px-2">
          <div class="mb-4 my-6">
            <nav class="text-sm mb-4">
              <a class="text-gray-500" href="#">Dashboard</a>
              <span class="text-gray-500">/</span>
              <a class="text-gray-500" href="#">Artikel</a>
              <span class="text-gray-500">/</span>
              <span class="text-gray-700">Detail</span>
            </nav>
          </div>

          <n-image
            v-if="article?.image"
            :src="article.image"
            alt="Placeholder Image"
            class="w-full h-64 object-cover mb-4"
          />

          <div class="text-sm text-black mb-4">
            By
            <a class="text-black" href="#">John Doe</a>
            <span class="mx-1">|</span>
            12 Januari 2024
          </div>

          <h2 class="text-2xl font-semibold mb-4">
            {{ article?.title || 'Judul Tidak Di Temukan' }}
          </h2>

          <p class="text-gray-700 mb-4">
            {{ article?.description || 'Deskripsi Tidak Di Temukan' }}
          </p>
        </div>

        <!-- Sidebar Artikel Terkait -->
        <div class="hidden md:block w-1/4">
          <div class="bg-white shadow-sm rounded-lg p-2 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Artikel</h3>
              <a class="text-gray-500 text-sm" href="#">Lihat Semua</a>
            </div>

            <div class="space-y-4">
              <div v-for="(article, index) in relatedArticles" :key="index" class="flex space-x-4">
                <div class="flex flex-col rounded-lg shadow-md items-center">
                  <!-- Membungkus gambar dan teks -->
                  <img
                    :src="article.image"
                    alt="Illustration"
                    class="w-full h-32 rounded-lg mb-2 object-cover"
                    height="100"
                    width="100"
                  />
                  <div class="ml-4 min-h-32 item">
                    <!-- Mengatur teks agar terpusat -->
                    <div>
                      <h4 class="text-sm font-semibold">{{ article.title }}</h4>
                      <p class="text-xs text-gray-500">{{ article.description }}</p>
                    </div>
                    <div>
                      <a class="text-pink-500 text-xs" href="#">
                        Baca Selengkapnya
                        <i-lsicon:arrow-right-filled></i-lsicon:arrow-right-filled>
                      </a>
                    </div>
                  </div>
                </div>
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
