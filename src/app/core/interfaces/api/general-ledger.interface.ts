export interface GeneralLedgerEntry {
  date: string
  entryNumber: string
  description: string
  debit: number
  credit: number
  balance: number
  accountId: number
  accountCode: string
  accountName: string
}

export interface GeneralLedgerFilter {
  accountId?: number
  periodId?: number
}
