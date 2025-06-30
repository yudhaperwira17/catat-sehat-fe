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

export const useReadLocationSubDistrict = () => useHttp<SubDistrictData[]>(API.LOCATION_GET_SUBDISTRICTS, {})

export interface SubDistrictResponse {
  message: string
  data: SubDistrictData[]
  status: number
}

export interface SubDistrictData {
  id: string
  name: string
  districtId: string
  createdAt: string
  updatedAt: string
  district: District
}

export interface District {
  id: string
  name: string
  regencyId: string
  createdAt: string
  updatedAt: string
  regency: Regency
}

export interface Regency {
  id: string
  name: string
  provinceId: string
  createdAt: string
  updatedAt: string
  province: Province
}

export interface Province {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
