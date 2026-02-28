import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { UserRoutingModule } from './user-routing.module'

// Pages
import { UserComponent } from './pages/user.component'

// Components
import { TableUserComponent } from './components/tables/table-user/table-user.component'
import { CreateUserComponent } from './components/forms/create-user/create-user.component'
import { CreateDetailsUserComponent } from './components/forms/create-details-user/create-details-user.component'
import { CreateEditUserComponent } from './components/forms/create-edit-user/create-edit-user.component'
import { UserFilterFormComponent } from './components/filter/user-filter-form/user-filter-form.component'
import { UserModalFormComponent } from './components/modal/user-modal-form/user-modal-form.component'

@NgModule({
  declarations: [
    // Pages
    UserComponent,

    // Components
    TableUserComponent,
    CreateUserComponent,
    CreateDetailsUserComponent,
    CreateEditUserComponent,
    UserFilterFormComponent,
    UserModalFormComponent,
  ],
  imports: [SharedModule, UserRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
