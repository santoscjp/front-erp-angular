import type { Route } from '@angular/router'
import { SriReportsComponent } from './pages/sri-reports.component'

export const SRI_REPORTS_ROUTES: Route[] = [
  {
    path: '',
    component: SriReportsComponent,
    data: { title: 'SRI Reports' },
  },
]
