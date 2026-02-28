import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { SystemManagementRoutingModule } from './system-management-routing.module'

// Pages
import { RolesAndPermissionsComponent } from './pages/roles-and-permissions/roles-and-permissions.component'

// Components
import { RoleLeftSideBarComponent } from './components/hierarchical-list/role-left-side-bar/role-left-side-bar.component'
import { ModuleAreaComponent } from './components/hierarchical-list/module-area/module-area.component'
import { PermissionRigthSideBarComponent } from './components/hierarchical-list/permission-rigth-side-bar/permission-rigth-side-bar.component'
import { RoleFormComponent } from './components/forms/role-form/role-form.component'
import { ModuleFormComponent } from './components/forms/module-form/module-form.component'
import { PermissionFormComponent } from './components/forms/permission-form/permission-form.component'

@NgModule({
  declarations: [
    // Pages
    RolesAndPermissionsComponent,

    // Components
    RoleLeftSideBarComponent,
    ModuleAreaComponent,
    PermissionRigthSideBarComponent,
    RoleFormComponent,
    ModuleFormComponent,
    PermissionFormComponent,
  ],
  imports: [SharedModule, SystemManagementRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SystemManagementModule {}
