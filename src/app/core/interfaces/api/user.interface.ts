import { Company } from './company.interface'
import { Role } from './rol.interface'

export interface User {
  _id?: string
  username: string
  firstName: string
  lastName: string
  password?: string
  email: string
  address?: string
  phone?: string
  failedLoginAttempts?: number
  isLocked?: boolean
  isActive?: boolean
  roleId: Role
  companyId: Company
  profilePhoto: string
  createdAt?: string
  updatedAt?: string
}

export interface UserLoginRequest {
  email: string
  password: string
}

export interface UserState {
  user: User | null
  message: string | null
  loading: boolean
}
