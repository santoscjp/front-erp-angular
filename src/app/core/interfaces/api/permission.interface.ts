import { Module } from './module.interface'

export interface Permission {
  _id: string
  permissionName: string
  description?: string
  isActive: boolean
  moduleId: string | Module
  isActiveForRole?: boolean
}
