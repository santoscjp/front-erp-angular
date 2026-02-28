import { HttpClient } from '@angular/common/http'
import { inject, Injectable, Injector } from '@angular/core'
import { environment } from '@environment/environment'
import { ToastrNotificationService } from '../ui/notification.service'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import { Observable, map, of, switchMap, tap } from 'rxjs'
import { Role } from '@core/interfaces/api/rol.interface'
import { Permission, PERMISSIONS } from '@core/interfaces/api/permission.interface'

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  public API_URL = `${environment.apiBaseUrl}/roles`
  private _notificationService!: ToastrNotificationService

  private _httpClient = inject(HttpClient)
  private _injector = inject(Injector)

  private get notificationService(): ToastrNotificationService {
    if (!this._notificationService) {
      this._notificationService = this._injector.get(ToastrNotificationService)
    }
    return this._notificationService
  }

  public getRolePermissions(roleId: number): Observable<ApiResponse<Role>> {
    const endpoint = `${this.API_URL}/${roleId}`
    return this._httpClient.get<ApiResponse<Role>>(endpoint)
  }

  public updateRolePermissions(
    roleId: number,
    permissions: string[],
  ): Observable<ApiResponse<Role>> {
    const endpoint = `${this.API_URL}/${roleId}/permissions`
    return this._httpClient
      .patch<ApiResponse<Role>>(endpoint, { permissions })
      .pipe(
        tap((res) =>
          this.showNotification(
            res.message,
            'ROLES_AND_PERMISSIONS.PERMISSION.TITLE',
          ),
        ),
      )
  }

  public getPermissionsByRoleAndModule(
    roleId: number,
    categoryId: number,
    search: string = '',
    _page: number = 1,
    _size: number = 50,
  ): Observable<{ data: { result: Permission[] } }> {
    return this.getRolePermissions(roleId).pipe(
      map((response) => {
        const rolePermissions = response.data?.permissions || []
        const categoryKey = Object.keys(PERMISSIONS)[categoryId - 1]
        if (!categoryKey) return { data: { result: [] as Permission[] } }

        const categoryPerms = (PERMISSIONS as Record<string, Record<string, string>>)[
          categoryKey
        ]
        const permissions: Permission[] = Object.entries(categoryPerms)
          .map(([actionKey, permName], index) => ({
            id: categoryId * 100 + index + 1,
            name: permName,
            permissionName: permName,
            description: actionKey.charAt(0) + actionKey.slice(1).toLowerCase(),
            resource: categoryKey.toLowerCase(),
            action: actionKey.toLowerCase(),
            isActiveForRole: rolePermissions.includes(permName),
          }))
          .filter(
            (p) =>
              !search || p.name.toLowerCase().includes(search.toLowerCase()),
          )

        return { data: { result: permissions } }
      }),
    )
  }

  public getPermissionById(
    _id: number,
  ): Observable<{ data: { result: Permission | null } }> {
    return of({ data: { result: null } })
  }

  public createPermission(
    _data: object,
  ): Observable<{ message: string }> {
    return of({ message: 'Not supported in flat RBAC mode' })
  }

  public updatePermission(
    _id: number,
    _data: object,
  ): Observable<{ message: string }> {
    return of({ message: 'Not supported in flat RBAC mode' })
  }

  public togglePermissionStatus(
    roleId: number,
    permissionName: string,
  ): Observable<ApiResponse<Role>> {
    return this.getRolePermissions(roleId).pipe(
      switchMap((response) => {
        const current = response.data?.permissions || []
        const updated = current.includes(permissionName)
          ? current.filter((p: string) => p !== permissionName)
          : [...current, permissionName]
        return this.updateRolePermissions(roleId, updated)
      }),
    )
  }

  private showNotification(
    message: string,
    title: string = 'ROLES_AND_PERMISSIONS.PERMISSION.TITLE',
  ): void {
    this.notificationService.showNotification({
      title,
      message,
      type: 'success',
    })
  }
}
