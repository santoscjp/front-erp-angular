import type { Route } from '@angular/router'
import { GeneralLedgerComponent } from './pages/general-ledger.component'

export const GENERAL_LEDGER_ROUTES: Route[] = [
  {
    path: '',
    component: GeneralLedgerComponent,
    data: { title: 'General Ledger' },
  },
]
