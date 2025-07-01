import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

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
  name: string
  dateOfBirth: string
  placeOfBirth: string
  address: string
  code: string
  userId: string
  subDistrictId: string
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

export const useUserParentAddData = () => {
  const router = useRouter()
  return useHttpMutation(API.USER_POST_PARENT, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Registrasi Orang Tua berhasil')
        router.push('/user/setting-account')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useReadParent = () => useHttp<Data>(API.USER_GET_PARENT, {})

export const useReadParentsById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_PARENT_ID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useUserDeleteParent = (id: string) => {
  return useHttpMutation(API.USER_DELETE_PARENT_ID.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus Data Orang Tua berhasil')
      },
      onError: () => {
        message.error('Hapus Data Orang Tua gagal')
      }
    }
  })
}

export const useUserPutParent = (id: Ref<any>) => {
  const router = useRouter()
  return useHttpMutation(API.USER_PUT_PARENT_ID.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Data Orang Tua berhasil')
        router.push('/user/setting-account')
      },
      onError: () => {
        message.error('Update Data Orang Tua gagal')
      }
    }
  })
}
