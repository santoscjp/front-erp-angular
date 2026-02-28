import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { FiscalPeriodsRoutingModule } from './fiscal-periods-routing.module'
import { FiscalPeriodsComponent } from './pages/fiscal-periods.component'

@NgModule({
  declarations: [FiscalPeriodsComponent],
  imports: [SharedModule, FiscalPeriodsRoutingModule],
})
export class FiscalPeriodsModule {}
