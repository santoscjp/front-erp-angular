import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { ChartOfAccountsRoutingModule } from './chart-of-accounts-routing.module'
import { ChartOfAccountsComponent } from './pages/chart-of-accounts.component'

@NgModule({
  declarations: [ChartOfAccountsComponent],
  imports: [SharedModule, ChartOfAccountsRoutingModule],
})
export class ChartOfAccountsModule {}
