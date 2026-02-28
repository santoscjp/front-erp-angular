import type { Route } from '@angular/router'
import { SettingsComponent } from './pages/settings.component'

export const SETTINGS_ROUTES: Route[] = [
  {
    path: '',
    component: SettingsComponent,
    data: { title: 'Settings' },
  },
]
