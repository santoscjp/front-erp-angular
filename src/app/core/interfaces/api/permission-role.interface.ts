import { Permission } from './permission.interface'

export interface RolePermission {
  _id?: string
  roleId: string
  permissionId: string | Permission
}
