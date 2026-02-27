import type { Route } from '@angular/router'
import { RolesAndPermissionsComponent } from './pages/roles-and-permissions/roles-and-permissions.component'

export const SYSTEM_MANAGEMENT_ROUTES: Route[] = [
  {
    path: 'roles-and-permissions',
    component: RolesAndPermissionsComponent,
    data: { title: 'SIDEBAR.ROLES_AND_PERMISSIONS' },
  },
]
