import { Role } from './rol.interface'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  isSuperAdmin: boolean
  role: Role | null
  emisorId: number | null
  emisorRuc?: string
  emisorName?: string
  modules: string[]
  sourceSystem: 'LOCAL' | 'INVOICING'
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
  emisorRuc?: string
}

export interface LoginResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  isSuperAdmin: boolean
  role: string | null
  permissions: string[]
  emisorId: number | null
  emisorRuc?: string
  emisorName?: string
  modules: string[]
  token: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  emisorId: number
  roleId: number
}

export interface UserState {
  user: User | null
  isSuperAdmin: boolean
  permissions: string[]
  modules: string[]
  token: string | null
  message: string | null
  loading: boolean
}
