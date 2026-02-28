import type { Route } from '@angular/router'
import { FiscalPeriodsComponent } from './pages/fiscal-periods.component'

export const FISCAL_PERIODS_ROUTES: Route[] = [
  {
    path: '',
    component: FiscalPeriodsComponent,
    data: { title: 'Fiscal Periods' },
  },
]
