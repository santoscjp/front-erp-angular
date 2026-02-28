import type { Route } from '@angular/router'
import { permissionGuard } from '@core/guards/permission.guard'
import { moduleGuard } from '@core/guards/module.guard'
import { PERMISSIONS } from '@core/interfaces/api/permission.interface'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'

export const VIEWS_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'chart-of-accounts',
    loadChildren: () =>
      import('./chart-of-accounts/chart-of-accounts.module').then(
        (m) => m.ChartOfAccountsModule,
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
      import('./journal-entries/journal-entries.module').then(
        (m) => m.JournalEntriesModule,
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
      import('./fiscal-periods/fiscal-periods.module').then(
        (m) => m.FiscalPeriodsModule,
      ),
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.FISCAL_PERIODS.READ,
    },
  },
  {
    path: 'general-ledger',
    loadChildren: () =>
      import('./general-ledger/general-ledger.module').then(
        (m) => m.GeneralLedgerModule,
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
      import('./financial-statements/financial-statements.module').then(
        (m) => m.FinancialStatementsModule,
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
      import('./bank-reconciliation/bank-reconciliation.module').then(
        (m) => m.BankReconciliationModule,
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
      import('./sri-reports/sri-reports.module').then(
        (m) => m.SriReportsModule,
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
      import('./settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.SETTINGS.READ,
    },
  },
  {
    path: 'users-management',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserModule),
    canActivate: [permissionGuard],
    data: { permission: PERMISSIONS.USERS.READ },
  },
  {
    path: 'system-management',
    loadChildren: () =>
      import('./system-management/system-management.module').then(
        (m) => m.SystemManagementModule,
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
]
