import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChartOfAccountsComponent } from './pages/chart-of-accounts.component'

const routes: Routes = [
  {
    path: '',
    component: ChartOfAccountsComponent,
    data: { title: 'Chart of Accounts' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartOfAccountsRoutingModule {}
