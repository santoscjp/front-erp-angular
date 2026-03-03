export interface ChartOfAccount {
  id: number
  code: string
  name: string
  type: string
  level: number
  parentId: number | null
  isActive: boolean
  children?: ChartOfAccount[]
}

export interface ChartOfAccountCreateRequest {
  code: string
  name: string
  type: string
  parentId: number | null
}

export interface ChartOfAccountUpdateRequest {
  name?: string
  isActive?: boolean
}
