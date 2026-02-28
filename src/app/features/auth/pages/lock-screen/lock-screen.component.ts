import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import {
  User,
  LoginRequest,
  UserState,
} from '@core/interfaces/api/user.interface'
import { AuthenticationService } from '@core/services/api/auth.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { UserActions } from '@core/states/auth/auth.actions'
import { selectAuth } from '@core/states/auth/auth.selectors'
import { Store } from '@ngrx/store'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'lock-screen',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './lock-screen.component.html',
})
export class LockScreenComponent implements OnInit {
  public userProfile!: User
  public unlockForm!: FormGroup
  private onDestroy$: Subject<boolean> = new Subject()
  public isLoading: boolean = false
  public userImage: string = 'assets/images/default-avatar.png'

  private translate = inject(TranslateService)
  private _store = inject(Store)
  private toastr = inject(ToastrService)
  private notificationService = inject(ToastrNotificationService)
  private _fb = inject(FormBuilder)
  private _authService = inject(AuthenticationService)
  private _router = inject(Router)

  ngOnInit(): void {
    this.getProfile()
    this.initForm()
  }

  private getProfile(): void {
    this._store
      .select(selectAuth)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: UserState) => {
        if (state.user) {
          this.userProfile = state.user
        }
      })
  }

  private initForm(): void {
    this.unlockForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  unlockSession(): void {
    if (this.unlockForm.valid) {
      const data: LoginRequest = {
        emisorRuc: '',
        email: this.userProfile.email,
        password: this.unlockForm.get('password')?.value,
      }

      if (data) {
        this.isLoading = true
        this._authService.login(data).subscribe({
          next: (res) => {
            this.isLoading = false
            this._authService.unlockSession()
            this._router.navigate(['/'])
            this.notificationService.showNotification({
              type: 'success',
              message: res.message,
            })
          },
          error: (error) => {
            this.notificationService.showNotification({
              type: 'error',
              message: error.message,
            })
            this.isLoading = false
          },
        })
      }
    } else {
      const warningMsg = this.translate.instant(
        'LOGIN.MESSAGES.FORM_INCOMPLETE'
      )
      this.notificationService.showNotification({
        type: 'warning',
        message: warningMsg,
      })
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true)
  }
}
