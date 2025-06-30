import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'

export interface postPartumResponse {
  message: string
  data: userPostPartum[]
  status: number
}

export interface userPostPartum {
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
  question14: boolean
  question15: boolean
  question16: boolean
  question17: boolean
  question18: boolean
  status: string
  motherId: string
  dayPostPartumId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  mother: Mother
  dayPostPartum: DayPostPartum
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

export interface DayPostPartum {
  id: string
  dayNumber: number
  name: string
  createdAt: string
  updatedAt: string
}

export const useReadDaysPostPartum = () => {
  return useHttp(API.USER_GET_DAYS_POSTPARTUM, {})
}

//days
export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  dayNumber: number
  name: string
  createdAt: string
  updatedAt: string
}

export const useMonitorPostPartum = (params: Ref<Record<string, any>>) => {
  return useHttp<userPostPartum>(API.USER_GET_POSTPARTUM, {
    params
  })
}
export const useReadMonitorPostPartumById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_POSTPARTUM_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useUserCreatePostPartum = () => {
  const { message } = createDiscreteApi(['message'])
  return useHttpMutation(API.USER_POST_POSTPARTUM, {
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
