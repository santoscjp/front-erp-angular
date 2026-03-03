export interface SriReport {
  id: number
  periodId: number
  type: string
  status: string
  generatedAt: string | null
  xmlData?: string
}
