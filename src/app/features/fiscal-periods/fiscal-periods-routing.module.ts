import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FiscalPeriodsComponent } from './pages/fiscal-periods.component'

const routes: Routes = [
  {
    path: '',
    component: FiscalPeriodsComponent,
    data: { title: 'Fiscal Periods' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiscalPeriodsRoutingModule {}
