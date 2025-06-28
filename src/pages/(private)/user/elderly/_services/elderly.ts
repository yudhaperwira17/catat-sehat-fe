import { useHttp, useHttpMutation } from '@/composable/http/http'
import type { DataElderlyListResponse } from '../_types/elderly'

export const useElderlyList = (params: Ref<Record<string, any>>) => {
  return useHttp<DataElderlyListResponse>('/v1/elderly', {
    params
  })
}

export const useElderlyDetail = (id: Ref<string>) => {
  return useHttp(`/v1/elderly/${unref(id)}`)
}

export const useElderlyDelete = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/elderly/${unref(id)}`),
    {
      method: 'DELETE'
    }
  )
}

export const useElderlyUpdate = (id: Ref<string>) => {
  return useHttpMutation(
    computed(() => `/v1/elderly/${unref(id)}`),
    {
      method: 'PUT'
    }
  )
}

export const useElderlyCreate = () => {
  return useHttpMutation('/v1/elderly', {
    method: 'POST'
  })
}
