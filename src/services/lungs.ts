import { useHttp, useHttpMutation } from '@/composable/http/http'

export const useLungsCheckup = (params: Ref<Record<string, any>>) =>
  useHttp('/v1/lungs', {
    params
  })

export const useCreateLungs = () =>
  useHttpMutation('/v1/lungs', {
    method: 'POST'
  })
