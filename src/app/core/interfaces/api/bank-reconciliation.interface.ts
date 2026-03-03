export interface BankReconciliation {
  id: number
  bankAccountId: number
  periodId: number
  bookBalance: number
  bankBalance: number
  date: string
  status: string
}

export interface BankReconciliationDetail {
  id: number
  reconciliationId: number
  movementType: string
  description: string
  amount: number
  isReconciled: boolean
  date: string
}

export interface BankReconciliationCreateRequest {
  bankAccountId: number
  periodId: number
  bookBalance: number
  bankBalance: number
  date: string
}
