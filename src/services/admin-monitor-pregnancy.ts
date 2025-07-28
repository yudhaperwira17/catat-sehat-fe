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
  status: string
  motherId: string
  weekPregnancyMonitoringId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  mother: Mother
  weekPregnancyMonitoring: WeekPregnancyMonitoring
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

export interface WeekPregnancyMonitoring {
  id: string
  weekNumber: number
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

export const useAdminReadMonitorPregnancy = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.ADMIN_GET_MONITOR_PREGNANCY, {
    params
  })
}
export const useAdminReadMonitorPreganancyById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_MONITOR_PREGNANCY_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}
