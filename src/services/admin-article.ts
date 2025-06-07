import { API } from '@/composable/http/api-constant'
import { useHttpMutation, useHttp } from '@/composable/http/http'
import { useQueryClient } from '@tanstack/vue-query'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export const useAdminPostArticle = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_ARTICLE, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Artikel berhasil ditambahkan')
        router.push('/admin/article')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminEditArticle = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_ARTICLE.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Edit artikel berhasil')
        router.push('/admin/article')
      },
      onError: () => {
        message.error('Edit artikel gagal')
      }
    }
  })
}

export const useAdminDeleteArticle = (id: Ref<string>) => {
  console.log(id)
  const router = useRouter()
  return useHttpMutation(
    computed(() => API.ADMIN_DELETE_ARTICLE.replace('{id}', unref(id))),
    {
      method: 'DELETE',
      queryOptions: {
        onSuccess: () => {
          message.success('Hapus artikel berhasil')
          router.push('/admin/article')
        },
        onError: () => {
          message.error('Hapus artikel gagal')
        }
      }
    }
  )
}
