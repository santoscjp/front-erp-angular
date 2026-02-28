import type { Route } from '@angular/router'
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component'
import { EmisorListComponent } from './pages/emisor-list/emisor-list.component'
import { EmisorFormComponent } from './pages/emisor-form/emisor-form.component'
import { EmisorDetailComponent } from './pages/emisor-detail/emisor-detail.component'

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: AdminDashboardComponent,
    data: { title: 'ADMIN.DASHBOARD.TITLE' },
  },
  {
    path: 'emisores',
    component: EmisorListComponent,
    data: { title: 'ADMIN.EMISOR.TITLE' },
  },
  {
    path: 'emisores/nuevo',
    component: EmisorFormComponent,
    data: { title: 'ADMIN.EMISOR.NEW' },
  },
  {
    path: 'emisores/:id',
    component: EmisorDetailComponent,
    data: { title: 'ADMIN.EMISOR.DETAIL' },
  },
]
