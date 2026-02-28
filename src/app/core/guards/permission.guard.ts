import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, take } from 'rxjs'
import { selectPermissions } from '@core/states/auth/auth.selectors'
import { ADMIN_PERMISSION } from '@core/helpers/global/global.constants'

export const permissionGuard: CanActivateFn = (route) => {
  const store = inject(Store)
  const router = inject(Router)

  const requiredPermission = route.data?.['permission'] as string | undefined

  if (!requiredPermission) return true

  return store.select(selectPermissions).pipe(
    take(1),
    map((permissions) => {
      if (permissions.includes(ADMIN_PERMISSION)) return true
      if (permissions.includes(requiredPermission)) return true
      router.navigate(['/dashboard'])
      return false
    }),
  )
}
