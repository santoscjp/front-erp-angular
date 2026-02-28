import type { Route } from '@angular/router'
import { LoginComponent } from './pages/login/login.component'
import { BlockedComponent } from './pages/blocked/blocked.component'

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: 'account-deactivation',
    component: BlockedComponent,
    data: { title: 'Account Deactivation' },
  },
]
