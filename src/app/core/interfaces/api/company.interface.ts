import { ModuleKey } from '@/app/shared/enums/module-key.enum'

export interface EmisorModule {
  moduleKey: string
  isActive: boolean
}

export interface Emisor {
  id: number
  ruc: string
  razonSocial: string
  nombreComercial: string | null
  direccionMatriz: string
  obligadoContabilidad: 'SI' | 'NO'
  contribuyenteEspecial: string | null
  agenteRetencion: boolean
  regimenMicroempresa: boolean
  regimenRimpe: boolean
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
  razonSocial: string
  nombreComercial?: string
  direccionMatriz: string
  obligadoContabilidad?: 'SI' | 'NO'
  contribuyenteEspecial?: string
  agenteRetencion?: boolean
  regimenMicroempresa?: boolean
  regimenRimpe?: boolean
  modules: ModuleKey[]
  adminUser: {
    username: string
    email: string
    firstName: string
    lastName: string
    password: string
  }
}

export interface EmisorModuleUpdateRequest {
  modules: Array<{ moduleKey: string; isActive: boolean }>
}

export interface EmisorUpdateRequest {
  razonSocial?: string
  nombreComercial?: string
  direccionMatriz?: string
  obligadoContabilidad?: 'SI' | 'NO'
  contribuyenteEspecial?: string
  agenteRetencion?: boolean
  regimenMicroempresa?: boolean
  regimenRimpe?: boolean
}

export interface EmisorStatusRequest {
  isActive: boolean
}
