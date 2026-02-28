import { CommonModule } from '@angular/common'
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Permission } from '@core/interfaces/api/permission.interface'
import { PermissionService } from '@core/services/api/permission.service'
import { SelectionService } from '@core/services/ui/selection.service'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs'

@Component({
  selector: 'permission-rigth-side-bar',
  standalone: false,
  templateUrl: './permission-rigth-side-bar.component.html',
})
export class PermissionRigthSideBarComponent implements OnInit, OnDestroy {
  public permissions$: BehaviorSubject<Permission[]> = new BehaviorSubject<
    Permission[]
  >([])
  public searchTerm: string = ''
  public isLoading: boolean = false
  public selectedModuleId: number | null = null
  public selectedRoleId: number | null = null

  private searchSubject = new Subject<string>()
  private destroy$ = new Subject<void>()

  private _permissionsService = inject(PermissionService)
  private _selectionService = inject(SelectionService)

  ngOnInit(): void {
    this.initializeSubscriptions()
  }

  private initializeSubscriptions(): void {
    this.subscribeToRoleSelectionForPermissions()
    this.subscribeToModuleSelectionForPermissions()
    this.subscribeToPermissionSearch()
  }

  private subscribeToRoleSelectionForPermissions(): void {
    this._selectionService.selectedRoleId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((roleId) => {
        this.selectedRoleId = roleId
        this.permissions$.next([])
      })
  }

  private subscribeToModuleSelectionForPermissions(): void {
    this._selectionService.selectedModuleId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((moduleId) => {
        this.selectedModuleId = moduleId

        if (moduleId) {
          this.loadPermissionsByModule()
        } else {
          this.permissions$.next([])
        }
      })
  }

  private subscribeToPermissionSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((term) => {
        if (this.selectedRoleId && this.selectedModuleId) {
          this._permissionsService
            .getPermissionsByRoleAndModule(
              this.selectedRoleId,
              this.selectedModuleId,
              term,
            )
            .subscribe((response) => {
              this.permissions$.next(response.data.result)
            })
        }
      })
  }

  private loadPermissionsByModule(): void {
    if (!this.selectedRoleId || !this.selectedModuleId) return

    this.isLoading = true

    this._permissionsService
      .getPermissionsByRoleAndModule(
        this.selectedRoleId,
        this.selectedModuleId,
        this.searchTerm,
      )
      .pipe(
        tap((response) => {
          this.isLoading = false
          this.permissions$.next(response.data.result)
        }),
        catchError(() => {
          this.isLoading = false
          return of([])
        }),
      )
      .subscribe()
  }

  public onSearchInput(): void {
    this.searchSubject.next(this.searchTerm)
  }

  public searchPermissions(): void {
    if (!this.selectedRoleId || !this.selectedModuleId) return
    this.isLoading = true
    this._permissionsService
      .getPermissionsByRoleAndModule(
        this.selectedRoleId,
        this.selectedModuleId,
        this.searchTerm,
      )
      .subscribe((response) => {
        this.isLoading = false
        this.permissions$.next(response.data.result)
      })
  }

  public togglePermissionStatus(permissionName: string): void {
    if (!this.selectedRoleId) return

    this.isLoading = true

    this._permissionsService
      .togglePermissionStatus(this.selectedRoleId, permissionName)
      .pipe(
        tap(() => {
          this.permissions$.next(
            this.permissions$.value.map((permission) =>
              permission.name === permissionName
                ? {
                    ...permission,
                    isActiveForRole: !permission.isActiveForRole,
                  }
                : permission,
            ),
          )
        }),
        catchError(() => {
          return of([])
        }),
      )
      .subscribe(() => {
        this.isLoading = false
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
