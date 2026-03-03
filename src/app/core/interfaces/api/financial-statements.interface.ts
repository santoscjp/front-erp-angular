export interface TrialBalanceItem {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

export interface BalanceSheetItem {
  category: string
  accountName: string
  amount: number
}

export interface IncomeStatementItem {
  category: string
  description: string
  amount: number
}
