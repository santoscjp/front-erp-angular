import { Routes } from '@angular/router'
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component'
import { LayoutComponent } from './shared/components/layouts/layout/layout.component'
import { AuthGuard } from '@core/guards/auth.guard'
import { LoginGuard } from '@core/guards/login.guard'
import { superAdminGuard } from '@core/guards/super-admin.guard'
import { SsoCallbackComponent } from './features/auth/pages/sso-callback/sso-callback.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth/sso-callback',
    component: SsoCallbackComponent,
  },
  {
    path: 'admin',
    component: LayoutComponent,
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, superAdminGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./features/views.route').then((mod) => mod.VIEWS_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [LoginGuard],
  },
]
