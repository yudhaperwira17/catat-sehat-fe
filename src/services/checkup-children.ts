import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

export interface Data {
  data: DataCheckup[]
  meta: Meta
}

export interface DataCheckup {
  id: string
  childId?: string
  ownerType: string
  type: any
  name: any
  healthPost: any
  dateTime: any
  staff: any
  status: string
  height: number
  weight: number
  bmi: number
  bmiStatus: string
  gender: any
  headCircumference: number
  fileDiagnosed: {
    path: string
  }
  deletedAt: any
  createdAt: string
  updatedAt: string
  age: number
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}

export interface Root {
  message: string
  data: DataCheckup[]
  status: number
}

export interface Graphic {
  day: string
  bmi: number
}

export const useReadChildCheckup = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.USER_GET_CHECKUP_CHILDREN, {
    params
  })
}

export const useReadChildCheckupById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_CHECKUP_BYID_CHILDREN.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useReadChildCheckupGraphic = (params: Ref<Record<string, any>>) => {
  const url = computed(() => {
    return API.USER_GET_CHECKUP_GRAPHIC_CHILDREN
  })
  return useHttp<Graphic[]>(url, {
    params
  })
}
