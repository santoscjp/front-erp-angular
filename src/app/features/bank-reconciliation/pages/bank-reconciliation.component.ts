import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { environment } from '@environment/environment'
import { BankReconciliationService } from '@core/services/api/bank-reconciliation.service'
import { FiscalPeriodsService } from '@core/services/api/fiscal-periods.service'
import { BankReconciliation } from '@core/interfaces/api/bank-reconciliation.interface'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { catchError, of, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-bank-reconciliation',
  standalone: false,
  templateUrl: './bank-reconciliation.component.html',
  styleUrl: './bank-reconciliation.component.scss',
})
export class BankReconciliationComponent implements OnInit, OnDestroy {
  private readonly reconciliationService = inject(BankReconciliationService)
  private readonly fiscalPeriodsService = inject(FiscalPeriodsService)
  private readonly notificationService = inject(ToastrNotificationService)
  private readonly modalService = inject(NgbModal)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  readonly isComingSoon = environment.comingSoon.bankReconciliation

  reconciliations: BankReconciliation[] = []
  periods: FiscalPeriod[] = []
  isLoading = false
  isSubmitting = false

  createForm: FormGroup = this.fb.group({
    periodId: [null, Validators.required],
    bankAccountId: [null, Validators.required],
    bookBalance: [0, [Validators.required, Validators.min(0)]],
    bankBalance: [0, [Validators.required, Validators.min(0)]],
    date: ['', Validators.required],
  })

  ngOnInit(): void {
    if (this.isComingSoon) return
    this.loadData()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadData(): void {
    this.isLoading = true
    this.reconciliationService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isLoading = false
        if (res) this.reconciliations = res.data
      })

    this.fiscalPeriodsService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) this.periods = res.data
      })
  }

  openCreateModal(modal: unknown): void {
    this.createForm.reset({ bookBalance: 0, bankBalance: 0 })
    this.modalService.open(modal, { centered: true, size: 'lg' })
  }

  onSubmit(modal: { dismiss: () => void }): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    this.reconciliationService
      .create(this.createForm.value)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isSubmitting = false
        if (res) {
          this.notificationService.showNotification({
            title: 'BANK_RECONCILIATION.TITLE',
            message: 'BANK_RECONCILIATION.CREATE_SUCCESS',
            type: 'success',
          })
          modal.dismiss()
          this.loadData()
        }
      })
  }

  getDifference(reconciliation: BankReconciliation): number {
    return Math.abs(reconciliation.bookBalance - reconciliation.bankBalance)
  }

  isBalanced(reconciliation: BankReconciliation): boolean {
    return this.getDifference(reconciliation) < 0.01
  }

  getPeriodLabel(period: FiscalPeriod): string {
    return `${period.year}/${String(period.month).padStart(2, '0')}`
  }
}
