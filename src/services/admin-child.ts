import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { computed, unref, type ComputedRef, type Ref } from 'vue'

// export interface AdminChildCode {
//   message: string
//   data: Data
//   status: number
// }

export interface AdminChildCode {
  id: string
  userId: string
  motherId: string
  name: string
  identityNumber: string
  dateOfBirth: string
  placeOfBirth: string
  age: number
  childOrder: number
  bloodType: string
  height: number
  weight: number
  address: any
  code: string
  url: any
  gender: string
  childPictureId: string
  birthCertificateId: string
  kiaCardId: string
  familyCardId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  mother: Mother
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

export interface AdminChildResponse {
    data: Daum[]
    meta: Meta
  }

export interface Daum {
    id: string
    name: string
    dateOfBirth: string
    placeOfBirth: string
    age: any
    childOrder: number
    bloodType: string
    height: number
    weight: number
    address: any
    childPicture: any
    fileBirthCertificate: any
    fileChildIdentity: any
    fileFamilyCard: any
    deletedAt: any
    createdAt: string
    updatedAt: string
    userId: any
    user: any
}

export interface Meta {
    limit: number
    page: number
    totalData: number
    totalPage: number
  }

export const useAdminReadChild = (params: Ref<Record<string, any>>) => {
    return useHttp<AdminChildResponse>(API.ADMIN_GET_CHILDREN, {
        params
    })
}

export const adminReadChildById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_CHILDREN_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const adminUpdateChildById = (id: ComputedRef<string>) => {
  return useHttpMutation<AdminChildResponse>(computed(() => API.ADMIN_GET_CHILDREN_BYID.replace('{id}', unref(id))), {
    method: 'GET'
    
})}
export const adminCheckupChildByCode = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_CHILDREN_BYCODE.replace('{code}', unref(id))
  })
  return useHttp<AdminChildCode>(url)
}
export const adminUpdateChildByCode = (id: ComputedRef<string>) => {
  return useHttpMutation<AdminChildCode>(computed(() => API.ADMIN_GET_CHILDREN_BYCODE.replace('{code}', unref(id))), {
     method: 'GET'
})}

