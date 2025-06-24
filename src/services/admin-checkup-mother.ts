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
  type: string
  month: number
  height: number
  weight: number
  upperArmCircumference: number
  fundusMeasurement: number
  bmi: number
  bmiStatus: string
  status: string
  location: any
  publicStaff: any
  motherId: string
  healthPostId: string
  adminId: string
  fileDiagnosedId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  healthPost: HealthPost
  admin: Admin
  fileDiagnosed: any
  mother: Mother
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

export interface Admin {
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

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}

const { message } = createDiscreteApi(['message'])

export const useAdminPostCheckupMother = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_CHECKUP_MOTHER, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Kesehatan Anak berhasil ditambahkan')
        router.push('/admin/checkup-mother')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminReadCheckupMother = (params: Ref<Record<string, any>>) =>
  useHttp<Data>(API.ADMIN_GET_CHECKUP_MOTHER, {
    params
  })

export const useAdminReadCheckupMotherById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_CHECKUP_MOTHER_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useAdminEditCheckupMother = (id: Ref<string>) => {
  return useHttpMutation(API.ADMIN_PUT_CHECKUP_MOTHER.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Kesehatan Anak berhasil')
      },
      onError: () => {
        message.error('Update Kesehatan Anak gagal')
      }
    }
  })
}
export const useAdminDeleteCheckupMother = (id: string) => {
  return useHttpMutation(API.ADMIN_DELETE_CHECKUP_MOTHER.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus data kesehatan Anak berhasil')
      },
      onError: () => {
        message.error('Hapus Data Kesehatan Anak Gagal')
      }
    }
  })
}
//GET HEALTHPOST
export const useAdminReadHealthpost = () => {
  return useHttp(API.GET_HEALTH_POST, {})
}
//Get staff
export const useReadStaff = (healthPostId: Ref<string | undefined>) =>
  useHttp<Daum[]>(API.GET_STAFF, {
    params: computed(() => ({ healthPostId: healthPostId?.value }))
  })


  //scan 

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

export const useAdminExportCheckupMother = (params: Ref<Record<string, any>>) =>
  useHttp<Data>(API.ADMIN_GET_EXPORT_BMI_MOTHER, {
    params
  })
