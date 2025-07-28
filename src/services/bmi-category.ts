import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Root {
  message: string
  data: Data
  status: number
}

export interface Data {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: string
  minAge: number
  maxAge: number
  minBMI: number
  maxBMI: number
  gender: string
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}

const { message } = createDiscreteApi(['message'])

export const useAdminReadCategory = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.ADMIN_GET_BMI_CATEGORY, {
    params
  })
}

export const useAdminReadCategoryById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_BMI_CATEGORY_BYID.replace('{id}', unref(id))
  })

  return useHttp(url)
}

export const useAdminPostCategory = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_BMI_CATEGORY, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        router.push('/admin/category')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminPutCategory = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_BMI_CATEGORY.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        router.push('/admin/category')
      },
      onError: () => {
        message.error('Update Data Posyandu gagal')
      }
    }
  })
}

export const useAdminDeleteCategory = (id: string) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_DELETE_BMI_CATEGORY.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        router.push('/admin/category')
      },
      onError: () => {
        message.error('Hapus Data Posyandu gagal')
      }
    }
  })
}

