import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable, Injector } from '@angular/core'
import { environment } from '@environment/environment'
import { ToastrNotificationService } from '../ui/notification.service'
import {
  ApiData,
  ApiResponse,
} from '@core/interfaces/api/api-response.interface'
import { map, Observable, tap } from 'rxjs'
import { ApiMessage } from '@core/interfaces/api/message.interface'
import { User } from '@core/interfaces/api/user.interface'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public API_URL = `${environment.apiBaseUrl}/user`

  private _httpClient = inject(HttpClient)
  private _injector = inject(Injector)
  private _notificationService!: ToastrNotificationService

  private get notificationService(): ToastrNotificationService {
    if (!this._notificationService) {
      this._notificationService = this._injector.get(ToastrNotificationService)
    }
    return this._notificationService
  }

  public createUser(user: object): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/create`
    return this._httpClient.post<ApiResponse<User>>(endpoint, user)
  }

  public findUsers(filter: object): Observable<ApiResponse<ApiData<User[]>>> {
    const endpoint = `${this.API_URL}/get-all`
    const params = new HttpParams({ fromObject: { ...filter } })

    return this._httpClient.get<ApiResponse<ApiData<User[]>>>(endpoint, {
      params,
    })
  }

  public updateProfile(user: FormData): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/update-profile`
    return this._httpClient
      .patch<ApiResponse<User>>(endpoint, user)
      .pipe(tap((res) => this.showNotification(res.message, 'PROFILE.TITLE')))
  }

  public setUserPassword(
    id: string,
    newPassword: string
  ): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/change-password`
    return this._httpClient
      .put<ApiResponse<User>>(endpoint, { id, newPassword })
      .pipe(tap((res) => this.showNotification(res.message)))
  }

  public updateUser(id: string, user: object): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/update-user/${id}`
    return this._httpClient
      .patch<ApiResponse<User>>(endpoint, user)
      .pipe(tap((res) => this.showNotification(res.message, 'USER.TITLE')))
  }

  private showNotification(
    message: ApiMessage,
    title: string = 'profile.title'
  ): void {
    this._notificationService.showNotification({
      title,
      message,
      type: 'success',
    })
  }
}
