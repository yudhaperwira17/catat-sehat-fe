import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

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
  question1: boolean
  question2: boolean
  question3: boolean
  question4: boolean
  question5: boolean
  question6: boolean
  question7: boolean
  question8: boolean
  question9: boolean
  question10: boolean
  question11: boolean
  question12: boolean
  question13: boolean
  question14: boolean
  question15: boolean
  question16: boolean
  question17: boolean
  question18: boolean
  status: string
  motherId: string
  dayPostPartumId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  mother: Mother
  dayPostPartum: DayPostPartum
}

export interface Mother {
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

export interface DayPostPartum {
  id: string
  dayNumber: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}

export const useAdminReadmonitorPostPartum = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.ADMIN_GET_POSTPARTUM, {
    params
  })
}
export const useAdminReadmonitorPostPartumById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_POSTPARTUM_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}
