import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

export const useReadArticle = (params: Ref<Record<string, any>>) =>
  useHttp(API.USER_GET_ARTICLE, {
    params
  })

export const useReadArticleById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_ARTICLE_ID.replace('{id}', unref(id))
  })

  return useHttp(url)
}
