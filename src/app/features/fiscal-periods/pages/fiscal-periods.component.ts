import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { environment } from '@environment/environment'
import { FiscalPeriodsService } from '@core/services/api/fiscal-periods.service'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { FiscalPeriodStatus } from '@/app/shared/enums/fiscal-period-status.enum'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { catchError, of, Subject, takeUntil } from 'rxjs'

const MONTH_NAMES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre',
}

@Component({
  selector: 'app-fiscal-periods',
  standalone: false,
  templateUrl: './fiscal-periods.component.html',
  styleUrl: './fiscal-periods.component.scss',
})
export class FiscalPeriodsComponent implements OnInit, OnDestroy {
  private readonly fiscalPeriodsService = inject(FiscalPeriodsService)
  private readonly notificationService = inject(ToastrNotificationService)
  private readonly modalService = inject(NgbModal)
  private readonly destroy$ = new Subject<void>()

  periods: FiscalPeriod[] = []
  isLoading = false
  periodToClose: FiscalPeriod | null = null
  readonly FiscalPeriodStatus = FiscalPeriodStatus
  readonly isComingSoon = environment.comingSoon.fiscalPeriods

  ngOnInit(): void {
    if (this.isComingSoon) return
    this.loadPeriods()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadPeriods(): void {
    this.isLoading = true
    this.fiscalPeriodsService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isLoading = false
        if (res) this.periods = res.data
      })
  }

  getMonthName(month: number): string {
    return MONTH_NAMES[month] ?? String(month)
  }

  isOpen(period: FiscalPeriod): boolean {
    return period.status === FiscalPeriodStatus.OPEN
  }

  openCloseConfirm(period: FiscalPeriod, modal: unknown): void {
    this.periodToClose = period
    this.modalService.open(modal, { centered: true, size: 'sm' }).result.then(
      () => this.confirmClose(),
      () => { this.periodToClose = null },
    )
  }

  private confirmClose(): void {
    if (!this.periodToClose) return

    const period = this.periodToClose
    this.periodToClose = null

    this.fiscalPeriodsService
      .close(period.id)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            title: 'FISCAL_PERIODS.TITLE',
            message: 'FISCAL_PERIODS.CLOSE_SUCCESS',
            type: 'success',
          })
          this.loadPeriods()
        }
      })
  }
}
