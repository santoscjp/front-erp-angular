import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { environment } from '@environment/environment'
import { JournalEntriesService } from '@core/services/api/journal-entries.service'
import { ChartOfAccountsService } from '@core/services/api/chart-of-accounts.service'
import { FiscalPeriodsService } from '@core/services/api/fiscal-periods.service'
import { JournalEntry, JournalEntryCreateRequest } from '@core/interfaces/api/journal-entry.interface'
import { ChartOfAccount } from '@core/interfaces/api/chart-of-account.interface'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { JournalEntryStatus } from '@/app/shared/enums/journal-entry-status.enum'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs'

const BALANCE_TOLERANCE = 0.01

@Component({
  selector: 'app-journal-entries',
  standalone: false,
  templateUrl: './journal-entries.component.html',
  styleUrl: './journal-entries.component.scss',
})
export class JournalEntriesComponent implements OnInit, OnDestroy {
  private readonly journalEntriesService = inject(JournalEntriesService)
  private readonly chartOfAccountsService = inject(ChartOfAccountsService)
  private readonly fiscalPeriodsService = inject(FiscalPeriodsService)
  private readonly notificationService = inject(ToastrNotificationService)
  private readonly modalService = inject(NgbModal)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  readonly JournalEntryStatus = JournalEntryStatus
  readonly isComingSoon = environment.comingSoon.journalEntries

  entries: JournalEntry[] = []
  leafAccounts: ChartOfAccount[] = []
  periods: FiscalPeriod[] = []
  isLoading = false
  isSubmitting = false
  selectedEntry: JournalEntry | null = null

  entryForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    details: this.fb.array([]),
  })

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray
  }

  get isBalanced(): boolean {
    const totalDebit = this.getTotalDebit()
    const totalCredit = this.getTotalCredit()
    return Math.abs(totalDebit - totalCredit) < BALANCE_TOLERANCE && totalDebit > 0
  }

  get imbalanceAmount(): number {
    return Math.abs(this.getTotalDebit() - this.getTotalCredit())
  }

  ngOnInit(): void {
    if (this.isComingSoon) return
    this.loadInitialData()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadInitialData(): void {
    this.isLoading = true
    forkJoin({
      entries: this.journalEntriesService.getAll({}).pipe(catchError(() => of(null))),
      accounts: this.chartOfAccountsService.getAll().pipe(catchError(() => of(null))),
      periods: this.fiscalPeriodsService.getAll().pipe(catchError(() => of(null))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ entries, accounts, periods }) => {
        this.isLoading = false
        if (entries) this.entries = entries.data.result
        if (accounts) this.leafAccounts = this.extractLeafAccounts(accounts.data)
        if (periods) this.periods = periods.data
      })
  }

  private extractLeafAccounts(accounts: ChartOfAccount[]): ChartOfAccount[] {
    const flatList = this.flattenTree(accounts)
    const parentIds = new Set(flatList.filter((a) => a.parentId !== null).map((a) => a.parentId))
    return flatList.filter((a) => !parentIds.has(a.id) && a.isActive)
  }

  private flattenTree(accounts: ChartOfAccount[]): ChartOfAccount[] {
    const result: ChartOfAccount[] = []
    for (const account of accounts) {
      result.push(account)
      if (account.children?.length) result.push(...this.flattenTree(account.children))
    }
    return result
  }

  private buildDetailRow(): FormGroup {
    return this.fb.group({
      accountId: [null, Validators.required],
      description: ['', Validators.required],
      debit: [0, [Validators.required, Validators.min(0)]],
      credit: [0, [Validators.required, Validators.min(0)]],
    })
  }

  openCreateModal(modal: TemplateRef<unknown>): void {
    this.selectedEntry = null
    this.entryForm.reset()
    this.details.clear()
    this.details.push(this.buildDetailRow())
    this.details.push(this.buildDetailRow())
    this.modalService.open(modal, { centered: true, size: 'xl' })
  }

  openViewModal(modal: TemplateRef<unknown>, entry: JournalEntry): void {
    this.selectedEntry = entry
    this.modalService.open(modal, { centered: true, size: 'lg' })
  }

  addDetailRow(): void {
    this.details.push(this.buildDetailRow())
  }

  removeDetailRow(index: number): void {
    if (this.details.length > 2) this.details.removeAt(index)
  }

  getTotalDebit(): number {
    return this.details.controls.reduce(
      (sum, ctrl) => sum + (Number(ctrl.get('debit')?.value) || 0),
      0,
    )
  }

  getTotalCredit(): number {
    return this.details.controls.reduce(
      (sum, ctrl) => sum + (Number(ctrl.get('credit')?.value) || 0),
      0,
    )
  }

  getStatusClass(status: JournalEntryStatus): string {
    const classes: Record<JournalEntryStatus, string> = {
      [JournalEntryStatus.DRAFT]: 'bg-warning-subtle text-warning',
      [JournalEntryStatus.APPROVED]: 'bg-success-subtle text-success',
      [JournalEntryStatus.VOIDED]: 'bg-danger-subtle text-danger',
    }
    return classes[status] ?? 'bg-secondary-subtle text-secondary'
  }

  getAccountLabel(account: ChartOfAccount): string {
    return `${account.code} - ${account.name}`
  }

  getPeriodLabel(period: FiscalPeriod): string {
    return `${period.year}/${String(period.month).padStart(2, '0')}`
  }

  onSubmit(modal: { dismiss: () => void }): void {
    if (this.entryForm.invalid || !this.isBalanced) {
      this.entryForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    const payload = this.entryForm.value as JournalEntryCreateRequest
    this.journalEntriesService
      .create(payload)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isSubmitting = false
        if (res) {
          this.notificationService.showNotification({
            title: 'JOURNAL_ENTRIES.TITLE',
            message: 'JOURNAL_ENTRIES.CREATE_SUCCESS',
            type: 'success',
          })
          modal.dismiss()
          this.loadInitialData()
        }
      })
  }

  approveEntry(entry: JournalEntry): void {
    this.journalEntriesService
      .approve(entry.id)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          entry.status = JournalEntryStatus.APPROVED
          this.notificationService.showNotification({
            title: 'JOURNAL_ENTRIES.TITLE',
            message: 'JOURNAL_ENTRIES.APPROVE_SUCCESS',
            type: 'success',
          })
        }
      })
  }

  voidEntry(entry: JournalEntry): void {
    this.journalEntriesService
      .void(entry.id)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          entry.status = JournalEntryStatus.VOIDED
          this.notificationService.showNotification({
            title: 'JOURNAL_ENTRIES.TITLE',
            message: 'JOURNAL_ENTRIES.VOID_SUCCESS',
            type: 'success',
          })
        }
      })
  }
}
