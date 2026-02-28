import { IndividualConfig } from 'ngx-toastr'

export interface ToastrNotification {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  title?: string
  config?: Partial<IndividualConfig<any>>
}
