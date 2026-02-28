import type { Route } from '@angular/router'
import { ChartOfAccountsComponent } from './pages/chart-of-accounts.component'

export const CHART_OF_ACCOUNTS_ROUTES: Route[] = [
  {
    path: '',
    component: ChartOfAccountsComponent,
    data: { title: 'Chart of Accounts' },
  },
]
