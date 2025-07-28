import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'


const { message } = createDiscreteApi(['message'])


export interface Root {
  message: string
  data: Data
  status: number
}

export interface Data {
  data: DataCheckup[]
  meta: Meta
}

export interface DataCheckup {
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

export interface Graphic {
  day: string
  bmi: number
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}


export const useUserCheckupParents = () => {
  const router = useRouter()
  return useHttpMutation(API.USER_POST_CHECKUP_PARENTS, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Kesehatan Orang Tua berhasil ditambahkan')
        router.push('/user/health-mom')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useReadParentsCheckup =(params: Ref<Record<string, any>>) => useHttp<Data>(API.USER_GET_CHECKUP_PARENTS, {
  params
})

export const useReadParentsCheckupById = (id: Ref<string>) => {
  const url = computed(() => {
      return API.USER_GET_CHECKUP_BYID_PARENTS.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useReadParentsCheckupGraphic = (params: ComputedRef<{
  startDate: string | undefined;
  endDate: string | undefined;
  page: number;
  limit: number;
}>) => {
  const url = computed(() => {
      return API.USER_GET_CHECKUP_GRAPHIC_PARENTS
  })
  return useHttp<Graphic[]>(url, {
    params: computed(() => unref(params))
  })
}
