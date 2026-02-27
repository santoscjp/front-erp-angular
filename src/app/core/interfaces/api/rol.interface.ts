export interface Role {
  _id: string
  roleName: string
  description?: string
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
