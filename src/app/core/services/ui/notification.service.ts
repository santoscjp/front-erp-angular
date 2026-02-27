import { inject, Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr'
import { DEFAULT_GLOBAL_TOASTR_CONFIG } from '@core/helpers/ui/ui.constants'
import { ApiMessage } from '@core/interfaces/api/message.interface'
import { ToastrNotification } from '@core/interfaces/ui/notification.interface'
import { LanguageService } from './language.service'

@Injectable({
  providedIn: 'root',
})
export class ToastrNotificationService {
  private _toastrService = inject(ToastrService)
  private _translateService = inject(TranslateService)
  private _lang = inject(LanguageService)

  public showNotification(notification: ToastrNotification): void {
    const { type, message, title, config } = notification
    const titleText = title ? this._translateService.instant(title) : ''
    const messageText = this.getMessageTest(message)
    const configFormatted = { ...DEFAULT_GLOBAL_TOASTR_CONFIG, ...config }
    this._toastrService[type](messageText, titleText, configFormatted)
  }

  public getMessageTest(message: ApiMessage): string {
    let messageFormatted = ''

    if (typeof message === 'string') {
      messageFormatted = message
    }

    if (typeof message === 'object') {
      const language = this._lang.code.value
      const messageText = message[language] || ''
      messageFormatted = messageText
    }

    return messageFormatted
  }
}
