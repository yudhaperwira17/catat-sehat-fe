import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

export interface Root {
  message: string
  data: Data
  status: number
}

export interface Data {
  data: DataCheckup[]
  meta: Meta
}

export interface DataCheckup {
  id: string
  height: number
  weight: number
  headCircumference: number
  gender: string
  bmi: number
  bmiStatus: string
  status: string
  childrenId: string
  adminId: string
  healthPostId: string
  fileDiagnosedId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  children: Children
  fileDiagnosed: any
}

export interface Children {
  id: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  childOrder: number
  bloodType: string
  height: number
  weight: number
  address: string
  gender: string
  code: string
  userId: string
  motherId: string
  childPictureId: any
  birthCertificateId: any
  kiaCardId: any
  familyCardId: any
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
