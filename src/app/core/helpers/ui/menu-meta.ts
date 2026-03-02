import { ModuleKey } from '@/app/shared/enums/module-key.enum'

export type MenuItemType = {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    variant: string
    text: string
  }
  parentKey?: string
  isDisabled?: boolean
  collapsed?: boolean
  children?: MenuItemType[]
  permission?: string
  module?: string
  isExternal?: boolean
}

export type SubMenus = {
  item: MenuItemType
  linkClassName?: string
  subMenuClassName?: string
  activeMenuItems?: Array<string>
  toggleMenu?: (item: MenuItemType, status: boolean) => void
  className?: string
}

export const ADMIN_MENU_ITEMS: MenuItemType[] = [
  {
    key: 'ADMINISTRATION',
    label: 'ADMINISTRATION',
    isTitle: true,
  },
  {
    key: 'ADMIN_DASHBOARD',
    label: 'ADMIN_DASHBOARD',
    icon: 'ti-dashboard',
    url: '/admin',
  },
  {
    key: 'EMISORES',
    label: 'EMISORES',
    icon: 'ti-building',
    url: '/admin/issuers',
  },
]

export const MENU_ITEMS: MenuItemType[] = [
  // Business
  {
    key: 'BUSINESS',
    label: 'BUSINESS',
    isTitle: true,
  },
  {
    key: 'HOME',
    label: 'HOME',
    icon: 'ti-home',
    url: '/dashboard',
  },
  {
    key: 'ACCOUNTING',
    label: 'ACCOUNTING',
    icon: 'ti-calculator',
    collapsed: true,
    children: [
      {
        key: 'CHART_OF_ACCOUNTS',
        label: 'CHART_OF_ACCOUNTS',
        url: '/chart-of-accounts',
        parentKey: 'ACCOUNTING',
        permission: 'chart_of_accounts:read',
        module: ModuleKey.CHART_OF_ACCOUNTS,
      },
      {
        key: 'JOURNAL_ENTRIES',
        label: 'JOURNAL_ENTRIES',
        url: '/journal-entries',
        parentKey: 'ACCOUNTING',
        permission: 'journal_entries:read',
        module: ModuleKey.JOURNAL_ENTRIES,
      },
      {
        key: 'GENERAL_LEDGER',
        label: 'GENERAL_LEDGER',
        url: '/general-ledger',
        parentKey: 'ACCOUNTING',
        permission: 'general_ledger:read',
        module: ModuleKey.GENERAL_LEDGER,
      },
      {
        key: 'FINANCIAL_STATEMENTS',
        label: 'FINANCIAL_STATEMENTS',
        url: '/financial-statements',
        parentKey: 'ACCOUNTING',
        permission: 'financial_statements:read',
        module: ModuleKey.FINANCIAL_STATEMENTS,
      },
      {
        key: 'FISCAL_PERIODS',
        label: 'FISCAL_PERIODS',
        url: '/fiscal-periods',
        parentKey: 'ACCOUNTING',
        permission: 'fiscal_periods:read',
        module: ModuleKey.FISCAL_PERIODS,
      },
    ],
  },
  {
    key: 'INVOICING',
    label: 'INVOICING',
    icon: 'ti-receipt',
    module: ModuleKey.INVOICING,
    isExternal: true,
  },
  {
    key: 'BANK_RECONCILIATION',
    label: 'BANK_RECONCILIATION',
    icon: 'ti-building-bank',
    url: '/bank-reconciliation',
    permission: 'bank_reconciliation:read',
    module: ModuleKey.BANK_RECONCILIATION,
  },
  {
    key: 'SRI_REPORTS',
    label: 'SRI_REPORTS',
    icon: 'ti-file-text',
    url: '/sri-reports',
    permission: 'sri_reports:read',
    module: ModuleKey.SRI_REPORTS,
  },

  // Management
  {
    key: 'MANAGEMENT',
    label: 'MANAGEMENT',
    isTitle: true,
  },
  {
    key: 'USERS_MANAGEMENT',
    label: 'USERS_MANAGEMENT',
    icon: 'ti-users',
    url: '/users-management',
    permission: 'users:read',
  },
  {
    key: 'SETTINGS',
    label: 'SETTINGS',
    icon: 'ti-settings',
    url: '/settings',
    permission: 'settings:read',
  },
]

export const HORIZONTAL_MENU_ITEM: MenuItemType[] = [
  {
    key: 'dashboards',
    label: 'Dashboards',
    icon: 'ti-dashboard',
    children: [
      {
        key: 'sales',
        label: 'Sales',
        url: '/dashboards/sales',
        parentKey: 'dashboards',
      },
      {
        key: 'clinic',
        label: 'Clinic',
        url: '/dashboards/clinic',
        parentKey: 'dashboards',
      },
      {
        key: 'wallet',
        label: 'eWallet',
        url: '/dashboards/wallet',
        parentKey: 'dashboards',
      },
    ],
  },
]
