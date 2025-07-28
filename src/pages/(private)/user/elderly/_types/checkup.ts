export interface DataCheckupListResponse {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: string
  height: number
  weight: number
  bmi: number
  bloodTension: number
  bloodSugar: number
  attend: string
  month: any
  bmiStatus: string
  status: string
  adminId: any
  elderlyId?: string
  healthPostId: any
  lungsConclutionId: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  healthPost: any
  elderly?: Elderly
  fileDiagnosed?: any
}

export interface Elderly {
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

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}
