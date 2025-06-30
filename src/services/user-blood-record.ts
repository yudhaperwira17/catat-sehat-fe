import { API } from "@/composable/http/api-constant"
import { useHttp } from "@/composable/http/http"

export interface Root {
  message: string
  data: Data
  status: number
}

export interface Data {
  monthName: string
  totalConsume: number
  statusBlood: string
  data: Daum[]
}

export interface Daum {
  id: string
  date: string
  type: string
  staffName: any
  staffJob: any
  note: string
  adminId: string
  motherId: string
  monthId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  monthBlood: MonthBlood
  admin: Admin
}

export interface MonthBlood {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string
  phone: string
  type: string
  healthPostId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
}


export const useReadMonthsBlood = () => {
  return useHttp(API.USER_GET_MONTH_BLOOD_SUPLEMENT, {})

}


export const userMonitorBlood = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.USER_GET_BLOOD_SUPLEMENT, {
    params
  })
}