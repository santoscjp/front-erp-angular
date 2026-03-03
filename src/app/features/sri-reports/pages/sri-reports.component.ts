import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { environment } from '@environment/environment'
import { SriReportsService } from '@core/services/api/sri-reports.service'
import { FiscalPeriodsService } from '@core/services/api/fiscal-periods.service'
import { SriReport } from '@core/interfaces/api/sri-reports.interface'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { catchError, of, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-sri-reports',
  standalone: false,
  templateUrl: './sri-reports.component.html',
  styleUrl: './sri-reports.component.scss',
})
export class SriReportsComponent implements OnInit, OnDestroy {
  private readonly sriReportsService = inject(SriReportsService)
  private readonly fiscalPeriodsService = inject(FiscalPeriodsService)
  private readonly notificationService = inject(ToastrNotificationService)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  readonly isComingSoon = environment.comingSoon.sriReports

  periods: FiscalPeriod[] = []
  currentReport: SriReport | null = null
  isLoading = false
  isGenerating = false

  filterForm: FormGroup = this.fb.group({ periodId: [null] })

  ngOnInit(): void {
    if (this.isComingSoon) return
    this.loadPeriods()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadPeriods(): void {
    this.fiscalPeriodsService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) this.periods = res.data
      })
  }

  loadReport(): void {
    const periodId = this.filterForm.value.periodId
    if (!periodId) return

    this.isLoading = true
    this.sriReportsService
      .getAtsReport(periodId)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isLoading = false
        this.currentReport = res?.data ?? null
      })
  }

  generateAts(): void {
    const periodId = this.filterForm.value.periodId
    if (!periodId) return

    this.isGenerating = true
    this.sriReportsService
      .generateAts(periodId)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isGenerating = false
        if (res) {
          this.currentReport = res.data
          this.notificationService.showNotification({
            title: 'SRI_REPORTS.TITLE',
            message: 'SRI_REPORTS.GENERATE_SUCCESS',
            type: 'success',
          })
        }
      })
  }

  downloadXml(): void {
    if (!this.currentReport?.xmlData) return

    const blob = new Blob([this.currentReport.xmlData], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ATS_${this.currentReport.periodId}.xml`
    link.click()
    URL.revokeObjectURL(url)
  }

  getPeriodLabel(period: FiscalPeriod): string {
    return `${period.year}/${String(period.month).padStart(2, '0')}`
  }

  isReportReady(): boolean {
    return this.currentReport?.status === 'GENERATED'
  }
}
