import type { Route } from '@angular/router'
import { UserComponent } from './pages/user.component'

export const USER_ROUTES: Route[] = [
  {
    path: 'users',
    component: UserComponent,
    data: { title: 'USER.TITLE' },
  },
]
