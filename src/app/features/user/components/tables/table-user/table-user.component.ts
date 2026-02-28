import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
import { UserService } from '@core/services/api/user.service'
import { BootstrapModalService } from '@core/services/ui/bootstrap-modal.service'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
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
import { TooglePanelComponent } from '../../../../../shared/components/accordions/toogle-panel/toogle-panel.component'
import { PageTitleComponent } from '../../../../../shared/components/layouts/page-title/page-title.component'
import { NgxDatatableComponent } from '../../../../../shared/components/tables/ngx-datatabale/ngx-datatable.component'
import { UserFilterFormComponent } from '../../filter/user-filter-form/user-filter-form.component'
import { FilterCommunicationService } from '@core/services/ui/filter-comumunication.service'
import { CreateUserComponent } from '../../forms/create-user/create-user.component'
import { CreateDetailsUserComponent } from '../../forms/create-details-user/create-details-user.component'
import { CreateEditUserComponent } from '../../forms/create-edit-user/create-edit-user.component'

@Component({
  selector: 'app-table-user',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageTitleComponent,
    TooglePanelComponent,
    NgbModule,
    NgxDatatableComponent,
  ],
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TableUserComponent implements OnInit, OnDestroy {
  public BUTTON_ACTIONS = BUTTON_ACTIONS
  public FORMAT_FOR_DATES = FORMAT_FOR_DATES
  private PAGINATION = DEFAULT_NGX_DATATABLE_PAGINATION

  public filterComponent = UserFilterFormComponent

  @ViewChild('createdAt', { static: true })
  public createdAtTemplate?: TemplateRef<HTMLElement>
  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplate?: TemplateRef<HTMLElement>
  public config$ = new BehaviorSubject<Partial<NgxDatatableConfig>>({})
  public data$: Observable<User[]> = of([])

  private filter: object = {}
  private unsubscribe$: Subject<boolean> = new Subject<boolean>()

  private _filterCommunicationService = inject(FilterCommunicationService)
  private _userService = inject(UserService)

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
        error: (err) => {},
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
        },
        {
          name: 'USER.TABLE.FIRST_NAME',
          prop: 'firstName',
        },
        {
          name: 'USER.TABLE.LAST_NAME',
          prop: 'lastName',
        },
        {
          name: 'USER.TABLE.EMAIL',
          width: 300,
          prop: 'email',
        },
        {
          name: 'USER.TABLE.IS_ACTIVE',
          prop: 'isActive',
        },
        {
          name: 'USER.TABLE.CREATED_AT',
          cellTemplate: this.createdAtTemplate ?? undefined,
        },
        {
          name: 'USER.TABLE.ACTIONS',
          cellTemplate: this.actionsTemplate ?? undefined,
        },
      ],
    })
  }

  private fetchUsers(filter: object): Observable<User[]> {
    this.config$.next({ ...this.config$.value, loadingIndicator: true })

    const UpdateFilter = {
      ...filter,
      limit: this.config$.value.limit,
      page: this.config$.value.page,
    }

    return this._userService.findUsers(UpdateFilter).pipe(
      tap((res) => {
        this.config$.next({
          ...this.config$.value,
          loadingIndicator: false,
          count: res.data.totalCount,
        })
      }),
      map((res) => res.data.result || []),
      catchError((err) => {
        this.config$.next({ ...this.config$.value, loadingIndicator: false })
        return of([])
      })
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
