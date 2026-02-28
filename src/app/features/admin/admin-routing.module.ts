import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component'
import { EmisorListComponent } from './pages/emisor-list/emisor-list.component'
import { EmisorFormComponent } from './pages/emisor-form/emisor-form.component'
import { EmisorDetailComponent } from './pages/emisor-detail/emisor-detail.component'

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    data: { title: 'ADMIN.DASHBOARD.TITLE' },
  },
  {
    path: 'issuers',
    component: EmisorListComponent,
    data: { title: 'ADMIN.EMISOR.TITLE' },
  },
  {
    path: 'issuers/new',
    component: EmisorFormComponent,
    data: { title: 'ADMIN.EMISOR.NEW' },
  },
  {
    path: 'issuers/:id',
    component: EmisorDetailComponent,
    data: { title: 'ADMIN.EMISOR.DETAIL' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
