import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { environment } from '@environment/environment'
import { FinancialStatementsService } from '@core/services/api/financial-statements.service'
import { FiscalPeriodsService } from '@core/services/api/fiscal-periods.service'
import {
  TrialBalanceItem,
  BalanceSheetItem,
  IncomeStatementItem,
} from '@core/interfaces/api/financial-statements.interface'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs'

type ActiveTab = 'trial-balance' | 'balance-sheet' | 'income-statement'

@Component({
  selector: 'app-financial-statements',
  standalone: false,
  templateUrl: './financial-statements.component.html',
  styleUrl: './financial-statements.component.scss',
})
export class FinancialStatementsComponent implements OnInit, OnDestroy {
  private readonly financialStatementsService = inject(FinancialStatementsService)
  private readonly fiscalPeriodsService = inject(FiscalPeriodsService)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  readonly isComingSoon = environment.comingSoon.financialStatements

  periods: FiscalPeriod[] = []
  activeTab: ActiveTab = 'trial-balance'
  isLoading = false
  hasLoaded = false

  trialBalance: TrialBalanceItem[] = []
  balanceSheet: BalanceSheetItem[] = []
  incomeStatement: IncomeStatementItem[] = []

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

  loadStatements(): void {
    const periodId = this.filterForm.value.periodId
    if (!periodId) return

    this.isLoading = true
    this.hasLoaded = false
    this.clearData()

    forkJoin({
      trialBalance: this.financialStatementsService
        .getTrialBalance(periodId)
        .pipe(catchError(() => of(null))),
      balanceSheet: this.financialStatementsService
        .getBalanceSheet(periodId)
        .pipe(catchError(() => of(null))),
      incomeStatement: this.financialStatementsService
        .getIncomeStatement(periodId)
        .pipe(catchError(() => of(null))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ trialBalance, balanceSheet, incomeStatement }) => {
        this.isLoading = false
        this.hasLoaded = true
        if (trialBalance) this.trialBalance = trialBalance.data
        if (balanceSheet) this.balanceSheet = balanceSheet.data
        if (incomeStatement) this.incomeStatement = incomeStatement.data
      })
  }

  setActiveTab(tab: ActiveTab): void {
    this.activeTab = tab
  }

  isActiveTab(tab: ActiveTab): boolean {
    return this.activeTab === tab
  }

  private clearData(): void {
    this.trialBalance = []
    this.balanceSheet = []
    this.incomeStatement = []
  }

  getTrialBalanceTotalDebit(): number {
    return this.trialBalance.reduce((sum, i) => sum + i.debit, 0)
  }

  getTrialBalanceTotalCredit(): number {
    return this.trialBalance.reduce((sum, i) => sum + i.credit, 0)
  }

  getBalanceSheetTotal(): number {
    return this.balanceSheet.reduce((sum, i) => sum + i.amount, 0)
  }

  getIncomeStatementTotal(): number {
    return this.incomeStatement.reduce((sum, i) => sum + i.amount, 0)
  }

  getPeriodLabel(period: FiscalPeriod): string {
    return `${period.year}/${String(period.month).padStart(2, '0')}`
  }
}
