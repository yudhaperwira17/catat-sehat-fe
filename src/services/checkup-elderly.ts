import { useHttp, useHttpMutation } from '@/composable/http/http'

export interface DataCheckupListResponse {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: string
  height: number
  weight: number
  bmi: number
  bloodTension: number
  bloodSugar: number
  attend: string
  month: any
  bmiStatus: string
  status: string
  adminId: any
  elderlyId?: string
  healthPostId: any
  lungsConclutionId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  healthPost: any
  elderly?: Elderly
  fileDiagnosed?: {
    id: string
    name: string
    type: string
    size: number
    url: string
    path: string
  }
}

export interface Elderly {
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

export const useCheckupList = (params: Ref<Record<string, any>>) => {
  return useHttp<DataCheckupListResponse>('/v1/checkupElderly', {
    params
  })
}

export const useCheckupAdminList = (params: Ref<Record<string, any>>) => {
  return useHttp<DataCheckupListResponse>('/v1/admin/checkupElderly', {
    params
  })
}

export const useCheckupCreate = () => {
  return useHttpMutation('/v1/admin/checkupElderly', {
    method: 'POST'
  })
}

export const useCheckupUpdate = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/admin/checkupElderly/${unref(id)}`),
    {
      method: 'PUT'
    }
  )
}

export const useCheckupDelete = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/admin/checkupElderly/${unref(id)}`),
    {
      method: 'DELETE'
    }
  )
}
