import { useHttp, useHttpMutation } from '@/composable/http/http'

export interface LungListResponse {
  data: Question[]
  meta: Meta
}

export interface Question {
  id: string
  question: string
  description: string
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

export const useLungQuestionList = (params: Ref<Record<string, any>>) => {
  return useHttp<LungListResponse>('/v1/masterDataLungs', {
    params: unref(params)
  })
}

export const useCreateLungQuestion = () => {
  return useHttpMutation('/v1/masterDataLungs', {
    method: 'POST'
  })
}

export const useUpdateLungQuestion = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/masterDataLungs/${unref(id)}`),
    {
      method: 'PUT'
    }
  )
}

export const useDeleteLungQuestion = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/masterDataLungs/${unref(id)}`),
    {
      method: 'DELETE'
    }
  )
}
