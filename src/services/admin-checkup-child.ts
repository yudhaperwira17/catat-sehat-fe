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
  height: number
  weight: number
  headCircumference: number
  gender: string
  bmi: number
  bmiStatus: string
  status: string
  childrenId: string
  adminId: string
  healthPostId: string
  fileDiagnosedId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  children: Children
  healthPost: HealthPost
  admin: Admin
  fileDiagnosed: any
}

export interface Children {
  id: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  childOrder: number
  bloodType: string
  height: number
  weight: number
  address: string
  gender: string
  code: string
  userId: string
  motherId: string
  childPictureId: any
  birthCertificateId: any
  kiaCardId: any
  familyCardId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
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

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}

const { message } = createDiscreteApi(['message'])

export const useAdminPostCheckupChild = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_CHECKUP_CHILD, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Kesehatan Anak berhasil ditambahkan')
        router.push('/admin/checkup-child')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminReadCheckupChild = (params: Ref<Record<string, any>>) =>
  useHttp<Data>(API.ADMIN_GET_CHECKUP_CHILD, {
    params
  })

export const useAdminReadCheckupChildById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_CHECKUP_CHILD_BYID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useAdminEditeCheckupChild = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_CHECKUP_CHILD.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Kesehatan Anak berhasil')
        router.push('/admin/checkup-child')
      },
      onError: () => {
        message.error('Update Kesehatan Anak gagal')
      }
    }
  })
}
export const useAdminDeleteCheckupChild = (id: string) => {
  return useHttpMutation(API.ADMIN_DELETE_CHECKUP_CHILD.replace('{id}', id), {
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
    return API.ADMIN_GET_CHILD_BYCODE.replace('{code}', unref(id))
  })
  return useHttp<AdminChildCode>(url)
}

export const adminUpdateMotherByCode = (id: ComputedRef<string>) => {
  return useHttpMutation<AdminChildCode>(
    computed(() => API.ADMIN_GET_CHILD_BYCODE.replace('{code}', unref(id))),
    {
      method: 'GET'
    }
  )
}

export interface ResponseCode {
  message: string
  data: AdminChildCode
  status: number
}

export interface AdminChildCode {
  id: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  childOrder: number
  bloodType: string
  height: number
  weight: number
  address: string
  gender: string
  code: string
  userId: string
  motherId: string
  childPictureId: any
  birthCertificateId: any
  kiaCardId: any
  familyCardId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  mother: Mother
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