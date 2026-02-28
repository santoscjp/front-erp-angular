import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BankReconciliationComponent } from './pages/bank-reconciliation.component'

const routes: Routes = [
  {
    path: '',
    component: BankReconciliationComponent,
    data: { title: 'Bank Reconciliation' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankReconciliationRoutingModule {}
