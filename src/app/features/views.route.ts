import type { Route } from '@angular/router'
import { BlockedComponent } from './auth/pages/blocked/blocked.component'
import { PERMISSIONS_ROLES_AND_PERMISSIONS } from '@core/helpers/global/global.constants'

export const VIEWS_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.route').then((mod) => mod.DASHBOARD_ROUTES),
  },
  {
    path: 'users-management',
    loadChildren: () =>
      import('./user/user.route').then((mod) => mod.USER_ROUTES),
  },
  {
    path: 'system-management',
    loadChildren: () =>
      import('./system-management/system-management.route').then(
        (mod) => mod.SYSTEM_MANAGEMENT_ROUTES
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.route').then((mod) => mod.PROFILE_ROUTES),
  },
]
