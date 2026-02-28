import {
  Component,
  OnInit,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AuthenticationService } from '@core/services/api/auth.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService, TranslateModule } from '@ngx-translate/core'
import {
  LoginRequest,
  UserState,
} from '@core/interfaces/api/user.interface'
import { Store } from '@ngrx/store'
import { UserActions } from '@core/states/auth/auth.actions'
import { selectAuth } from '@core/states/auth/auth.selectors'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public signInForm!: FormGroup
  public isLoading: boolean = false
  public rememberMeChecked: boolean = false
  public errorMessage: string = ''
  public isSubmitted: boolean = false
  public isShowPassword: boolean = false

  private onDestroy$: Subject<boolean> = new Subject()

  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private store = inject(Store)
  private translate = inject(TranslateService)
  private authService = inject(AuthenticationService)

  ngOnInit(): void {
    this.initSignInForm()
    this.loadRememberedUser()
  }

  private initSignInForm(): void {
    this.signInForm = this.fb.group({
      emisorRuc: ['', [Validators.pattern(/^\d{13}$/)]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    })
  }

  private loadRememberedUser(): void {
    const rememberedUser = this.authService.getRememberedUser()
    if (rememberedUser) {
      this.signInForm.patchValue({
        emisorRuc: rememberedUser.emisorRuc,
        email: rememberedUser.email,
        password: rememberedUser.password,
        rememberMe: true,
      })
      this.rememberMeChecked = true
    }
  }

  get formValues() {
    return this.signInForm.controls
  }

  login(): void {
    this.isSubmitted = true
    if (this.signInForm.valid) {
      this.handleRememberMe()
      this.authenticateUser()
    } else {
      this.showFormIncompleteMessage()
    }
  }

  private handleRememberMe(): void {
    const { emisorRuc, email, password, rememberMe } = this.signInForm.value
    if (rememberMe) {
      this.authService.rememberUser(email, password, emisorRuc)
    } else {
      this.authService.clearRememberedUser()
    }
  }

  private authenticateUser(): void {
    const data: LoginRequest = {
      emisorRuc: this.signInForm.get('emisorRuc')?.value,
      email: this.signInForm.get('email')?.value,
      password: this.signInForm.get('password')?.value,
    }
    if (data) {
      this.isLoading = true
      this.store.dispatch(
        UserActions.userAuthenticationRequest({ request: data })
      )
      this.handleAuthenticationState()
    }
  }

  private handleAuthenticationState(): void {
    this.store
      .select(selectAuth)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: UserState) => {
        this.isLoading = state.loading
      })
  }

  private showFormIncompleteMessage(): void {
    const warningMsg = this.translate.instant('LOGIN.MESSAGES.FORM_INCOMPLETE')
    this.toastr.warning(warningMsg, 'Warning')
  }

  togglePasswordVisibility(): void {
    this.isShowPassword = !this.isShowPassword
  }

  onRememberMeChange() {
    this.rememberMeChecked = !this.rememberMeChecked
  }

  ngOnDestroy() {
    this.onDestroy$.next(true)
    this.onDestroy$.unsubscribe()
  }
}
