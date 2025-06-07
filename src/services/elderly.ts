import { API } from '@/composable/http/api-constant'
import { useHttpMutation, useHttp } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { unref, type Ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export interface DataElderlyListResponse {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: string
  userId: string
  name: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  bloodType: string
  address: string
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

export const useElderlyCreate = () => {
  return useHttpMutation('/v1/elderly', {
    method: 'POST'
  })
}

export const useElderlyList = (params: Ref<Record<string, any>>) => {
  return useHttp<DataElderlyListResponse>('/v1/elderly', {
    params
  })
}

export const useElderlyDetail = (id: Ref<string>) => {
  return useHttp(`/v1/elderly/${unref(id)}`)
}

export const useReadElderly = () => useHttp(API.USER_GET_ELDERLY, {})

export const useUserElderlyRegistration = () => {
  const router = useRouter()
  return useHttpMutation(API.USER_POST_ELDERLY, {
    method: 'POST',
    queryOptions: {
      onSuccess: (data) => {
        console.log('Elderly Registration Success Response:', data)
        message.success('Data Lansia berhasil ditambah')
        router.push('/user/setting-data-elderly')
      },
      onError: (error) => {
        console.error('Elderly Registration Error Response:', error)
        message.error(error.data?.message || 'Gagal menambahkan data lansia')
      }
    }
  })
}

export const useUserPutElderlyId = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.USER_PUT_ELDERLY_ID.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Data Lansia berhasil diedit')
        router.push('/user/setting-data-elderly')
      },
      onError: () => {
        message.error('Data Lansia gagal diedit')
      }
    }
  })
}

export const useElderlyDelete = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/elderly/${unref(id)}`),
    {
      method: 'DELETE'
    }
  )
}
