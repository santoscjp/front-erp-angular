import { createAction, props } from '@ngrx/store'
import { User, LoginRequest } from '../../interfaces/api/user.interface'

// Sesion y Autenticacion
const loadUserSession = createAction('[User] Load Session')

const userAuthenticationRequest = createAction(
  '[User] Authentication Request',
  props<{ request: LoginRequest }>(),
)

const userAuthenticationSuccess = createAction(
  '[User] Authentication Success',
  props<{
    user: User
    permissions: string[]
    isSuperAdmin: boolean
    modules: string[]
  }>(),
)

const userAuthenticationFailure = createAction(
  '[User] Authentication Failure',
  props<{ message: string }>(),
)

// SSO Token Flow
const ssoTokenReceived = createAction(
  '[User] SSO Token Received',
  props<{ token: string }>(),
)

const ssoAuthenticationSuccess = createAction(
  '[User] SSO Authentication Success',
  props<{
    user: User
    permissions: string[]
    isSuperAdmin: boolean
    modules: string[]
  }>(),
)

const ssoAuthenticationFailure = createAction(
  '[User] SSO Authentication Failure',
  props<{ message: string }>(),
)

// Logout
const userLogout = createAction('[User] Logout')

const completeUserLogout = createAction('[User] Complete Logout')

// Perfil de Usuario
const requestUserProfileUpdate = createAction(
  '[User] Request Profile Update',
  props<{ user: object }>(),
)

const userProfileUpdateSuccess = createAction(
  '[User] Profile Update Success',
  props<{ user: User }>(),
)

const userProfileUpdateFailure = createAction(
  '[User] Profile Update Failure',
  props<{ message: string }>(),
)

export const UserActions = {
  // Sesion y Autenticacion
  loadUserSession,
  userAuthenticationRequest,
  userAuthenticationSuccess,
  userAuthenticationFailure,

  // SSO
  ssoTokenReceived,
  ssoAuthenticationSuccess,
  ssoAuthenticationFailure,

  // Logout
  userLogout,
  completeUserLogout,

  // Perfil de Usuario
  requestUserProfileUpdate,
  userProfileUpdateSuccess,
  userProfileUpdateFailure,
}
