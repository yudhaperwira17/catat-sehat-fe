import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { useMessage } from 'naive-ui'

//month seed
export const usePublicReadMonthBlood = () => {
  return useHttp(API.ADMIN_GET_MONTH_BLOOD_SUPLEMENT, {})
}

//PUBLIC CODE MOM
export interface MotherCodeResponse {
  message: string
  data: MotherResponse
  status: number
}

export interface MotherResponse {
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

export const PublicCode = (id: Ref<string>) => {
  const url = computed(() => {
    return API.PUBLIC_CODE_MOM.replace('{code}', unref(id))
  })
  return useHttp<MotherResponse>(url, {
    queryOptions: {
      queryKey: [url],
      retry(error: any) {
        if (error?.status === 404) {
          return false
        }
        return true
      }
    }
  })
}

//PUBLIC POST CHECKUP
export const usePublicPostCheckup = () => {
  const message = useMessage()

  return useHttpMutation(API.PUBLIC_POST_CHECKUP_MOM, {
    method: 'POST',
    queryOptions: {
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

//PUBLIC POST BLOOD
export const usePublicPostBloodSuplement = () => {
  const message = useMessage()

  return useHttpMutation(API.PUBLIC_POST_BLOOD_SUPLEMENT, {
    method: 'POST',
    queryOptions: {
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}
