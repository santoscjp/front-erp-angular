import {
  Component,
  OnInit,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ColumnMode } from '@swimlane/ngx-datatable'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'

import { MODULE_LABELS } from '@/app/shared/constants/modules.constants'
import { EmisorListItem } from '@core/interfaces/api/company.interface'
import { TableConfig } from '../../interfaces/table-config.interface'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-emisor-list',
  standalone: false,
  templateUrl: './emisor-list.component.html',
  styleUrls: ['./emisor-list.component.scss'],
})
export class EmisorListComponent implements OnInit {
  @ViewChild('modulesTpl', { static: true })
  modulesTpl!: TemplateRef<unknown>
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<unknown>
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<unknown>

  private adminService = inject(AdminEmisorService)
  private router = inject(Router)
  private translate = inject(TranslateService)

  emisores: EmisorListItem[] = []
  columns: unknown[] = []
  columnMode = ColumnMode.force
  moduleLabels = MODULE_LABELS

  filterRuc = ''
  filterBusinessName = ''
  filterStatus = ''

  config$ = new BehaviorSubject<TableConfig>({
    limit: 10,
    page: 1,
    totalCount: 0,
    loading: false,
  })

  ngOnInit(): void {
    this.initColumns()
    this.loadEmisores()
  }

  private initColumns(): void {
    this.columns = [
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.RUC'),
        prop: 'ruc',
        width: 150,
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.RAZON_SOCIAL'),
        prop: 'businessName',
        width: 250,
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.MODULES'),
        cellTemplate: this.modulesTpl,
        width: 250,
        sortable: false,
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.USERS'),
        prop: 'userCount',
        width: 100,
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.STATUS'),
        cellTemplate: this.statusTpl,
        width: 100,
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.ACTIONS'),
        cellTemplate: this.actionsTpl,
        width: 120,
        sortable: false,
      },
    ]
  }

  loadEmisores(): void {
    const config = this.config$.value
    this.config$.next({ ...config, loading: true })

    const filter: Record<string, string> = {
      page: String(config.page),
      limit: String(config.limit),
    }
    if (this.filterRuc) filter['ruc'] = this.filterRuc
    if (this.filterBusinessName)
      filter['businessName'] = this.filterBusinessName
    if (this.filterStatus) filter['isActive'] = this.filterStatus

    this.adminService.getEmisores(filter).subscribe({
      next: (response) => {
        this.emisores = response.data.result
        this.config$.next({
          ...config,
          totalCount: response.data.totalCount,
          loading: false,
        })
      },
      error: () => {
        this.config$.next({ ...config, loading: false })
      },
    })
  }

  onPageChange(event: { offset: number }): void {
    const config = this.config$.value
    this.config$.next({ ...config, page: event.offset + 1 })
    this.loadEmisores()
  }

  applyFilter(): void {
    const config = this.config$.value
    this.config$.next({ ...config, page: 1 })
    this.loadEmisores()
  }

  resetFilter(): void {
    this.filterRuc = ''
    this.filterBusinessName = ''
    this.filterStatus = ''
    this.applyFilter()
  }

  viewDetail(emisor: EmisorListItem): void {
    this.router.navigate(['/admin/issuers', emisor.id])
  }

  trackByEmisorId(_index: number, emisor: EmisorListItem): number {
    return emisor.id
  }
}
