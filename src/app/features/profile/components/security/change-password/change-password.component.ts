import { Component, inject, Input } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { User } from '@core/interfaces/api/user.interface'
import { UserService } from '@core/services/api/user.service'
import { catchError, finalize, of } from 'rxjs'

function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const newPassword = form.get('newPassword')?.value
  const confirmPassword = form.get('confirmPassword')?.value
  return newPassword === confirmPassword ? null : { passwordMismatch: true }
}

@Component({
  selector: 'change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  @Input({ required: true }) user!: User

  public passwordForm: FormGroup
  public isLoading = false
  public showCurrentPassword = false
  public showNewPassword = false
  public showConfirmPassword = false

  private readonly _userService = inject(UserService)
  private readonly _fb = inject(FormBuilder)

  public readonly SOURCE_LOCAL = 'LOCAL'

  constructor() {
    this.passwordForm = this._fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    )
  }

  get isLocalUser(): boolean {
    return this.user?.sourceSystem === this.SOURCE_LOCAL
  }

  get newPasswordControl(): AbstractControl {
    return this.passwordForm.get('newPassword')!
  }

  get confirmPasswordControl(): AbstractControl {
    return this.passwordForm.get('confirmPassword')!
  }

  get hasPasswordMismatch(): boolean {
    return (
      this.passwordForm.hasError('passwordMismatch') &&
      this.confirmPasswordControl.touched
    )
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || this.isLoading) return

    const { currentPassword, newPassword } = this.passwordForm.value
    this.isLoading = true

    this._userService
      .changeMyPassword(currentPassword, newPassword)
      .pipe(
        catchError(() => of(null)),
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.passwordForm.reset()
        }
      })
  }
}
