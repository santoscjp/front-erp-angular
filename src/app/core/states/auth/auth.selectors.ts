import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UserState } from '../../interfaces/api/user.interface'

export const selectAuth = createFeatureSelector<Readonly<UserState>>('auth')

export const selectErrorMessage = createSelector(
  selectAuth,
  (state) => state.message,
)

export const selectUserId = createSelector(
  selectAuth,
  (state) => state.user?.id,
)

export const selectLoading = createSelector(
  selectAuth,
  (state) => state.loading,
)

export const selectUser = createSelector(selectAuth, (state) => state.user)

export const selectPermissions = createSelector(
  selectAuth,
  (state) => state.permissions,
)

export const selectIsSuperAdmin = createSelector(
  selectAuth,
  (state) => state.isSuperAdmin,
)

export const selectModules = createSelector(
  selectAuth,
  (state) => state.modules,
)

export const selectHasPermission = (permission: string) =>
  createSelector(
    selectPermissions,
    (permissions) =>
      permissions.includes('all') || permissions.includes(permission),
  )

export const selectHasModule = (moduleKey: string) =>
  createSelector(
    selectIsSuperAdmin,
    selectModules,
    (isSuperAdmin, modules) => isSuperAdmin || modules.includes(moduleKey),
  )
