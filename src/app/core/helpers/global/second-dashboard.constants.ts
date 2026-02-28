export type StatType = {
  title: string
  icon: string
  count: string
  change: number
  variant: string
  iconBg: string
}

export type OverViewChartType = {
  title: string
  count: number
  icon: string
  variant?: string
}

export type ReportGroupType = {
  title: string
  items: ReportItemType[]
}

export type ReportItemType = {
  label: string
  url: string
}

export const statData: StatType[] = [
  {
    title: 'Total Item',
    icon: 'ti-clipboard-list',
    count: '458',
    change: 7,
    variant: 'success',
    iconBg: 'primary',
  },
  {
    title: 'Total Supplier',
    icon: 'ti-users-group',
    count: '60',
    change: 7,
    variant: 'success',
    iconBg: 'warning',
  },
  {
    title: 'Total Sales Invoice',
    icon: 'ti-file-invoice',
    count: '240',
    change: 7,
    variant: 'success',
    iconBg: 'success',
  },
  {
    title: 'Total Lead',
    icon: 'ti-trending-up',
    count: '158',
    change: 7,
    variant: 'success',
    iconBg: 'info',
  },
]

export const overViewChartData: OverViewChartType[] = [
  {
    title: 'Income',
    count: 72,
    icon: 'ti-arrow-up-right',
    variant: 'danger',
  },
  {
    title: 'Expense',
    count: 72,
    icon: 'ti-arrow-up-right',
    variant: 'success',
  },
  {
    title: 'Net Profits',
    count: 72,
    icon: 'ti-arrow-up-right',
    variant: 'success',
  },
]

export const reportGroupsData: ReportGroupType[] = [
  {
    title: 'Accounting',
    items: [
      { label: 'Payables', url: '/accounting/payables' },
      { label: 'Receivables', url: '/accounting/receivables' },
    ],
  },
  {
    title: 'Stock',
    items: [
      { label: 'Stock Overview', url: '/stock/overview' },
      { label: 'Product Categories', url: '/stock/categories' },
    ],
  },
  {
    title: 'CRM',
    items: [
      { label: 'Leads Management', url: '/crm/leads' },
      { label: 'Customer Management', url: '/crm/customers' },
    ],
  },
]
