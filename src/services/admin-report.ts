import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

export interface AdminReportResponse {
    data: Daum[]
    meta: Meta
  }
  
  export interface Daum {
    id: string
    reporter: string
    phoneNumber: string
    childName: string
    childAddress: string
    gender: string
    fileChildPicture: any
    fileHousePicture: any
    observation: string
    deletedAt: any
    createdAt: string
    updatedAt: string
  }
  
  export interface Meta {
    limit: number
    page: number
    totalData: number
    totalPage: number
  }
export const useAdminReadReport = (params: Ref<Record<string, any>>) => {
    return useHttp<AdminReportResponse>(API.ADMIN_GET_REPORT_STUNTING, {
        params
    })
  }

  export const useAdminReadDetailReportById = (id: Ref<string>) => {
    const url = computed(() => {
        return API.ADMIN_GET_REPORT_STUNTING_BYID.replace('{id}', unref(id))
    })
    return useHttp(url)
  }