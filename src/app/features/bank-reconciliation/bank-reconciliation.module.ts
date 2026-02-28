import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { BankReconciliationRoutingModule } from './bank-reconciliation-routing.module'
import { BankReconciliationComponent } from './pages/bank-reconciliation.component'

@NgModule({
  declarations: [BankReconciliationComponent],
  imports: [SharedModule, BankReconciliationRoutingModule],
})
export class BankReconciliationModule {}
