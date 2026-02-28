export interface Permission {
  id: number
  name: string
  description: string | null
  resource: string
  action: string
  permissionName?: string
  isActiveForRole?: boolean
}

export const PERMISSIONS = {
  CHART_OF_ACCOUNTS: {
    READ: 'chart_of_accounts:read',
    WRITE: 'chart_of_accounts:write',
  },
  JOURNAL_ENTRIES: {
    READ: 'journal_entries:read',
    WRITE: 'journal_entries:write',
    APPROVE: 'journal_entries:approve',
  },
  FISCAL_PERIODS: {
    READ: 'fiscal_periods:read',
    CLOSE: 'fiscal_periods:close',
  },
  GENERAL_LEDGER: {
    READ: 'general_ledger:read',
  },
  FINANCIAL_STATEMENTS: {
    READ: 'financial_statements:read',
  },
  BANK_RECONCILIATION: {
    READ: 'bank_reconciliation:read',
    WRITE: 'bank_reconciliation:write',
  },
  SRI_REPORTS: {
    READ: 'sri_reports:read',
    GENERATE: 'sri_reports:generate',
  },
  USERS: {
    READ: 'users:read',
    WRITE: 'users:write',
  },
  SETTINGS: {
    READ: 'settings:read',
    WRITE: 'settings:write',
  },
} as const
