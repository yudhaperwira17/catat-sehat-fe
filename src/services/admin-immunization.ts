import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import type { Data } from '@/pages/(private)/admin/immunization-optional.vue'
import { createDiscreteApi } from 'naive-ui'
import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export interface AdminImmunizationResponse {
  data: DataImmunization[]
  meta: Meta
}

export interface DataImmunization {
  id: string
  dateGiven: number
  note: string
  upcomingVaccine: any
  lastVaccineGiven: any
  vaccineStatus: number
  immunizationStatus: any
  childrenId: string
  vaccineId: string
  vaccineStageId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  children: Children
  vaccineStage: VaccineStage
}

export interface Children {
  id: string
  userId: string
  motherId: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  age: number
  childOrder: number
  bloodType: string
  height: number
  weight: number
  address: any
  code: string
  gender: string
  childPictureId: string
  birthCertificateId: string
  kiaCardId: string
  familyCardId: string
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

export interface VaccineStage {
  id: string
  name: string
  suggestedAge: string
  vaccineId: string
  createdAt: string
  updatedAt: string
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}
export const useAdminReadVaccine = () => {
  return useHttp(API.ADMIN_GET_VACCINE, {})
}

export const useAdminReadImmunization = (params: Ref<Record<string, any>>) => {
  return useHttp<AdminImmunizationResponse>(API.ADMIN_GET_IMMUNIZATION, {
    params
  })
}

export const useAdminReadImmunizationById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_IMMUNIZATION_BYID.replace('{id}', unref(id))
  })

  return useHttp(url)
}

export const useAdminPostImmunization = () => {
  return useHttpMutation(API.ADMIN_POST_IMMUNIZATION, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Imunisasi Anak berhasil ditambahkan')
        // router.push('/admin/immunization')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminPostImmunizations = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_IMMUNIZATIONS, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Imunisasi Anak berhasil ditambahkan')
        router.push('/admin/immunization')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminPutImmunization = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_IMMUNIZATION.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Data Imunisasi berhasil')
        router.push('/admin/immunization')
      },
      onError: () => {
        message.error('Update Data Imunisasi gagal')
      }
    }
  })
}

export const useAdminDeleteImmuunization = (id: string) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_DELETE_IMMUNIZATION.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus data kesehatan Anak berhasil')
        router.push('/admin/immunization')
      },
      onError: () => {
        message.error('Hapus Data Kesehatan Anak Gagal')
      }
    }
  })
}

//optional 
export const useAdminReadImmunizationOptional = (params: Ref<Record<string, any>>) => {
  return useHttp<Data>(API.ADMIN_GET_OPTIONAL_IMMUNIZATION, {
    params
  })
}

export const useAdminReadImmunizationOptionalById = (id: Ref<string>) => {
  const url = computed(() => {
    return API.ADMIN_GET_OPTIONAL_IMMUNIZATION_BYID.replace('{id}', unref(id))
  })

  return useHttp(url)
}

export const useAdminPostImmunizationsOptional = () => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_POST_OPTIONAL_IMMUNIZATION, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Imunisasi Anak berhasil ditambahkan')
        router.push('/admin/immunization-optional')
      },
      onError: (error) => {
        message.error(error.data.message)
      }
    }
  })
}

export const useAdminPutImmunizationOptional = (id: Ref<string>) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_PUT_OPTIONAL_IMMUNIZATION.replace('{id}', unref(id)), {
    method: 'PUT',
    queryOptions: {
      onSuccess: () => {
        message.success('Update Data Imunisasi berhasil')
        router.push('/admin/immunization-optional')
      },
      onError: () => {
        message.error('Update Data Imunisasi gagal')
      }
    }
  })
}

export const useAdminDeleteImmuunizationOptional = (id: string) => {
  const router = useRouter()
  return useHttpMutation(API.ADMIN_DELETE_OPTIONAL_IMMUNIZATION.replace('{id}', id), {
    method: 'DELETE',
    queryOptions: {
      onSuccess: () => {
        message.success('Hapus data kesehatan Anak berhasil')
        router.push('/admin/immunization-optional')
      },
      onError: () => {
        message.error('Hapus Data Kesehatan Anak Gagal')
      }
    }
  })
}
