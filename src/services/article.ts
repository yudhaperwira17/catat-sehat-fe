import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

export interface ArticlePayload {
  title: string
  content: string
  newsMaker: string
  image?: string
}

export interface Article {
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

export interface ArticleResponse {
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

export interface ArticleListResponse {
  data: Article[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

// Get all articles for user
export const useArticleList = (params: Ref<Record<string, any>>) => {
  return useHttp<ArticleListResponse>(API.USER_GET_ARTICLE, {
    params
  })
}

// Get article detail by ID for user
export const useArticleDetail = (id: ComputedRef<string>) => {
  return useHttp<ArticleResponse>(
    computed(() => API.USER_GET_ARTICLE_ID.replace('{id}', unref(id)))
  )
}
