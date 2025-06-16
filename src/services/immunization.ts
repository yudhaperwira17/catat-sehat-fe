import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { computed, unref, type Ref } from 'vue'

// export interface UserImmunizationResponse {
//   data: UserImmunization[]
//   meta: Meta
// }

export interface Root {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  name: string
  lastVaccineGiven: any
  upcomingVaccine: string
  immunizationStatus: number
  vaccineId: string
  expanded?: boolean
}

export interface Detail {
  id: string
  name: string
  suggestedAge: string
  dateGiven: any
  vaccineStatus: any
  note: any
  order: number
}

export interface DetailData {
  nameVaccine: string
  age: string
  date: string
  status: string
  note?: string
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
  url: any
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

// export const useUserReadImmunization = (params: Ref<Record<string, any>>) => {
//   return useHttp<UserImmunizationResponse>(API.useUserReadImmunization, {
//     params
//   })
// }

export const useUserReadImmunization = (id: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_IMMUNIZATION.replace('{childrenId}', unref(id))
  })

  return useHttp(url)
}


export const useUserReadImmunizationById = (childrenId: Ref<string>, vaccineId: Ref<string>) => {
  const url = computed(() => {
    return API.USER_GET_IMMUNIZATION_BYID
      .replace('{childrenId}', unref(childrenId))
      .replace('{vaccineId}', unref(vaccineId));
  });

  return useHttp(url);
};

// export const useUserReadImmunizationById = (id: Ref<string>) => {
//   const url = computed(() => {
//     return API.USER_GET_IMMUNIZATION_BYID.replace('{id}', unref(id))
//   })

//   return useHttp(url)
// }
