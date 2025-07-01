import { API } from '@/composable/http/api-constant'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { http } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

interface ArticlePayload {
  title: string
  content: string
  newsMaker: string
  filePicture?: string
}

interface Article {
  id: string
  title: string
  content: string
  newsMaker: string
  image?: {
    path: string
  }
  createdAt: string
  updatedAt: string
}

interface ArticleResponse {
  data: {
    id: string
    title: string
    content: string
    newsMaker: string
    image?: {
      path: string
    }
    createdAt: string
    updatedAt: string
  }
}

interface ArticleListResponse {
  data: {
    data: Article[]
    meta: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  }
}

// Get all articles
export const useAdminGetArticles = (params: Ref<Record<string, any>>) => {
  return useQuery<ArticleListResponse>({
    queryKey: [API.ADMIN_GET_ARTICLE, params],
    queryFn: async () => {
      const { data } = await http.get<ArticleListResponse>(API.ADMIN_GET_ARTICLE, {
        params: unref(params)
      })
      return data
    }
  })
}

// Get article by ID
export const useAdminGetArticleById = (id: ComputedRef<string>) => {
  return useQuery({
    queryKey: [API.ADMIN_GET_ARTICLE_ID, id],
    queryFn: async () => {
      const { data } = await http.get<ArticleResponse>(
        API.ADMIN_GET_ARTICLE_ID.replace('{id}', unref(id))
      )
      return data
    },
    enabled: !!id
  })
}

// Create new article
export const useAdminPostArticle = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (payload: ArticlePayload) => {
      const { data } = await http.post<ArticleResponse>(API.ADMIN_POST_ARTICLE, payload)
      message.success('Artikel berhasil ditambahkan')
      console.log(
        'Admin Token before redirect in useAdminPostArticle:',
        localStorage.getItem('adminToken')
      )
      router.push('/admin/article')
      return data
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Gagal menambahkan artikel')
    }
  })
}

// Update article
export const useAdminPutArticle = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ArticlePayload }) => {
      const { data } = await http.put<ArticleResponse>(
        API.ADMIN_PUT_ARTICLE.replace('{id}', id),
        payload
      )
      message.success('Edit artikel berhasil')
      router.push('/admin/article')
      return data
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Edit artikel gagal')
    }
  })
}

// Delete article
export const useAdminDeleteArticle = (id: Ref<string>) => {
  console.log(id)
  const router = useRouter()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.delete<ArticleResponse>(
        API.ADMIN_DELETE_ARTICLE.replace('{id}', id)
      )
      message.success('Hapus artikel berhasil')
      router.push('/admin/article')
      return data
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Hapus artikel gagal')
    }
  })
}
