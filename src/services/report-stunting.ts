import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface reportStuntingResponse {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: string
  reporter: string
  phoneNumber: string
  childName: string
  childAddress: string
  observation: string
  gender: string
  fileChildPictureId: string
  fileHousePictureId: string
  userId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  fileHousePicture: FileHousePicture
  fileChildPicture: FileChildPicture
}

export interface FileHousePicture {
  id: string
  fileName: string
  path: string
  mimeType: string
  size: number
  type: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface FileChildPicture {
  id: string
  fileName: string
  path: string
  mimeType: string
  size: number
  type: string
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
const { message } = createDiscreteApi(['message'])

export const useUserReportStunting = () => {
  const router = useRouter()
  return useHttpMutation(API.USER_POST_REPORT_STUNTING, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Lapor Stunting berhasil ditambahkan')
        router.push('/user/report-stunting')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}
export const useReadReportStunting =(params: Ref<Record<string, any>>) => {
  return useHttp<reportStuntingResponse>(API.USER_GET_REPORT_STUNTING, {
  params
})}

export const useReadDetailReportById = (id: Ref<string>) => {
  const url = computed(() => {
      return API.USER_GET_REPORT_STUNTING_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

