import { Component, inject, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from '@core/interfaces/api/user.interface'
import { AuthenticationService } from '@core/services/api/auth.service'
import { UserActions } from '@core/states/auth/auth.actions'
import { Store } from '@ngrx/store'
import { catchError, finalize, of } from 'rxjs'

type TwoFactorStep = 'idle' | 'qr' | 'disabling'

@Component({
  selector: 'qr-configuration',
  standalone: false,
  templateUrl: './qr-configuration.component.html',
  styleUrl: './qr-configuration.component.scss',
})
export class QrConfigurationComponent implements OnInit {
  @Input({ required: true }) user!: User

  public step: TwoFactorStep = 'idle'
  public qrCodeUrl: string | null = null
  public isLoading = false
  public verificationForm: FormGroup
  public disableForm: FormGroup

  private readonly _authService = inject(AuthenticationService)
  private readonly _store = inject(Store)
  private readonly _fb = inject(FormBuilder)

  constructor() {
    this.verificationForm = this._fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    })
    this.disableForm = this._fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    })
  }

  ngOnInit(): void {
    this.step = 'idle'
  }

  get isTwoFactorEnabled(): boolean {
    return this.user?.twoFactorEnabled ?? false
  }

  onGenerateQR(): void {
    this.isLoading = true
    this._authService
      .setup2FA()
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((res) => {
        if (res) {
          this.qrCodeUrl = res.data.qrCodeUrl
          this.step = 'qr'
        }
      })
  }

  onVerifyAndEnable(): void {
    if (this.verificationForm.invalid || this.isLoading) return

    const { code } = this.verificationForm.value
    this.isLoading = true

    this._authService
      .enable2FA(code)
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((res) => {
        if (res) {
          this.step = 'idle'
          this.qrCodeUrl = null
          this.verificationForm.reset()
          this._store.dispatch(UserActions.loadUserSession())
        }
      })
  }

  onStartDisable(): void {
    this.step = 'disabling'
    this.disableForm.reset()
  }

  onConfirmDisable(): void {
    if (this.disableForm.invalid || this.isLoading) return

    const { code } = this.disableForm.value
    this.isLoading = true

    this._authService
      .disable2FA(code)
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((res) => {
        if (res) {
          this.step = 'idle'
          this.disableForm.reset()
          this._store.dispatch(UserActions.loadUserSession())
        }
      })
  }

  onCancelAction(): void {
    this.step = 'idle'
    this.qrCodeUrl = null
    this.verificationForm.reset()
    this.disableForm.reset()
  }
}
