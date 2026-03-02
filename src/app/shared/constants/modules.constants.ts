import { ModuleKey } from '../enums/module-key.enum'

export const MODULE_LABELS: Record<ModuleKey, string> = {
  [ModuleKey.INVOICING]: 'SIDEBAR.INVOICING',
  [ModuleKey.CHART_OF_ACCOUNTS]: 'SIDEBAR.CHART_OF_ACCOUNTS',
  [ModuleKey.JOURNAL_ENTRIES]: 'SIDEBAR.JOURNAL_ENTRIES',
  [ModuleKey.FISCAL_PERIODS]: 'SIDEBAR.FISCAL_PERIODS',
  [ModuleKey.GENERAL_LEDGER]: 'SIDEBAR.GENERAL_LEDGER',
  [ModuleKey.FINANCIAL_STATEMENTS]: 'SIDEBAR.FINANCIAL_STATEMENTS',
  [ModuleKey.BANK_RECONCILIATION]: 'SIDEBAR.BANK_RECONCILIATION',
  [ModuleKey.SRI_REPORTS]: 'SIDEBAR.SRI_REPORTS',
} as const

export const MODULE_ROUTES: Record<ModuleKey, string | null> = {
  [ModuleKey.INVOICING]: null,
  [ModuleKey.CHART_OF_ACCOUNTS]: '/chart-of-accounts',
  [ModuleKey.JOURNAL_ENTRIES]: '/journal-entries',
  [ModuleKey.FISCAL_PERIODS]: '/fiscal-periods',
  [ModuleKey.GENERAL_LEDGER]: '/general-ledger',
  [ModuleKey.FINANCIAL_STATEMENTS]: '/financial-statements',
  [ModuleKey.BANK_RECONCILIATION]: '/bank-reconciliation',
  [ModuleKey.SRI_REPORTS]: '/sri-reports',
} as const

export const MODULE_ICONS: Record<ModuleKey, string> = {
  [ModuleKey.INVOICING]: 'ti-receipt',
  [ModuleKey.CHART_OF_ACCOUNTS]: 'ti-list-tree',
  [ModuleKey.JOURNAL_ENTRIES]: 'ti-notebook',
  [ModuleKey.FISCAL_PERIODS]: 'ti-calendar',
  [ModuleKey.GENERAL_LEDGER]: 'ti-book',
  [ModuleKey.FINANCIAL_STATEMENTS]: 'ti-report-analytics',
  [ModuleKey.BANK_RECONCILIATION]: 'ti-building-bank',
  [ModuleKey.SRI_REPORTS]: 'ti-file-text',
} as const
