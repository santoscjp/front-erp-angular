import { FiscalPeriodStatus } from '@/app/shared/enums/fiscal-period-status.enum'

export interface FiscalPeriod {
  id: number
  year: number
  month: number
  status: FiscalPeriodStatus
  isClosed: boolean
  closedDate: string | null
}
