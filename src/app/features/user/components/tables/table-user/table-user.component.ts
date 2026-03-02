import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { BUTTON_ACTIONS } from '@core/helpers/ui/constants'
import { DEFAULT_NGX_DATATABLE_PAGINATION } from '@core/helpers/ui/ngx-datatable.constant'
import { FORMAT_FOR_DATES } from '@core/helpers/ui/ui.constants'
import { User } from '@core/interfaces/api/user.interface'
import {
  BootstrapModalConfig,
  ModalWithAction,
} from '@core/interfaces/ui/bootstrap-modal.interface'
import { NgxDatatableConfig } from '@core/interfaces/ui/ngx-datatable.interface'
import { ButtonAction } from '@core/interfaces/ui/ui.interface'
import { AuthenticationService } from '@core/services/api/auth.service'
import { UserService } from '@core/services/api/user.service'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'

import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs'
import { UserFilterFormComponent } from '../../filter/user-filter-form/user-filter-form.component'
import { FilterCommunicationService } from '@core/services/ui/filter-comumunication.service'
import { CreateUserComponent } from '../../forms/create-user/create-user.component'
import { CreateDetailsUserComponent } from '../../forms/create-details-user/create-details-user.component'
import { CreateEditUserComponent } from '../../forms/create-edit-user/create-edit-user.component'

@Component({
  selector: 'app-table-user',
  standalone: false,
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss'],
})
export class TableUserComponent implements OnInit, OnDestroy {
  public BUTTON_ACTIONS = BUTTON_ACTIONS
  public FORMAT_FOR_DATES = FORMAT_FOR_DATES
  private PAGINATION = DEFAULT_NGX_DATATABLE_PAGINATION

  public filterComponent = UserFilterFormComponent

  @ViewChild('createdAt', { static: true })
  public createdAtTemplate?: TemplateRef<HTMLElement>
  @ViewChild('statusTemplate', { static: true })
  public statusTemplate?: TemplateRef<HTMLElement>
  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplate?: TemplateRef<HTMLElement>
  public config$ = new BehaviorSubject<Partial<NgxDatatableConfig>>({})
  public data$: Observable<User[]> = of([])

  private unsubscribe$: Subject<boolean> = new Subject<boolean>()

  private _filterCommunicationService = inject(FilterCommunicationService)
  private _userService = inject(UserService)
  private _authService = inject(AuthenticationService)
  private _bsModalService = inject(BootstrapModalService)

  ngOnInit(): void {
    this.suscribeToFilter()
    this.config$ = this.setConfigDatatable()
    this.reloadDatatable()
  }

  private suscribeToFilter(): void {
    this._filterCommunicationService.currentFilter
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (filter) => {
          this.reloadDatatable(filter || {})
        },
        error: () => {},
      })
  }

  private setConfigDatatable(): BehaviorSubject<Partial<NgxDatatableConfig>> {
    return new BehaviorSubject<Partial<NgxDatatableConfig>>({
      limit: this.PAGINATION.LIMIT,
      page: this.PAGINATION.PAGE,
      columns: [
        {
          name: 'USER.TABLE.USERNAME',
          prop: 'username',
          cellClass: 'col-username',
        },
        {
          name: 'USER.TABLE.FIRST_NAME',
          prop: 'firstName',
          cellClass: 'col-first-name',
        },
        {
          name: 'USER.TABLE.LAST_NAME',
          prop: 'lastName',
          cellClass: 'col-last-name',
        },
        {
          name: 'USER.TABLE.EMAIL',
          width: 300,
          prop: 'email',
          cellClass: 'col-email',
        },
        {
          name: 'USER.TABLE.IS_ACTIVE',
          cellTemplate: this.statusTemplate ?? undefined,
          cellClass: 'col-is-active',
        },
        {
          name: 'USER.TABLE.CREATED_AT',
          cellTemplate: this.createdAtTemplate ?? undefined,
          cellClass: 'col-created-at',
        },
        {
          name: 'USER.TABLE.ACTIONS',
          cellTemplate: this.actionsTemplate ?? undefined,
          cellClass: 'col-actions',
        },
      ],
    })
  }

  private fetchUsers(filter: object): Observable<User[]> {
    this.config$.next({ ...this.config$.value, loadingIndicator: true })

    const updatedFilter = {
      ...filter,
      limit: this.config$.value.limit,
      page: this.config$.value.page,
    }

    return this._userService.findUsers(updatedFilter).pipe(
      tap((res) => {
        this.config$.next({
          ...this.config$.value,
          loadingIndicator: false,
          count: res.data.totalCount,
        })
      }),
      map((res) => res.data.result || []),
      catchError(() => {
        this.config$.next({ ...this.config$.value, loadingIndicator: false })
        return of([])
      }),
    )
  }

  public reloadDatatable(filter: object = {}): void {
    const currentFilter =
      this._filterCommunicationService.getCurrentFilter() || {}
    this.config$.next({
      ...this.config$.value,
      limit: this.PAGINATION.LIMIT,
      page: this.PAGINATION.PAGE,
    })
    this.data$ = this.fetchUsers(currentFilter)
  }

  public onChangeLimit(limit: number): void {
    this.config$.next({
      ...this.config$.value,
      limit,
      page: this.PAGINATION.PAGE,
    })
    this.data$ = this.fetchUsers({})
  }

  public onChangePage(page: number): void {
    this.config$.next({ ...this.config$.value, page })
    this.data$ = this.fetchUsers({})
  }

  public isUserLocked(user: User): boolean {
    return user.lockedUntil !== null
  }

  public unlockUser(user: User): void {
    this._authService
      .unlockUser(user.id)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res) {
          this.reloadDatatable()
        }
      })
  }

  public openModal(buttonAction: ButtonAction, user?: User): void {
    if (buttonAction === BUTTON_ACTIONS.ADD) {
      const modalConfig: BootstrapModalConfig<ModalWithAction<User>> = {
        component: CreateUserComponent,
        options: { size: 'xl' },
        data: {
          buttonAction: BUTTON_ACTIONS.ADD,
        },
      }
      this._bsModalService.openModal(modalConfig)
    }
    if (buttonAction === BUTTON_ACTIONS.VIEW && user) {
      const modalConfig: BootstrapModalConfig<ModalWithAction<User>> = {
        component: CreateDetailsUserComponent,
        options: { size: 'lg' },
        data: {
          buttonAction: BUTTON_ACTIONS.VIEW,
          selectedRow: user,
        },
      }
      this._bsModalService.openModal(modalConfig)
    }
    if (buttonAction === BUTTON_ACTIONS.EDIT && user) {
      const modalConfig: BootstrapModalConfig<ModalWithAction<User>> = {
        component: CreateEditUserComponent,
        options: { size: 'lg' },
        data: {
          buttonAction: BUTTON_ACTIONS.EDIT,
          selectedRow: user,
        },
      }
      this._bsModalService.openModal(modalConfig)
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true)
    this.unsubscribe$.unsubscribe()
  }

  reloadUserList(): void {
    this.reloadDatatable()
  }
}
