import { inject, Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr'
import { DEFAULT_GLOBAL_TOASTR_CONFIG } from '@core/helpers/ui/ui.constants'
import { ToastrNotification } from '@core/interfaces/ui/notification.interface'

@Injectable({
  providedIn: 'root',
})
export class ToastrNotificationService {
  private _toastrService = inject(ToastrService)
  private _translateService = inject(TranslateService)

  public showNotification(notification: ToastrNotification): void {
    const { type, message, title, config } = notification
    const titleText = title ? this._translateService.instant(title) : ''
    const configFormatted = { ...DEFAULT_GLOBAL_TOASTR_CONFIG, ...config }
    this._toastrService[type](message, titleText, configFormatted)
  }

  public getMessageTest(message: string): string {
    return message
  }
}
