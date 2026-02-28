import type { Route } from '@angular/router'
import { BankReconciliationComponent } from './pages/bank-reconciliation.component'

export const BANK_RECONCILIATION_ROUTES: Route[] = [
  {
    path: '',
    component: BankReconciliationComponent,
    data: { title: 'Bank Reconciliation' },
  },
]
