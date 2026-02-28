import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable, Injector } from '@angular/core'
import { environment } from '@environment/environment'
import { ToastrNotificationService } from '../ui/notification.service'
import {
  ApiData,
  ApiResponse,
} from '@core/interfaces/api/api-response.interface'
import { Observable, tap } from 'rxjs'
import { User } from '@core/interfaces/api/user.interface'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public API_URL = `${environment.apiBaseUrl}/users`

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
    return this._httpClient.post<ApiResponse<User>>(this.API_URL, user)
  }

  public findUsers(filter: object): Observable<ApiResponse<ApiData<User[]>>> {
    const endpoint = `${this.API_URL}/get-all`
    const params = new HttpParams({ fromObject: { ...filter } })

    return this._httpClient.get<ApiResponse<ApiData<User[]>>>(endpoint, {
      params,
    })
  }

  public updateProfile(user: object): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/update-profile`
    return this._httpClient
      .patch<ApiResponse<User>>(endpoint, user)
      .pipe(tap((res) => this.showNotification(res.message, 'PROFILE.TITLE')))
  }

  public setUserPassword(
    id: number,
    newPassword: string,
  ): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/change-password`
    return this._httpClient
      .put<ApiResponse<User>>(endpoint, { id, newPassword })
      .pipe(tap((res) => this.showNotification(res.message)))
  }

  public updateUser(id: number, user: object): Observable<ApiResponse<User>> {
    const endpoint = `${this.API_URL}/update-user/${id}`
    return this._httpClient
      .patch<ApiResponse<User>>(endpoint, user)
      .pipe(tap((res) => this.showNotification(res.message, 'USER.TITLE')))
  }

  private showNotification(
    message: string,
    title: string = 'profile.title',
  ): void {
    this.notificationService.showNotification({
      title,
      message,
      type: 'success',
    })
  }
}
