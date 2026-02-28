import type { Route } from '@angular/router'
import { FinancialStatementsComponent } from './pages/financial-statements.component'

export const FINANCIAL_STATEMENTS_ROUTES: Route[] = [
  {
    path: '',
    component: FinancialStatementsComponent,
    data: { title: 'Financial Statements' },
  },
]
