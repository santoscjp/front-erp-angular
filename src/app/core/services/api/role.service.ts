import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable, Injector } from '@angular/core'
import { environment } from '@environment/environment'
import { ToastrNotificationService } from '../ui/notification.service'
import {
  ApiData,
  ApiResponse,
} from '@core/interfaces/api/api-response.interface'
import { Observable, tap } from 'rxjs'
import { Role } from '@core/interfaces/api/rol.interface'

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private API_URL = `${environment.apiBaseUrl}/auth/role`
  private _notificationService!: ToastrNotificationService

  private _httpClient = inject(HttpClient)
  private _injector = inject(Injector)

  private get notificationService(): ToastrNotificationService {
    if (!this._notificationService) {
      this._notificationService = this._injector.get(ToastrNotificationService)
    }
    return this._notificationService
  }

  public createRole(role: Partial<Role>): Observable<ApiResponse<Role>> {
    const endpoint = `${this.API_URL}/create`
    return this._httpClient
      .post<ApiResponse<Role>>(endpoint, role)
      .pipe(
        tap((res) =>
          this.showNotification(
            res.message,
            'ROLES_AND_PERMISSIONS.ROLE.TITLE',
          ),
        ),
      )
  }

  public getAllRoles(
    displayName?: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<ApiData<Role[]>>> {
    const endpoint = `${this.API_URL}`

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())

    if (displayName) {
      params = params.set('displayName', displayName)
    }

    return this._httpClient.get<ApiResponse<ApiData<Role[]>>>(endpoint, {
      params,
    })
  }

  public getSelectableRoles(): Observable<ApiResponse<Role[]>> {
    const endpoint = `${environment.apiBaseUrl}/auth/roles`
    return this._httpClient.get<ApiResponse<Role[]>>(endpoint)
  }

  public getRoleById(id: number): Observable<ApiResponse<ApiData<Role>>> {
    const endpoint = `${this.API_URL}/${id}`
    return this._httpClient.get<ApiResponse<ApiData<Role>>>(endpoint)
  }

  public updateRole(
    id: number,
    role: Partial<Role>,
  ): Observable<ApiResponse<Role>> {
    const endpoint = `${this.API_URL}/update/${id}`
    return this._httpClient
      .patch<ApiResponse<Role>>(endpoint, role)
      .pipe(
        tap((res) =>
          this.showNotification(
            res.message,
            'ROLES_AND_PERMISSIONS.ROLE.TITLE',
          ),
        ),
      )
  }

  public toggleRoleStatus(id: number): Observable<ApiResponse<Role>> {
    const endpoint = `${this.API_URL}/toggle-status/${id}`
    return this._httpClient
      .patch<ApiResponse<Role>>(endpoint, {})
      .pipe(
        tap((res) =>
          this.showNotification(
            res.message,
            'ROLES_AND_PERMISSIONS.ROLE.TITLE',
          ),
        ),
      )
  }

  private showNotification(
    message: string,
    title: string = 'ROLES_AND_PERMISSIONS.ROLE.TITLE',
  ): void {
    this.notificationService.showNotification({
      title,
      message,
      type: 'success',
    })
  }
}
