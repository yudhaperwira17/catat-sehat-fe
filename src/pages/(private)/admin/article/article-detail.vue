<script setup lang="ts">
// import { useReadArticleById } from '@/services/article';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// Mengambil id artikel dari route
const route = useRoute();
const articleId = ref(route.params.id as string);

// Fetch artikel berdasarkan ID
// const { data: article } = useReadArticleById(articleId);

const article = ref({
  id: '1',
  title: 'Pentingnya Gosok Gigi',
  image: 'https://cdn.dribbble.com/userupload/4044662/file/original-18733ff58b89f44c46061a6ffb2b0e59.png?resize=800x400',
  content: `Lorem ipsum dolor sit amet consectetur. Faucibus risus adipiscing amet nibh. 
  Luctus ac fringilla urna mauris elit vitae sed turpis ultrices. Ligula ut dis mi vitae id platea adipiscing. 
  Commodo ut dolor penatibus diam vestibulum nibh. Sit eget dolor eget eu neque sit dis non. 
  Id eget semper augue a aliquam tortor. Volutpat tempus in eu libero cum.`
});

// Update articleId if route changes
watch(() => route.params.id, (newId) => {
  articleId.value = newId as string;
});

// Artikel terkait (dummy)
const relatedArticles = ref([
  {
    image:
      'https://storage.googleapis.com/a1aa/image/6fMUiedn2KuQu0kOLrkMn9ffb2PFbrbFb8PZw1fDHLDRgIlcC.jpg',
    title: 'Pentingnya Gosok Gigi',
    content: 'Here are the biggest enterprise technology acquisitions of 2021.'
  },
  {
    image:
      'https://storage.googleapis.com/a1aa/image/hhXFER66FjY6Pl5eDZgKdUWw2Cezb4d52duXHtzt10rEEpkTA.jpg',
    title: 'Pentingnya ASI',
    content: 'Here are the biggest enterprise technology acquisitions of 2021.'
  },
  {
    image:
      'https://storage.googleapis.com/a1aa/image/6fMUiedn2KuQu0kOLrkMn9ffb2PFbrbFb8PZw1fDHLDRgIlcC.jpg',
    title: 'Pentingnya Gosok Gigi',
    content: 'Here are the biggest enterprise technology acquisitions of 2021.'
  }
]);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6"></div>
        <h1 class="text-xl md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>

    <!-- Konten -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row md:space-x-6">
        <!-- Konten Artikel -->
        <div class="w-full md:w-3/4">
          <div class="mb-6">
            <nav class="text-sm text-gray-500 mb-4 space-x-1">
              <a href="#">Dashboard</a><span>></span>
              <a href="#">Artikel</a><span>></span>
              <span class="text-gray-700">Detail</span>
            </nav>
          </div>

          <!-- Gambar -->
          <n-image
            v-if="article?.image"
            :src="article.image"
            alt="Article Image"
            class="w-full h-64 object-cover rounded-md mb-4"
          />

          <!-- Meta & Judul -->
          <div class="text-sm text-gray-500 mb-2">
            By <span class="text-black">John</span>
            <span class="mx-1">|</span> 16 April 2025
          </div>
          <h2 class="text-2xl font-bold mb-4">{{ article?.title || 'Judul Tidak Ditemukan' }}</h2>

          <!-- Deskripsi -->
          <p class="text-gray-700 leading-relaxed">
            {{ article?.content || 'Deskripsi Tidak Ditemukan' }}
          </p>
        </div>

        <!-- Sidebar Artikel Terkait -->
        <div class="hidden md:block w-full md:w-1/4 mt-8 md:mt-0">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Artikel</h3>
              <a class="text-sm text-[#1678F2] hover:underline" href="#">Lihat Semua</a>
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
                    {{ related.content }}
                  </p>
                  <a href="#" class="text-xs text-[#1678F2] hover:underline flex items-center gap-1">
                    Baca Selengkapnya
                    <i-lsicon:arrow-right-filled />
                  </a>
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
