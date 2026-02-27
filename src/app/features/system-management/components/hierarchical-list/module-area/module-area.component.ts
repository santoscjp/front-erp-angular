import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
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
import { Module } from '@core/interfaces/api/module.interface'
import { ModuleService } from '@core/services/api/module.service'
import { SelectionService } from '@core/services/ui/selection.service'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { ModuleFormComponent } from '../../forms/module-form/module-form.component'
import { MODAL_TYPE } from '@core/helpers/global/global.constants'
import { PermissionFormComponent } from '../../forms/permission-form/permission-form.component'

@Component({
  selector: 'module-area',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbModule, FormsModule],
  templateUrl: './module-area.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModuleAreaComponent implements OnInit, OnDestroy {
  public modules$: BehaviorSubject<Module[]> = new BehaviorSubject<Module[]>([])
  public searchTerm: string = ''
  public isLoading: boolean = false
  public selectedRoleId: string | null = null
  public selectedModuleId: string | null = null

  private searchSubject = new Subject<string>()
  private destroy$ = new Subject<void>()

  private _moduleService = inject(ModuleService)
  private _selectionService = inject(SelectionService)
  private _bootstrapModalService = inject(BootstrapModalService)

  ngOnInit(): void {
    this.initializeSubscriptions()
    this.getModulesByRole()
  }

  private initializeSubscriptions(): void {
    this.subscribeToModalClose()
    this.subscribeToRoleSelection()
    this.subscribeToModuleSearch()
  }

  private subscribeToModalClose(): void {
    this._bootstrapModalService.getModalClosed().subscribe(() => {
      this._bootstrapModalService.getDataIssued().subscribe((data) => {
        if (data?.modalType === MODAL_TYPE.MODULE_FORM) {
          this.getModulesByRole()
        }
      })
    })
  }

  private subscribeToRoleSelection(): void {
    this._selectionService.selectedRoleId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((roleId) => {
        this.selectedRoleId = roleId
        this.selectedModuleId = null
        this._selectionService.setModuleId(null)
        this.getModulesByRole()
      })
  }

  private subscribeToModuleSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => this._moduleService.findModules({ name: term })),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => this.modules$.next(response.data.result))
  }

  private getModulesByRole(): void {
    if (!this.selectedRoleId) {
      this.modules$.next([])
      return
    }

    this.isLoading = true
    this._moduleService
      .getModulesByRole(this.selectedRoleId)
      .pipe(
        tap((response) => {
          this.isLoading = false
          this.modules$.next(response.data.result)
        }),
        catchError((err) => {
          this.isLoading = false
          this.modules$.next([])
          console.error('⚠️ Error al obtener módulos:', err)
          return of([])
        })
      )
      .subscribe()
  }

  public selectModule(moduleId: string): void {
    this.selectedModuleId = moduleId
    this._selectionService.setModuleId(moduleId)
  }

  public onSearchInput(): void {
    this.searchSubject.next(this.searchTerm)
  }

  public searchModules(): void {
    this.isLoading = true
    this._moduleService
      .findModules({ name: this.searchTerm })
      .subscribe((response) => {
        this.isLoading = false
        this.modules$.next(response.data.result)
      })
  }

  public toggleModuleForRole(moduleId: string): void {
    if (!this.selectedRoleId) return

    this._moduleService
      .toggleModuleStatus(this.selectedRoleId, moduleId)
      .subscribe(() => {
        this.getModulesByRole()
        if (this.selectedModuleId === moduleId) {
          this._selectionService.setModuleId(moduleId)
        }
      })
  }

  openModal(): void {
    this._bootstrapModalService.openModal({
      component: ModuleFormComponent,
      data: { roleId: this.selectedRoleId, modalType: MODAL_TYPE.MODULE_FORM },
    })
  }

  openModalPermission(moduleId: string, event: Event): void {
    event.stopPropagation()
    this._bootstrapModalService.openModal({
      component: PermissionFormComponent,
      data: { moduleId, modalType: MODAL_TYPE.PERMISSION_FORM },
    })
  }

  public openEditModal(moduleId: string, event: Event): void {
    event.stopPropagation()
    this._bootstrapModalService.openModal({
      component: ModuleFormComponent,
      data: { moduleId, modalType: MODAL_TYPE.MODULE_FORM },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
