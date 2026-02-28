import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { RESPONSE_CODES } from '@core/helpers/global/auth.constants'
import { USER_SESSION } from '@core/helpers/global/global.constants'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { StorageService } from '@core/services/ui/storage.service'
import { TranslateService } from '@ngx-translate/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private _notificationService = inject(ToastrNotificationService)
  private _translateService = inject(TranslateService)
  private _storageService = inject(StorageService)
  private router = inject(Router)

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this._translateService.instant(
          'WORDS.UNKNOWN_ERROR',
        )
        if (error.error && error.error.message) {
          errorMessage = error.error.message
        }

        switch (error.status) {
          case RESPONSE_CODES.UNAUTHORIZED:
            this._storageService.secureStorage.removeItem(USER_SESSION)
            this.router.navigate(['/auth/login'])
            break
          case RESPONSE_CODES.FORBIDDEN:
            if (req.url.includes('/auth/login')) {
              this.router.navigate(['/auth/account-deactivation'])
            }
            break
          case RESPONSE_CODES.CONFLICT:
          case RESPONSE_CODES.LOCKED:
            break
          default:
            break
        }

        const isSyncInvoicing = req.url.includes('sync-invoicing')
        const isSilentError =
          (error.status === RESPONSE_CODES.BAD_REQUEST &&
            errorMessage.includes('contraseña del administrador')) ||
          (error.status === RESPONSE_CODES.CONFLICT && isSyncInvoicing)

        if (!isSilentError) {
          this._notificationService.showNotification({
            type: 'error',
            title: 'Error',
            message: errorMessage,
          })
        }

        return throwError(() => new Error(errorMessage))
      }),
    )
  }
}

export const ERROR_INTERCEPTOR_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
]
