import { useHttp, useHttpMutation } from '@/composable/http/http'

export interface LungConclusionListResponse {
  data: LungConclusion[]
  meta: Meta
}

export interface LungConclusion {
  id: string
  value: number
  conclusion: string
  description: string
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}

export const useLungConclusionList = (params: Ref<Record<string, any>>) => {
  return useHttp<LungConclusionListResponse>('/v1/lungsConclusion', {
    params: unref(params)
  })
}

export const useCreateLungConclusion = () => {
  return useHttpMutation<LungConclusion>('/v1/lungsConclusion', {
    method: 'POST'
  })
}

export const useUpdateLungConclusion = (id: Ref<string>) => {
  return useHttpMutation<LungConclusion>(
    computed(() => `/v1/lungsConclusion/${unref(id)}`),
    {
      method: 'PUT'
    }
  )
}

export const useDeleteLungConclusion = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/lungsConclusion/${unref(id)}`),
    {
      method: 'DELETE'
    }
  )
}

export const useLungConclusionDetail = (id: Ref<string>) => {
  return useHttp<LungConclusion>(`/v1/lungsConclusion/${unref(id)}`)
}
