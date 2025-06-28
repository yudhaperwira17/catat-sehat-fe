import { API } from "@/composable/http/api-constant";
import { useHttp } from "@/composable/http/http";
import { computed, unref, type Ref } from "vue";

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
  startAt: string
  endAt: string
  address: string
  note: string
  staffId: string
  healthPostId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  healthPost: HealthPost
  staff: Staff
}

export interface HealthPost {
  id: string
  name: string
  address: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Staff {
  id: string
  name: string
  email: string
  password: string
  phone: string
  type: string
  healthPostId: string
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
export const useReadSchedule = (params: Ref<Record<string, any>>) =>
    useHttp(API.USER_GET_SCHEDULE, {
        params
    })

export const useReadScheduleById = (id: Ref<string>) => {
    const url = computed(() => {
        return API.USER_GET_SCHEDULE_ID.replace('{id}', unref(id))
    })
    return useHttp(url)
}
