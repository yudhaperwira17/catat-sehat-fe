import { useHttp, useHttpMutation } from '@/composable/http/http'

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
  score: number
  elderlyId: string
  lungsConclutionId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  elderly: Elderly
  lungsPivot: LungsPivot[]
  lungsConclution: LungsConclution
}

export interface Elderly {
  id: string
  userId: string
  name: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  bloodType: string
  address: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface LungsPivot {
  id: string
  value: number
  lungsId: string
  masterDataLungsId: string
  masterDataLungs: MasterDataLungs
}

export interface MasterDataLungs {
  id: string
  question: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface LungsConclution {
  id: string
  description: string
  conclusion: string
  from: number
  to: number
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

export const useLungsCheckup = (params: Ref<Record<string, any>>) =>
  useHttp<Data>('/v1/lungs', {
    params
  })

export const useCreateLungs = () =>
  useHttpMutation('/v1/lungs', {
    method: 'POST'
  })

export const useDownloadCheckup = () =>
  useHttpMutation<Blob, any, { id: string }>(
    computed(() => `/v1/lungs/pdf`),
    {
      method: 'POST',
      httpOptions: {
        responseType: 'blob'
      },
      queryOptions: {
        onSuccess: (data, variables) => {
          const url = window.URL.createObjectURL(new Blob([data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `data-pemeriksaan-paru-${variables.id}.pdf`)
          document.body.appendChild(link)
          link.click()
        }
      }
    }
  )
