import { API } from "@/composable/http/api-constant";
import { useHttp, useHttpMutation } from "@/composable/http/http";
import { createDiscreteApi } from "naive-ui";
import { computed, unref, type Ref } from "vue";

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
  name: string
  address: string
  subDistrictId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  subDistrict: SubDistrict
}

export interface SubDistrict {
  id: string
  name: string
  districtId: string
  createdAt: string
  updatedAt: string
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}
const {message} = createDiscreteApi(['message']);

export const useAdminReadHealthpost = (params: Ref<Record<string, any>>) => {
    return useHttp<Data>(API.ADMIN_GET_HEALTH_POST, {
        params
    })
}

export const useAdminReadHealthpostById = (id: Ref<string>) => {
    const url = computed(() => {
      return API.ADMIN_GET_HEALTH_POST_BYID.replace('{id}', unref(id))
    })
    return useHttp(url)
}

export const useAdminPostHealthpost = () => {
  return useHttpMutation(API.ADMIN_POST_HEALTH_POST, {
    method: 'POST',
    queryOptions: {
      onSuccess: () =>{
        message.success('Data Posyandu berhasil ditambahkan')
      },
      onError: (error) =>{
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminEditHealthpost = (id: Ref<string>) => {
  return useHttpMutation(API.ADMIN_PUT_HEALTH_POST.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: ()=>{
        message.success('Ubah Data Posyandu Berhasil')
      },
      onError: () =>{
        message.error('Ubah Data Posyandu Gagal')
      }
    }
  })
}

export const useAdminDeleteHealthpost = (id: string) => {
  return useHttpMutation(API.ADMIN_DELETE_HEALTH_POST.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus Data Posyandu Berhasil')
      },
      onError: () => {
        message.error('Hapus Data Posyandu Gagal')
      }
    }
  })
}
export const useAdminReadStaff = () => {
  return useHttp(API.GET_STAFF, {})
}