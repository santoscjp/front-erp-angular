import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GeneralLedgerComponent } from './pages/general-ledger.component'

const routes: Routes = [
  {
    path: '',
    component: GeneralLedgerComponent,
    data: { title: 'General Ledger' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralLedgerRoutingModule {}
