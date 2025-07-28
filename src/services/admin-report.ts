import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
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

export const useAdminDeleteReport = (id: string) => {
  const { message } = createDiscreteApi(['message'])
  return useHttpMutation(API.ADMIN_DELETE_REPORT.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus LAPORAN berhasil')
      },
      onError: () => {
        message.error('Hapus LAPORAN Gagal')
      }
    }
  })
}

export const useAdminPutReport = (id: Ref<string>) => {
  const router = useRouter()
  const { message } = createDiscreteApi(['message'])
  return useHttpMutation(API.ADMIN_PUT_REPORT.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Data Jadwal Posyandu berhasil')
        router.push('/admin/schedule')
      },
      onError: () => {
        message.error('Update Data Posyandu gagal')
      }
    }
  })
}
