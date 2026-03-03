import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { environment } from '@environment/environment'
import { GeneralLedgerService } from '@core/services/api/general-ledger.service'
import { ChartOfAccountsService } from '@core/services/api/chart-of-accounts.service'
import { FiscalPeriodsService } from '@core/services/api/fiscal-periods.service'
import { GeneralLedgerEntry } from '@core/interfaces/api/general-ledger.interface'
import { ChartOfAccount } from '@core/interfaces/api/chart-of-account.interface'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { catchError, of, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-general-ledger',
  standalone: false,
  templateUrl: './general-ledger.component.html',
  styleUrl: './general-ledger.component.scss',
})
export class GeneralLedgerComponent implements OnInit, OnDestroy {
  private readonly generalLedgerService = inject(GeneralLedgerService)
  private readonly chartOfAccountsService = inject(ChartOfAccountsService)
  private readonly fiscalPeriodsService = inject(FiscalPeriodsService)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  readonly isComingSoon = environment.comingSoon.generalLedger

  entries: GeneralLedgerEntry[] = []
  accounts: ChartOfAccount[] = []
  periods: FiscalPeriod[] = []
  isLoading = false
  hasSearched = false

  filterForm: FormGroup = this.fb.group({
    accountId: [null],
    periodId: [null],
  })

  ngOnInit(): void {
    if (this.isComingSoon) return
    this.loadAccounts()
    this.loadPeriods()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadAccounts(): void {
    this.chartOfAccountsService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) this.accounts = this.flattenAccounts(res.data)
      })
  }

  private loadPeriods(): void {
    this.fiscalPeriodsService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) this.periods = res.data
      })
  }

  private flattenAccounts(accounts: ChartOfAccount[]): ChartOfAccount[] {
    const result: ChartOfAccount[] = []
    for (const account of accounts) {
      result.push(account)
      if (account.children?.length) {
        result.push(...this.flattenAccounts(account.children))
      }
    }
    return result
  }

  search(): void {
    this.isLoading = true
    this.hasSearched = true

    const { accountId, periodId } = this.filterForm.value
    this.generalLedgerService
      .getEntries({ accountId: accountId ?? undefined, periodId: periodId ?? undefined })
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isLoading = false
        if (res) this.entries = res.data
      })
  }

  getTotalDebit(): number {
    return this.entries.reduce((sum, e) => sum + e.debit, 0)
  }

  getTotalCredit(): number {
    return this.entries.reduce((sum, e) => sum + e.credit, 0)
  }

  getAccountLabel(account: ChartOfAccount): string {
    return `${account.code} - ${account.name}`
  }

  getPeriodLabel(period: FiscalPeriod): string {
    return `${period.year}/${String(period.month).padStart(2, '0')}`
  }
}
