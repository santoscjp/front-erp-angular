import { inject, Injectable, Injector } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { environment } from '@environment/environment'
import {
  ApiResponse,
  ApiData,
} from '@core/interfaces/api/api-response.interface'
import {
  Emisor,
  EmisorListItem,
  EmisorCreateRequest,
  EmisorUpdateRequest,
  EmisorModuleUpdateRequest,
  EmisorStatusRequest,
  EmisorModule,
} from '@core/interfaces/api/company.interface'
import { AdminDashboardStats } from '@core/interfaces/api/admin.interface'
import { User } from '@core/interfaces/api/user.interface'
import { ToastrNotificationService } from '../ui/notification.service'

@Injectable({ providedIn: 'root' })
export class AdminEmisorService {
  private API_URL = `${environment.apiBaseUrl}/admin`
  private _httpClient = inject(HttpClient)
  private _injector = inject(Injector)
  private _notificationService!: ToastrNotificationService

  private get notificationService(): ToastrNotificationService {
    if (!this._notificationService) {
      this._notificationService = this._injector.get(ToastrNotificationService)
    }
    return this._notificationService
  }

  getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this._httpClient.get<ApiResponse<AdminDashboardStats>>(
      `${this.API_URL}/dashboard`,
    )
  }

  getEmisores(
    filter: Record<string, string>,
  ): Observable<ApiResponse<ApiData<EmisorListItem[]>>> {
    const params = new HttpParams({ fromObject: { ...filter } })
    return this._httpClient.get<ApiResponse<ApiData<EmisorListItem[]>>>(
      `${this.API_URL}/issuers`,
      { params },
    )
  }

  getEmisorById(id: number): Observable<ApiResponse<Emisor>> {
    return this._httpClient.get<ApiResponse<Emisor>>(
      `${this.API_URL}/issuers/${id}`,
    )
  }

  createEmisor(
    data: EmisorCreateRequest,
  ): Observable<ApiResponse<Emisor>> {
    return this._httpClient
      .post<ApiResponse<Emisor>>(`${this.API_URL}/issuers`, data)
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }

  updateEmisor(
    emisorId: number,
    data: EmisorUpdateRequest,
  ): Observable<ApiResponse<Emisor>> {
    return this._httpClient
      .put<ApiResponse<Emisor>>(
        `${this.API_URL}/issuers/${emisorId}`,
        data,
      )
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }

  updateEmisorStatus(
    emisorId: number,
    data: EmisorStatusRequest,
  ): Observable<ApiResponse<Emisor>> {
    return this._httpClient
      .patch<ApiResponse<Emisor>>(
        `${this.API_URL}/issuers/${emisorId}/status`,
        data,
      )
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }

  getEmisorModules(
    emisorId: number,
  ): Observable<ApiResponse<EmisorModule[]>> {
    return this._httpClient.get<ApiResponse<EmisorModule[]>>(
      `${this.API_URL}/issuers/${emisorId}/modules`,
    )
  }

  updateEmisorModules(
    emisorId: number,
    data: EmisorModuleUpdateRequest,
  ): Observable<ApiResponse<Emisor>> {
    return this._httpClient
      .put<ApiResponse<Emisor>>(
        `${this.API_URL}/issuers/${emisorId}/modules`,
        data,
      )
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.MODULES.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }

  syncInvoicing(
    emisorId: number,
    body: { adminPassword?: string } = {},
  ): Observable<ApiResponse<{ sourceEmisorId: number }>> {
    return this._httpClient
      .post<ApiResponse<{ sourceEmisorId: number }>>(
        `${this.API_URL}/issuers/${emisorId}/sync-invoicing`,
        body,
      )
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.MODULES.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }

  getEmisorUsers(
    emisorId: number,
    filter: Record<string, string>,
  ): Observable<ApiResponse<ApiData<User[]>>> {
    const params = new HttpParams({ fromObject: { ...filter } })
    return this._httpClient.get<ApiResponse<ApiData<User[]>>>(
      `${this.API_URL}/issuers/${emisorId}/users`,
      { params },
    )
  }

  createEmisorUser(
    emisorId: number,
    data: Record<string, unknown>,
  ): Observable<ApiResponse<User>> {
    return this._httpClient
      .post<ApiResponse<User>>(
        `${this.API_URL}/issuers/${emisorId}/users`,
        data,
      )
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.USERS.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }

  updateEmisorUser(
    userId: number,
    data: Record<string, unknown>,
  ): Observable<ApiResponse<User>> {
    return this._httpClient
      .put<ApiResponse<User>>(
        `${environment.apiBaseUrl}/auth/users/${userId}`,
        data,
      )
      .pipe(
        tap((res) =>
          this.notificationService.showNotification({
            title: 'ADMIN.EMISOR.USERS.TITLE',
            message: res.message,
            type: 'success',
          }),
        ),
      )
  }
}
