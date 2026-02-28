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
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
} from 'rxjs'
import { Module } from '@core/interfaces/api/module.interface'
import { ModuleService } from '@core/services/api/module.service'
import { SelectionService } from '@core/services/ui/selection.service'

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
  public selectedRoleId: number | null = null
  public selectedModuleId: number | null = null

  private searchSubject = new Subject<string>()
  private destroy$ = new Subject<void>()

  private _moduleService = inject(ModuleService)
  private _selectionService = inject(SelectionService)

  ngOnInit(): void {
    this.initializeSubscriptions()
    this.getModulesByRole()
  }

  private initializeSubscriptions(): void {
    this.subscribeToRoleSelection()
    this.subscribeToModuleSearch()
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
        takeUntil(this.destroy$),
      )
      .subscribe((term) => {
        this._moduleService
          .findModules({ name: term })
          .subscribe((response) => this.modules$.next(response.data.result))
      })
  }

  private getModulesByRole(): void {
    if (!this.selectedRoleId) {
      this.modules$.next([])
      return
    }

    this.isLoading = true
    this._moduleService
      .getModulesByRole(this.selectedRoleId)
      .subscribe((response) => {
        this.isLoading = false
        this.modules$.next(response.data.result)
      })
  }

  public selectModule(moduleId: number): void {
    this.selectedModuleId = moduleId
    this._selectionService.setModuleId(moduleId)
  }

  public onSearchInput(): void {
    this.searchSubject.next(this.searchTerm)
  }

  public searchModules(): void {
    this._moduleService
      .findModules({ name: this.searchTerm })
      .subscribe((response) => {
        this.modules$.next(response.data.result)
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
