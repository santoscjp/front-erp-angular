import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '@core/services/api/auth.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs'
import { USER_SESSION } from '../../helpers/global/global.constants'
import { UserService } from '../../services/api/user.service'
import { StorageService } from '../../services/ui/storage.service'
import { UserActions } from './auth.actions'
import { User } from '../../interfaces/api/user.interface'

@Injectable()
export class AuthEffects {
  private _actions$ = inject(Actions)
  private _router = inject(Router)
  private _authService = inject(AuthenticationService)
  private _userService = inject(UserService)
  private _storageService = inject(StorageService)

  loadUserSession$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.loadUserSession),
      exhaustMap(() => this.loadUserSession()),
    ),
  )

  loginUser$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.userAuthenticationRequest),
      switchMap((action) => this.loginUser(action)),
      switchMap(() => this.reloadUserSessionAfterLogin()),
    ),
  )

  ssoAuth$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.ssoTokenReceived),
      switchMap((action) => {
        this._authService.handleSsoToken(action.token)
        return this._authService.getMeUser().pipe(
          map((response) => {
            const user = response.data
            const { permissions, isSuperAdmin, modules } =
              this.extractAuthData(user)
            const redirectPath = isSuperAdmin ? '/admin' : '/dashboard'
            this._router.navigate([redirectPath], { replaceUrl: true })
            return UserActions.ssoAuthenticationSuccess({
              user,
              permissions,
              isSuperAdmin,
              modules,
            })
          }),
          catchError((error) =>
            of(
              UserActions.ssoAuthenticationFailure({
                message: `SSO validation failed: ${error.message}`,
              }),
            ),
          ),
        )
      }),
    ),
  )

  logoutUser$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.userLogout),
      switchMap(() => {
        this._authService.logout()
        return [UserActions.completeUserLogout()]
      }),
    ),
  )

  updateUserProfile$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.requestUserProfileUpdate),
      map((action) => action.user),
      switchMap((user) =>
        this._userService.updateProfile(user).pipe(
          map((res) =>
            UserActions.userProfileUpdateSuccess({ user: res.data }),
          ),
          catchError((error) =>
            of(
              UserActions.userProfileUpdateFailure({
                message: error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  )

  // Private helpers

  private extractAuthData(user: User): {
    permissions: string[]
    isSuperAdmin: boolean
    modules: string[]
  } {
    const permissions = user.role?.permissions || []
    const isSuperAdmin = user.isSuperAdmin ?? false
    const modules = user.modules ?? []
    return { permissions, isSuperAdmin, modules }
  }

  private loadUserSession() {
    const storedSessionStr =
      this._storageService.secureStorage.getItem(USER_SESSION)

    let storedSession: unknown = null
    try {
      storedSession = JSON.parse(storedSessionStr)
    } catch {
      storedSession = null
    }

    if (storedSession) {
      return this._authService.getMeUser().pipe(
        map((response) => {
          const user = response.data
          const { permissions, isSuperAdmin, modules } =
            this.extractAuthData(user)
          return UserActions.userAuthenticationSuccess({
            user,
            permissions,
            isSuperAdmin,
            modules,
          })
        }),
        catchError((error) => {
          return of(
            UserActions.userAuthenticationFailure({
              message: `Failed to load session: ${error.message}`,
            }),
          )
        }),
      )
    } else {
      return of(
        UserActions.userAuthenticationFailure({
          message: 'User session not found.',
        }),
      )
    }
  }

  private loginUser(
    action: ReturnType<typeof UserActions.userAuthenticationRequest>,
  ) {
    const { request } = action

    return this._authService.login(request).pipe(
      map((response) => {
        const loginData = response.data
        const permissions = loginData.permissions || []
        const isSuperAdmin = loginData.isSuperAdmin ?? false
        const modules = loginData.modules ?? []
        return UserActions.userAuthenticationSuccess({
          user: loginData as unknown as User,
          permissions,
          isSuperAdmin,
          modules,
        })
      }),
      catchError((error) =>
        of(
          UserActions.userAuthenticationFailure({
            message: `Login failed: ${error.message}`,
          }),
        ),
      ),
    )
  }

  private reloadUserSessionAfterLogin() {
    const storedSessionStr =
      this._storageService.secureStorage.getItem(USER_SESSION)

    let storedSession: unknown = null
    try {
      storedSession = JSON.parse(storedSessionStr)
    } catch {
      storedSession = null
    }

    if (storedSession) {
      return this._authService.getMeUser().pipe(
        map((response) => {
          const user = response.data
          const { permissions, isSuperAdmin, modules } =
            this.extractAuthData(user)
          const redirectPath = isSuperAdmin ? '/admin' : '/dashboard'
          this._router.navigate([redirectPath])

          return UserActions.userAuthenticationSuccess({
            user,
            permissions,
            isSuperAdmin,
            modules,
          })
        }),
        catchError((error) => {
          return of(
            UserActions.userAuthenticationFailure({
              message: `Failed to load session: ${error.message}`,
            }),
          )
        }),
      )
    } else {
      return of(
        UserActions.userAuthenticationFailure({
          message: 'User session not found.',
        }),
      )
    }
  }
}
