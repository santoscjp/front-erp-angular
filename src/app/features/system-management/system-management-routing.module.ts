import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RolesAndPermissionsComponent } from './pages/roles-and-permissions/roles-and-permissions.component'

const routes: Routes = [
  {
    path: 'roles-and-permissions',
    component: RolesAndPermissionsComponent,
    data: { title: 'SIDEBAR.ROLES_AND_PERMISSIONS' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManagementRoutingModule {}
