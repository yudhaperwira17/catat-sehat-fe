<script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    NButton,
    NInput,
    NIcon,
    NPagination
  } from 'naive-ui';
  import { Search } from '@vicons/ionicons5';
  
  interface Article {
    id: string;
    image: string;
    title: string;
    content: string;
  }
  
  interface PaginatedResponse<T> {
    data: T[];
  }
  
  const page = ref(1);
  const pageSize = 4; // Show 4 items per page
  const search = ref<string>('');
  
  // Article data simulation
  const allArticles = ref<PaginatedResponse<Article>>({
    data: Array.from({ length: 4 }, (_, i) => ({
      id: `${i + 1}`,
      image: 'https://cdn.dribbble.com/userupload/4044662/file/original-18733ff58b89f44c46061a6ffb2b0e59.png?resize=400x300',
      title: `Artikel Kesehatan ${i + 1}`,
      content:
        'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    })),
  });
  
  // Computed for pagination
  const paginatedArticles = computed(() => {
    const start = (page.value - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: allArticles.value.data.slice(start, end)
    };
  });
  
  const searchArticles = () => {
    console.log('Searching for:', search.value);
  };
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-semibold">Artikel Berita Kesehatan</h1>
        <nav class="text-sm text-gray-500 mt-2">
                  <router-link to="/admin/dashboard" class="hover:underline">Dashboard</router-link>

          <span class="mx-1">></span>
          <span>Artikel</span>
        </nav>
      </div>
  
      <!-- Search and Add Button -->
      <div class="flex justify-end mb-6">
        <div class="flex items-center gap-2">
          <div class="relative">
            <n-input
              v-model:value="search"
              placeholder="Search"
              class="w-60 search-input"
            >
              <template #prefix>
                <n-icon size="18">
                  <Search />
                </n-icon>
              </template>
            </n-input>
          </div>
          <n-button 
            type="primary" 
            class="custom-button"
          >
            Tambah Artikel
          </n-button>
        </div>
      </div>
  
      <!-- Grid Artikel -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="article in paginatedArticles.data"
          :key="article.id"
          class="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col"
        >
          <img
            :src="article.image"
            alt="Gambar Artikel"
            class="w-full h-40 object-cover"
          />
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-base font-bold mb-1">{{ article.title }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ article.content }}</p>
  
            <div class="mt-auto space-y-2">
              <button
                class="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              >
                Detail
              </button>
              <button
                class="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                class="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Pagination -->
      <div class="mt-6 flex justify-center">
        <n-pagination
          v-model:page="page"
          :page-size="pageSize"
          :item-count="allArticles.data.length"
        />
      </div>
    </div>
  </template>
  
  <style scoped>
  body {
    font-family: 'Inter', sans-serif;
  }
  
  .search-input :deep(.n-input) {
    border-radius: 8px;
  }
  
  .search-input :deep(.n-input-wrapper) {
    padding-left: 12px;
  }
  
  .search-input :deep(.n-input__prefix) {
    margin-right: 8px;
    color: #8e8e8e;
  }
  
  .search-input :deep(.n-input__input-el) {
    font-size: 14px;
  }
  
  .custom-button {
    background-color: #0F5BC0 !important;
    border-color: #0F5BC0 !important;
  }
  
  .custom-button:hover {
    background-color: #0D4FA8 !important;
    border-color: #0D4FA8 !important;
  }
  
  .custom-button:active {
    background-color: #0B4390 !important;
    border-color: #0B4390 !important;
  }
  
  :deep(.n-pagination .n-pagination-item--button) {
    border: 1px solid #e5e7eb;
    margin: 0 4px;
  }
  
  :deep(.n-pagination .n-pagination-item--active) {
    border-color: #0F5BC0 !important;
    color: #0F5BC0 !important;
  }
  
  :deep(.n-pagination .n-pagination-item:hover) {
    border-color: #0F5BC0 !important;
    color: #0F5BC0 !important;
  }
  
  :deep(.n-pagination .n-pagination-item--active:hover) {
    color: white !important;
  }
  </style>
  