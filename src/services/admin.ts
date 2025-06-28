import { API } from '@/composable/http/api-constant'
import { useHttpMutation, useHttp } from '@/composable/http/http'
import { useQueryClient } from '@tanstack/vue-query'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export const useAdminPostAdmin = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_ADMIN, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Admin berhasil ditambahkan')
        // router.push('/admin/data-admin') // Redirect to data admin page - often better to just invalidate and refetch
        // Or simply close the modal if it's used in a modal context and refetch list
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminEditAdmin = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_ADMIN.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Edit admin berhasil')
        // router.push('/admin/data-admin') // Redirect to data admin page
      },
      onError: () => {
        message.error('Edit admin gagal')
      }
    }
  })
}

export const useAdminDeleteAdmin = (id: Ref<string>) => {
  console.log(id)
  const router = useRouter()
  return useHttpMutation(
    computed(() => API.ADMIN_DELETE_ADMIN.replace('{id}', unref(id))),
    {
      method: 'DELETE',
      queryOptions: {
        onSuccess: () => {
          message.success('Hapus admin berhasil')
          // router.push('/admin/data-admin') // Redirect to data admin page
        },
        onError: () => {
          message.error('Hapus admin gagal')
        }
      }
    }
  )
}

export const useReadAdmin = (params: Ref<Record<string, any>>) =>
  useHttp(API.ADMIN_GET_ADMIN, {
    params
  })

export const useReadAdminById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_ADMIN_ID.replace('{id}', unref(id))
  })

  return useHttp(url)
}

export const useReadHealthPost = () => {
  return useHttp(API.ADMIN_GET_HEALTH_POST)
}
