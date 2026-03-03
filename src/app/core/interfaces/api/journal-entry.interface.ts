import { JournalEntryStatus } from '@/app/shared/enums/journal-entry-status.enum'

export interface JournalEntryDetail {
  id?: number
  accountId: number
  accountCode?: string
  accountName?: string
  description: string
  debit: number
  credit: number
}

export interface JournalEntry {
  id: number
  number: string
  date: string
  description: string
  status: JournalEntryStatus
  originType: string
  details: JournalEntryDetail[]
  createdAt: string
  createdByName?: string
}

export interface JournalEntryCreateRequest {
  date: string
  description: string
  details: Omit<JournalEntryDetail, 'id' | 'accountCode' | 'accountName'>[]
}
