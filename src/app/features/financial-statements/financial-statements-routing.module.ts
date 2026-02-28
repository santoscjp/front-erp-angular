import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FinancialStatementsComponent } from './pages/financial-statements.component'

const routes: Routes = [
  {
    path: '',
    component: FinancialStatementsComponent,
    data: { title: 'Financial Statements' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialStatementsRoutingModule {}
