import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

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
  startAt: string
  endAt: string
  address: string
  note: string
  staffId: string
  healthPostId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  healthPost: HealthPost
  staff: Staff
}

export interface HealthPost {
  id: string
  name: string
  address: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Staff {
  id: string
  name: string
  email: string
  password: string
  phone: string
  type: string
  healthPostId: string
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

export const useAdminReadSchedule = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.ADMIN_GET_SCHEDULE, {
    params
  })
}

export const useAdminReadScheduleById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_SCHEDULE_BYID.replace('{id}', unref(id))
  })

  return useHttp(url)
}

export const useAdminPostSchedule = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_SCHEDULE, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Jadwal Posyandu Berhasil Dibuat')
        router.push('/admin/schedule')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminPutSchedule = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_SCHEDULE_BYID.replace('{id}', unref(id)), {
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

export const useAdminDeleteSchedule = (id: string) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_DELETE_SCHEDULE_BYID.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus Data Posyandu Berhasil')
        router.push('/admin/schedule')
      },
      onError: () => {
        message.error('Hapus Data Posyandu gagal')
      }
    }
  })
}

//GET HEALTHPOST
export const useAdminReadHealthpost = () => {
  return useHttp(API.GET_HEALTH_POST, {})
}

//get staff
export const useReadStaff = (healthPostId: Ref<string | undefined>) =>
  useHttp<Staff[]>(API.GET_STAFF, {
    params: computed(() => ({ healthPostId: healthPostId?.value }))
  })

  export interface Staff {
  id: string
  name: string
  email: string
  password: string
  phone: string
  type: string
  healthPostId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}