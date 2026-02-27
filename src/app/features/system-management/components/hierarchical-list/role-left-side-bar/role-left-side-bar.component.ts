import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Role } from '@core/interfaces/api/role.interface'
import { RoleService } from '@core/services/api/role.service'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
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
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'
import { RoleFormComponent } from '../../forms/role-form/role-form.component'
import { MODAL_TYPE } from '@core/helpers/global/global.constants'

@Component({
  selector: 'role-left-side-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbModule, FormsModule],
  templateUrl: './role-left-side-bar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``,
})
export class RoleLeftSideBarComponent implements OnInit, OnDestroy {
  public roles$: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([])
  public searchTerm: string = ''
  public isLoading: boolean = false
  public selectedRoleId: string | null = null

  private searchSubject = new Subject<string>()
  private destroy$ = new Subject<void>()

  private _roleService = inject(RoleService)
  private _selectionService = inject(SelectionService)
  private _bootstrapModalService = inject(BootstrapModalService)

  ngOnInit(): void {
    this.initializeSubscriptions()
    this.loadRoles()
  }

  private initializeSubscriptions(): void {
    this.subscribeToModalCloseForRoles()
    this.subscribeToRoleSelection()
    this.subscribeToRoleSearch()
  }

  private subscribeToModalCloseForRoles(): void {
    this._bootstrapModalService.getModalClosed().subscribe(() => {
      this._bootstrapModalService.getDataIssued().subscribe((data) => {
        if (data?.modalType === MODAL_TYPE.ROLE_FORM) {
          this.loadRoles()
        }
      })
    })
  }

  private subscribeToRoleSelection(): void {
    this._selectionService.selectedRoleId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((roleId) => {
        this.selectedRoleId = roleId
      })
  }

  private subscribeToRoleSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => this._roleService.getAllRoles(term)),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.roles$.next(response.data.result)
      })
  }

  private loadRoles(): void {
    this.isLoading = true
    this._roleService
      .getAllRoles()
      .pipe(
        tap((response) => {
          this.isLoading = false
          this.roles$.next(response.data.result)
        }),
        catchError((err) => {
          this.isLoading = false
          return of([])
        })
      )
      .subscribe()
      .add(() => (this.isLoading = false))
  }

  public selectRole(roleId: string): void {
    this._selectionService.setRoleId(roleId)
  }

  public onSearchInput(): void {
    this.searchSubject.next(this.searchTerm)
  }

  public searchRoles(): void {
    this.isLoading = true
    this._roleService.getAllRoles(this.searchTerm).subscribe((response) => {
      this.isLoading = false
      this.roles$.next(response.data.result)
    })
  }

  public toggleRoleStatus(id: string): void {
    this.isLoading = true
    this._roleService.toggleRoleStatus(id).subscribe(() => {
      this.loadRoles()

      if (this.selectedRoleId === id) {
        this._selectionService.setRoleId(null)
        this._selectionService.setModuleId(null)
        this._selectionService.setHasModules(false)
      }
    })
  }

  openModal(): void {
    this._bootstrapModalService.openModal({
      component: RoleFormComponent,
      data: { modalType: MODAL_TYPE.ROLE_FORM },
    })
  }

  public openEditModal(roleId: string, event: Event): void {
    event.stopPropagation()
    this._bootstrapModalService.openModal({
      component: RoleFormComponent,
      data: { roleId, modalType: MODAL_TYPE.ROLE_FORM },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
