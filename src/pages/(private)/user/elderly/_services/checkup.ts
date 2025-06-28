import { useHttp, useHttpMutation } from '@/composable/http/http'
import type { DataCheckupListResponse } from '../_types/checkup'

export const useCheckupList = (params: Ref<Record<string, any>>) => {
  return useHttp<DataCheckupListResponse>('/v1/checkupElderly', {
    params
  })
}

export const useCheckupCreate = () => {
  return useHttpMutation('/v1/checkupElderly', {
    method: 'POST'
  })
}

export const useCheckupUpdate = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/checkupElderly/${unref(id)}`),
    {
      method: 'PUT'
    }
  )
}

export const useCheckupDelete = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/checkupElderly/${unref(id)}`),
    {
      method: 'DELETE'
    }
  )
}
