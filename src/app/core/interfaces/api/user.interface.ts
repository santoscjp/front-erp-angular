import { Role } from './rol.interface'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  isSuperAdmin: boolean
  role: Role | null
  emisorId: number | null
  emisorRuc?: string
  emisorName?: string
  sourceSystem: 'LOCAL' | 'INVOICING'
  twoFactorEnabled: boolean
  lockedUntil: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MeResponse {
  user: User
  modules: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
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
  username: string
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
  sessionLoaded: boolean
}
