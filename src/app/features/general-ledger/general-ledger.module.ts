import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { GeneralLedgerRoutingModule } from './general-ledger-routing.module'
import { GeneralLedgerComponent } from './pages/general-ledger.component'

@NgModule({
  declarations: [GeneralLedgerComponent],
  imports: [SharedModule, GeneralLedgerRoutingModule],
})
export class GeneralLedgerModule {}
