import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { environment } from '@environment/environment'
import { ChartOfAccountsService } from '@core/services/api/chart-of-accounts.service'
import {
  ChartOfAccount,
  ChartOfAccountCreateRequest,
} from '@core/interfaces/api/chart-of-account.interface'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { catchError, of, Subject, takeUntil } from 'rxjs'

const ACCOUNT_TYPES = [
  { value: 'ACTIVO', label: '1. Activo' },
  { value: 'PASIVO', label: '2. Pasivo' },
  { value: 'PATRIMONIO', label: '3. Patrimonio' },
  { value: 'INGRESOS', label: '4. Ingresos' },
  { value: 'GASTOS', label: '5. Gastos' },
]

@Component({
  selector: 'app-chart-of-accounts',
  standalone: false,
  templateUrl: './chart-of-accounts.component.html',
  styleUrl: './chart-of-accounts.component.scss',
})
export class ChartOfAccountsComponent implements OnInit, OnDestroy {
  private readonly chartOfAccountsService = inject(ChartOfAccountsService)
  private readonly notificationService = inject(ToastrNotificationService)
  private readonly modalService = inject(NgbModal)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  allAccounts: ChartOfAccount[] = []
  filteredAccounts: ChartOfAccount[] = []
  isLoading = false
  isSubmitting = false
  editingAccount: ChartOfAccount | null = null
  searchTerm = ''

  readonly isComingSoon = environment.comingSoon.chartOfAccounts
  readonly accountTypes = ACCOUNT_TYPES

  accountForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    type: ['', Validators.required],
    parentId: [null],
  })

  ngOnInit(): void {
    if (this.isComingSoon) return
    this.loadAccounts()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadAccounts(): void {
    this.isLoading = true
    this.chartOfAccountsService
      .getAll()
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isLoading = false
        if (res) {
          this.allAccounts = this.flattenTree(res.data)
          this.applyFilter()
        }
      })
  }

  private flattenTree(accounts: ChartOfAccount[]): ChartOfAccount[] {
    const result: ChartOfAccount[] = []
    for (const account of accounts) {
      result.push(account)
      if (account.children?.length) {
        result.push(...this.flattenTree(account.children))
      }
    }
    return result
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim()
    if (!term) {
      this.filteredAccounts = this.allAccounts
      return
    }
    this.filteredAccounts = this.allAccounts.filter(
      (a) => a.code.toLowerCase().includes(term) || a.name.toLowerCase().includes(term),
    )
  }

  getIndentPadding(level: number): string {
    return `${(level - 1) * 20}px`
  }

  isLeafAccount(account: ChartOfAccount): boolean {
    return !this.allAccounts.some((a) => a.parentId === account.id)
  }

  getParentAccounts(): ChartOfAccount[] {
    return this.allAccounts.filter((a) => !this.isLeafAccount(a) || a.parentId === null)
  }

  openCreateModal(modal: TemplateRef<unknown>): void {
    this.editingAccount = null
    this.accountForm.reset({ parentId: null })
    this.accountForm.get('code')?.enable()
    this.accountForm.get('type')?.enable()
    this.modalService.open(modal, { centered: true, size: 'lg' })
  }

  openEditModal(modal: TemplateRef<unknown>, account: ChartOfAccount): void {
    this.editingAccount = account
    this.accountForm.patchValue({
      code: account.code,
      name: account.name,
      type: account.type,
      parentId: account.parentId,
    })
    this.accountForm.get('code')?.disable()
    this.accountForm.get('type')?.disable()
    this.modalService.open(modal, { centered: true, size: 'lg' })
  }

  onSubmit(modal: { dismiss: () => void }): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    const formValue = this.accountForm.getRawValue()

    const request$ = this.editingAccount
      ? this.chartOfAccountsService.update(this.editingAccount.id, { name: formValue.name })
      : this.chartOfAccountsService.create(formValue as ChartOfAccountCreateRequest)

    request$.pipe(catchError(() => of(null)), takeUntil(this.destroy$)).subscribe((res) => {
      this.isSubmitting = false
      if (res) {
        const messageKey = this.editingAccount
          ? 'CHART_OF_ACCOUNTS.UPDATE_SUCCESS'
          : 'CHART_OF_ACCOUNTS.CREATE_SUCCESS'
        this.notificationService.showNotification({
          title: 'CHART_OF_ACCOUNTS.TITLE',
          message: messageKey,
          type: 'success',
        })
        modal.dismiss()
        this.loadAccounts()
      }
    })
  }

  toggleActive(account: ChartOfAccount): void {
    this.chartOfAccountsService
      .update(account.id, { isActive: !account.isActive })
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          account.isActive = !account.isActive
        }
      })
  }
}
