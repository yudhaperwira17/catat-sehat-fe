import { useHttp } from '@/composable/http/http'

export interface Root {
  elderlyCheckupByMonth: Record<string, June[]>
  elders: Elder[]
}

export interface ElderlyCheckupByMonth {
  January: June[]
  February: June[]
  March: June[]
  April: June[]
  May: June[]
  June: June[]
  July: June[]
  August: June[]
  September: June[]
  October: June[]
  November: June[]
  December: June[]
}

export interface June {
  id: string
  height: number
  weight: number
  bmi: number
  bloodTension: number
  bloodSugar: number
  attend: string
  bmiStatus: string
  status: string
  adminId: any
  elderlyId?: string
  healthPostId: any
  lungs: any
  fileDiagnosedId?: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Elder {
  id: string
  userId: string
  name: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  bloodType: string
  address: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export const useAttendList = (params: Ref<Record<string, any>>) => {
  return useHttp<Root>('/v1/admin/elderly/summary', {
    params
  })
}
