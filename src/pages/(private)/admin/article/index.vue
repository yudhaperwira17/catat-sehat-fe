<script setup lang="ts">
import ModalEdit from '@/components/modal/input-admin/modal-edit-article.vue'
import ModalCreate from '@/components/modal/input-admin/modal-input-article.vue'
import { API } from '@/composable/http/api-constant'
import { useAdminDeleteArticle, useAdminGetArticles } from '@/services/admin-article'
import { useQueryClient } from '@tanstack/vue-query'
import { Search } from '@vicons/ionicons5'
import { NButton, NIcon, NInput, NPagination, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const message = useMessage()
const queryClient = useQueryClient()
const router = useRouter()

const params = ref({
  page: 1,
  limit: 10,
  search: ''
})

const showModal = ref(false)
const showEdit = ref(false)
const selectedArticleId = ref<string>('')

interface ArticleResponse {
  id: string
  title: string
  content: string
  newsMaker: string
  filePicture?: {
    path: string
  }
  createdAt: string
  updatedAt: string
}

interface ArticleListResponse {
  data: ArticleResponse[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

const { data: articles, isLoading, refetch } = useAdminGetArticles(params)

const { mutate: deleteArticle } = useAdminDeleteArticle(selectedArticleId)

const handleSearch = () => {
  params.value.page = 1 // Reset page when searching
  refetch()
}

const handlePageChange = (newPage: number) => {
  params.value.page = newPage
  refetch()
}

const openCreateModal = () => {
  showModal.value = true
}

const openEditModal = (id: string) => {
  selectedArticleId.value = id
  showEdit.value = true
}

const handleDelete = (id: string) => {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus artikel ini?')
  if (!confirmDelete) return

  deleteArticle(id, {
    onSuccess: () => {
      message.success('Artikel berhasil dihapus')
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ARTICLE] })
    },
    onError: (error) => {
      console.error('Error deleting article:', error)
      message.error('Terjadi kesalahan saat menghapus artikel')
    }
  })
}

// Navigate to detail page
const goToDetail = (id: string) => {
  router.push(`/admin/article/${id}`)
}

// Function to limit the length of the title
const truncateTitle = (title: string, maxLength = 40) => {
  if (!title) return ''
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Artikel</h1>
      <nav class="text-sm text-gray-500 mt-2">
        <router-link to="/admin/dashboard" class="hover:underline">Dashboard</router-link>

        <span class="mx-1">></span>
        <span>Artikel</span>
      </nav>
    </div>

    <!-- Search and Add Bar (Right aligned) -->
    <div class="flex justify-end mb-6">
      <div class="flex items-center">
        <!-- Search Input with Icon -->
        <n-input
          v-model:value="params.search"
          type="text"
          placeholder="Search"
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

        <!-- Tambah Artikel Button -->
        <n-button
          type="primary"
          class="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 rounded-md ml-2"
          @click="openCreateModal"
        >
          Tambah Artikel
        </n-button>
      </div>
    </div>

    <!-- Grid Artikel -->
    <div v-if="isLoading">Loading articles...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="article in articles?.data?.data"
        :key="article.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col"
      >
        <img
          :src="article.image?.path || '/placeholder-image.jpg'"
          alt="Gambar Artikel"
          class="w-full h-40 object-cover"
        />
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-base font-bold mb-1">
            {{ truncateTitle(article.title || 'Judul Tidak Ditemukan') }}
          </h3>
          <p class="text-xs text-gray-500 mb-2 truncate">
            {{ article.content || 'Deskripsi Tidak Ditemukan' }}
          </p>

          <div class="mt-auto space-y-2">
            <n-button
              class="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              @click="goToDetail(article.id)"
            >
              Detail
            </n-button>
            <n-button
              class="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              @click="openEditModal(article.id)"
            >
              Edit
            </n-button>
            <n-button
              class="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              @click="handleDelete(article.id)"
            >
              Hapus
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center">
      <n-pagination
        v-model:page="params.page"
        :page-size="params.limit"
        :item-count="articles?.data?.meta?.totalItems || 0"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Modals -->
    <n-modal v-model:show="showModal">
      <ModalCreate
        @close="
          () => {
            showModal = false
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ARTICLE] })
          }
        "
      />
    </n-modal>

    <n-modal v-model:show="showEdit">
      <ModalEdit
        :id="selectedArticleId"
        @close="
          () => {
            showEdit = false
            queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ARTICLE] })
          }
        "
      />
    </n-modal>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

/* Custom styles for search input and buttons based on the image */
.rounded-r-none :deep(.n-input__input-el) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.rounded-l-none {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.rounded-r-md {
  border-top-right-radius: 0.375rem !important; /* Match Tailwind's rounded-md */
  border-bottom-right-radius: 0.375rem !important; /* Match Tailwind's rounded-md */
}

.rounded-md {
  border-radius: 0.375rem !important; /* Match Tailwind's rounded-md */
}

.bg-blue-600 {
  background-color: #2563eb !important; /* Updated to a standard blue from Tailwind */
  border-color: #2563eb !important;
}

.bg-blue-600:hover {
  background-color: #1d4ed8 !important; /* Darker blue on hover */
  border-color: #1d4ed8 !important;
}

.bg-blue-600:active {
  background-color: #1e40af !important; /* Even darker blue on active */
  border-color: #1e40af !important;
}

:deep(.n-pagination .n-pagination-item--button) {
  border: 1px solid #e5e7eb;
  margin: 0 4px;
}

:deep(.n-pagination .n-pagination-item--active) {
  border-color: #3b82f6 !important; /* Blue border for active page */
  color: #3b82f6 !important; /* Blue text for active page */
}

:deep(.n-pagination .n-pagination-item:hover) {
  border-color: #3b82f6 !important; /* Blue border on hover */
  color: #3b82f6 !important; /* Blue text on hover */
}

:deep(.n-pagination .n-pagination-item--active:hover) {
  color: white !important; /* White text on active hover */
}

/* Ensure search input and button are aligned */
.flex.items-center > .n-input {
  flex-grow: 0; /* Prevent input from taking up full width */
}

.flex.items-center > .n-button:not(:last-child) {
  margin-right: 0; /* Remove default margin between input and search button */
}
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
</route>
