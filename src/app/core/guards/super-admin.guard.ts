import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { filter, map, switchMap, take } from 'rxjs'
import {
  selectIsSuperAdmin,
  selectSessionLoaded,
} from '@core/states/auth/auth.selectors'

export const superAdminGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(selectSessionLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    switchMap(() => store.select(selectIsSuperAdmin).pipe(take(1))),
    map((isSuperAdmin) => {
      if (isSuperAdmin) return true
      router.navigate(['/dashboard'])
      return false
    }),
  )
}
