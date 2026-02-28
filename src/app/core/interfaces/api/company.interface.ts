import { ModuleKey } from '@/app/shared/enums/module-key.enum'

export interface EmisorModule {
  moduleKey: string
  isActive: boolean
}

export interface Emisor {
  id: number
  ruc: string
  businessName: string
  tradeName: string | null
  mainAddress: string
  accountingObligation: 'SI' | 'NO'
  specialTaxpayerCode: string | null
  retentionAgent: boolean
  microenterpriseRegime: boolean
  rimpeRegime: boolean
  sourceSystem: string
  sourceEmisorId: number | null
  isActive: boolean
  modules?: EmisorModule[]
  userCount?: number
  createdAt?: string
  updatedAt?: string
}

export type Company = Emisor

export interface EmisorListItem extends Emisor {
  modules: EmisorModule[]
  userCount: number
}

export interface EmisorCreateRequest {
  ruc: string
  businessName: string
  tradeName?: string
  mainAddress: string
  accountingObligation?: 'SI' | 'NO'
  specialTaxpayerCode?: string
  retentionAgent?: boolean
  microenterpriseRegime?: boolean
  rimpeRegime?: boolean
  modules: ModuleKey[]
  adminUser: {
    username: string
    email: string
    firstName: string
    lastName: string
    password: string
    roleId: number
  }
}

export interface EmisorModuleUpdateRequest {
  modules: Array<{ moduleKey: string; isActive: boolean }>
}

export interface EmisorUpdateRequest {
  businessName?: string
  tradeName?: string
  mainAddress?: string
  accountingObligation?: 'SI' | 'NO'
  specialTaxpayerCode?: string
  retentionAgent?: boolean
  microenterpriseRegime?: boolean
  rimpeRegime?: boolean
}

export interface EmisorStatusRequest {
  isActive: boolean
}
