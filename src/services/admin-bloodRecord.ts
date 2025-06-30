import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

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
  date: string
  staffName: any
  staffJob: any
  note: string
  adminId: string
  motherId: string
  monthId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  mother: Mother
  monthBlood: MonthBlood
  admin: Admin
  type: string
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

export interface MonthBlood {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string
  phone: string
  type: string
  healthPostId: any
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

export const useAdminPostBloodRecord = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_BLOOD_SUPLEMENT, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Catat Tambah Darah ditambahkan')
        router.push('/admin/blood-suplement')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminReadBloodRecord = (params: Ref<Record<string, any>>) =>
  useHttp<Data>(API.ADMIN_GET_BLOOD_SUPLEMENT, {
    params
  })

export const useAdminReadBloodRecordById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_BLOOD_SUPLEMENT_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useAdminEditBloodSuplement = (id: Ref<string>) => {
  return useHttpMutation(API.ADMIN_PUT_BLOOD_SUPLEMENT.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Catat TTD berhasil')
      },
      onError: () => {
        message.error('Update Catat TTD gagal')
      }
    }
  })
}

export const useAdminDeleteCheckupMother = (id: string) => {
  return useHttpMutation(API.ADMIN_DELETE_BLOOD_SUPLEMENT.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus data Catat TTD berhasil')
      },
      onError: () => {
        message.error('Hapus Data Catat TTD Gagal')
      }
    }
  })
}

export const useAdminReadMonthBlood = () => {
  return useHttp(API.ADMIN_GET_MONTH_BLOOD_SUPLEMENT, {})
}

export const adminCheckupMotherByCode = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_MOTHER_BYCODE.replace('{code}', unref(id))
  })
  return useHttp<AdminMotherCode>(url)
}

export const adminUpdateMotherByCode = (id: ComputedRef<string>) => {
  return useHttpMutation<AdminMotherCode>(
    computed(() => API.ADMIN_GET_MOTHER_BYCODE.replace('{code}', unref(id))),
    {
      method: 'GET'
    }
  )
}

export interface ResponseCode {
  message: string
  data: AdminMotherCode
  status: number
}

export interface AdminMotherCode {
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
