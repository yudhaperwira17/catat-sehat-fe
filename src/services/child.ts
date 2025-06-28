import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export interface Root {
  message: string
  data: Data
  status: number
}

export interface Data {
  data: Daum[]
}

export interface Daum {
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
  childPicture: any
  birthCertificate: any
  kiaCard: any
  familyCard: any
  age: number
}

export const useReadChild = () => useHttp<Data>(API.USER_GET_CHILD, {})

export const userReadChildById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_CHILD_ID.replace('{id}', unref(id))
  })
  return useHttp(url)
}

export const useUserChildRegistration = () => {
  const router = useRouter()
  return useHttpMutation(API.USER_POST_CHILD, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Registrasi anak berhasil')
        router.push('/user/setting-account')
      },
      onError: (error) => {
        if (error?.data?.message === 'HttpException: Mother not found') {
          message.error(
            'Gagal menambahkan data anak. Silakan tambahkan data orang tua terlebih dulu'
          )
        } else {
          message.error(error?.data?.message)
        }
      }
    }
  })
}

export const useUserPutChild = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.USER_PUT_CHILD.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Data anak berhasil')
        router.push('/user/setting-account')
      },
      onError: () => {
        message.error('Update Data anak gagal')
      }
    }
  })
}

export const useUserDeleteChild = (id: string) => {
  const router = useRouter()
  return useHttpMutation(API.USER_DELETE_CHILD.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus Data anak berhasil')
        router.push('/user/setting-account')
      },
      onError: () => {
        message.error('Hapus Data anak gagal')
      }
    }
  })
}

export const useUserPostRefreshCode = (id: Ref<string>) => {
  return useHttpMutation(API.USER_POST_REFRESH_CODE.replace('{id}', unref(id)), {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Kode berhasil dibuat ulang')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}
