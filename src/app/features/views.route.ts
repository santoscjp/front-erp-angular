import type { Route } from '@angular/router'
import { permissionGuard } from '@core/guards/permission.guard'
import { moduleGuard } from '@core/guards/module.guard'
import { PERMISSIONS } from '@core/interfaces/api/permission.interface'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'

export const VIEWS_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.route').then(
        (mod) => mod.DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'chart-of-accounts',
    loadChildren: () =>
      import('./chart-of-accounts/chart-of-accounts.route').then(
        (mod) => mod.CHART_OF_ACCOUNTS_ROUTES,
      ),
    canActivate: [permissionGuard, moduleGuard],
    data: {
      permission: PERMISSIONS.CHART_OF_ACCOUNTS.READ,
      module: ModuleKey.CHART_OF_ACCOUNTS,
    },
  },
  {
    path: 'journal-entries',
    loadChildren: () =>
      import('./journal-entries/journal-entries.route').then(
        (mod) => mod.JOURNAL_ENTRIES_ROUTES,
      ),
    canActivate: [permissionGuard, moduleGuard],
    data: {
      permission: PERMISSIONS.JOURNAL_ENTRIES.READ,
      module: ModuleKey.JOURNAL_ENTRIES,
    },
  },
  {
    path: 'fiscal-periods',
    loadChildren: () =>
      import('./fiscal-periods/fiscal-periods.route').then(
        (mod) => mod.FISCAL_PERIODS_ROUTES,
      ),
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.FISCAL_PERIODS.READ,
    },
  },
  {
    path: 'general-ledger',
    loadChildren: () =>
      import('./general-ledger/general-ledger.route').then(
        (mod) => mod.GENERAL_LEDGER_ROUTES,
      ),
    canActivate: [permissionGuard, moduleGuard],
    data: {
      permission: PERMISSIONS.GENERAL_LEDGER.READ,
      module: ModuleKey.GENERAL_LEDGER,
    },
  },
  {
    path: 'financial-statements',
    loadChildren: () =>
      import('./financial-statements/financial-statements.route').then(
        (mod) => mod.FINANCIAL_STATEMENTS_ROUTES,
      ),
    canActivate: [permissionGuard, moduleGuard],
    data: {
      permission: PERMISSIONS.FINANCIAL_STATEMENTS.READ,
      module: ModuleKey.FINANCIAL_STATEMENTS,
    },
  },
  {
    path: 'bank-reconciliation',
    loadChildren: () =>
      import('./bank-reconciliation/bank-reconciliation.route').then(
        (mod) => mod.BANK_RECONCILIATION_ROUTES,
      ),
    canActivate: [permissionGuard, moduleGuard],
    data: {
      permission: PERMISSIONS.BANK_RECONCILIATION.READ,
      module: ModuleKey.BANK_RECONCILIATION,
    },
  },
  {
    path: 'sri-reports',
    loadChildren: () =>
      import('./sri-reports/sri-reports.route').then(
        (mod) => mod.SRI_REPORTS_ROUTES,
      ),
    canActivate: [permissionGuard, moduleGuard],
    data: {
      permission: PERMISSIONS.SRI_REPORTS.READ,
      module: ModuleKey.SRI_REPORTS,
    },
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.route').then((mod) => mod.SETTINGS_ROUTES),
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.SETTINGS.READ,
    },
  },
  {
    path: 'users-management',
    loadChildren: () =>
      import('./user/user.route').then((mod) => mod.USER_ROUTES),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.USERS.READ },
  },
  {
    path: 'system-management',
    loadChildren: () =>
      import('./system-management/system-management.route').then(
        (mod) => mod.SYSTEM_MANAGEMENT_ROUTES,
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.route').then((mod) => mod.PROFILE_ROUTES),
  },
]
