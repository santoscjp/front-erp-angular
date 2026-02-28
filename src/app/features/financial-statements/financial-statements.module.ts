import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { FinancialStatementsRoutingModule } from './financial-statements-routing.module'
import { FinancialStatementsComponent } from './pages/financial-statements.component'

@NgModule({
  declarations: [FinancialStatementsComponent],
  imports: [SharedModule, FinancialStatementsRoutingModule],
})
export class FinancialStatementsModule {}
