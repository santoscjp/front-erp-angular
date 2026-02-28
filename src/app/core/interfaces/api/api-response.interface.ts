export interface ApiResponse<T> {
  statusCode: number
  status: string
  message: string
  data: T
}

export interface ApiData<T> {
  result: T
  totalCount: number
}
