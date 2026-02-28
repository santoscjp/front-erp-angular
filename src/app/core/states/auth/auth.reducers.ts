import { createReducer, on } from '@ngrx/store'
import { UserActions } from './auth.actions'
import { UserState } from '../../interfaces/api/user.interface'

export const initialUserState: UserState = {
  user: null,
  isSuperAdmin: false,
  permissions: [],
  modules: [],
  token: null,
  message: null,
  loading: false,
  sessionLoaded: false,
}

export const authReducer = createReducer(
  initialUserState,

  // Sesion y Autenticacion
  on(UserActions.loadUserSession, (state) => ({
    ...state,
    loading: true,
    message: 'Loading user session...',
  })),
  on(UserActions.userAuthenticationRequest, (state) => ({
    ...state,
    loading: true,
    message: 'Authenticating user...',
  })),
  on(
    UserActions.userAuthenticationSuccess,
    (state, { user, permissions, isSuperAdmin, modules }) => ({
      ...state,
      user,
      permissions,
      isSuperAdmin,
      modules,
      loading: false,
      sessionLoaded: true,
      message: 'Authentication successful.',
    }),
  ),
  on(UserActions.userAuthenticationFailure, (state, { message }) => ({
    ...state,
    loading: false,
    sessionLoaded: true,
    message: `Authentication failed: ${message}`,
  })),

  // SSO
  on(UserActions.ssoTokenReceived, (state) => ({
    ...state,
    loading: true,
    message: 'Validating SSO token...',
  })),
  on(
    UserActions.ssoAuthenticationSuccess,
    (state, { user, permissions, isSuperAdmin, modules }) => ({
      ...state,
      user,
      permissions,
      isSuperAdmin,
      modules,
      loading: false,
      sessionLoaded: true,
      message: 'SSO authentication successful.',
    }),
  ),
  on(UserActions.ssoAuthenticationFailure, (state, { message }) => ({
    ...state,
    loading: false,
    sessionLoaded: true,
    message: `SSO authentication failed: ${message}`,
  })),

  // Logout
  on(UserActions.userLogout, (state) => ({
    ...state,
    loading: true,
    message: 'Logging out...',
  })),
  on(UserActions.completeUserLogout, () => ({
    ...initialUserState,
    message: 'User logged out successfully.',
  })),

  // User Profile
  on(UserActions.requestUserProfileUpdate, (state) => ({
    ...state,
    loading: true,
    message: 'Updating user profile...',
  })),
  on(UserActions.userProfileUpdateSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    message: 'Profile updated successfully.',
  })),

  on(UserActions.userProfileUpdateFailure, (state, { message }) => ({
    ...state,
    loading: false,
    message: `Failed to update profile: ${message}`,
  })),
)
