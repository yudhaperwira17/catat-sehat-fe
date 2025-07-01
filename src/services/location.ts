import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'

import { computed, type Ref } from 'vue'

export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  provinceId: string
}

export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
}

export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  regencyId: string
}

export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  districtId: string
}

export const useReadLocationProvince = () => useHttp<Daum[]>(API.LOCATION_GET_PROVINCE, {})
export const useReadLocationRegency = (provinceId?: Ref<string | undefined>) =>
  useHttp<Daum[]>(API.LOCATION_GET_REGENCY, {
    params: computed(() => ({ provinceId: provinceId?.value }))
  })

export const useReadLocationDistrict = (regencyId: Ref<string | undefined>) =>
  useHttp<Daum[]>(API.LOCATION_GET_DISTRICTS, {
    params: computed(() => ({ regencyId: regencyId?.value }))
  })

export const useReadLocationSubDistrict = () => useHttp<Daum[]>(API.LOCATION_GET_SUBDISTRICTS, {})
