import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { AdminRoutingModule } from './admin-routing.module'

// Pages
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component'
import { EmisorListComponent } from './pages/emisor-list/emisor-list.component'
import { EmisorFormComponent } from './pages/emisor-form/emisor-form.component'
import { EmisorDetailComponent } from './pages/emisor-detail/emisor-detail.component'

// Components
import { AdminCreateUserModalComponent } from './components/admin-create-user-modal/admin-create-user-modal.component'
import { AdminEditUserModalComponent } from './components/admin-edit-user-modal/admin-edit-user-modal.component'
import { EmisorModulesToggleComponent } from './components/emisor-modules-toggle/emisor-modules-toggle.component'
import { EmisorStatsCardsComponent } from './components/emisor-stats-cards/emisor-stats-cards.component'
import { EmisorUsersTableComponent } from './components/emisor-users-table/emisor-users-table.component'

@NgModule({
  declarations: [
    // Pages
    AdminDashboardComponent,
    EmisorListComponent,
    EmisorFormComponent,
    EmisorDetailComponent,

    // Components
    AdminCreateUserModalComponent,
    AdminEditUserModalComponent,
    EmisorModulesToggleComponent,
    EmisorStatsCardsComponent,
    EmisorUsersTableComponent,
  ],
  imports: [SharedModule, AdminRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
