import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { combineLatest, filter, map, switchMap, take } from 'rxjs'
import {
  selectIsSuperAdmin,
  selectModules,
  selectSessionLoaded,
} from '@core/states/auth/auth.selectors'

export const moduleGuard: CanActivateFn = (route) => {
  const store = inject(Store)
  const router = inject(Router)

  const requiredModule = route.data?.['module'] as string | undefined

  if (!requiredModule) return true

  return store.select(selectSessionLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    switchMap(() =>
      combineLatest([
        store.select(selectIsSuperAdmin),
        store.select(selectModules),
      ]).pipe(take(1)),
    ),
    map(([isSuperAdmin, modules]) => {
      if (isSuperAdmin) return true
      if (modules.includes(requiredModule)) return true
      router.navigate(['/dashboard'])
      return false
    }),
  )
}
