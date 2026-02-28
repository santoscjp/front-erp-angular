export type RoleName =
  | 'ADMIN'
  | 'ACCOUNTANT'
  | 'ASSISTANT_ACCOUNTANT'
  | 'VIEWER'

export interface Role {
  id: number
  name: RoleName
  displayName: string
  description: string | null
  permissions: string[]
  isSystem: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface RoleState {
  roles: Role[]
  selectedRole: Role | null
  loading: boolean
  message: string | null
}
