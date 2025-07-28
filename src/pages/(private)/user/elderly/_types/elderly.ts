export interface DataElderlyListResponse {
  data: Daum[]
  meta: Meta
}

export interface Daum {
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
