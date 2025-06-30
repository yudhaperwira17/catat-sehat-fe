import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'

export interface MonitorPregnancyResponse {
  message: string
  data: UserMonitorPregnancy[]
  status: number
}

export interface UserMonitorPregnancy {
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

export const useReadWeeksPregnancy = () =>{
  return useHttp(API.USER_GET_WEEKS_PREGNANCY, {})
} 
  
//week
export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  weekNumber: number
  name: string
  createdAt: string
  updatedAt: string
}

export const useReadMonitorPregnancy = (params: Ref<Record<string, any>>) => {
  return useHttp<UserMonitorPregnancy>(API.USER_GET_MONITOR_PREGNANCY, {
    params
  })
}

export const useReadMonitorPregnancyById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_MONITOR_PREGNANCY_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useUserCreateMonitorPregnancy = () => {
  const { message } = createDiscreteApi(['message'])
  return useHttpMutation(API.USER_POST_MONITOR_PREGNANCY, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Pemantauan Ibu Nifas berhasil ditambahkan')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}


