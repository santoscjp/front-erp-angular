import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { AuthenticationService } from '@core/services/api/auth.service'
import { UserActions } from '@core/states/auth/auth.actions'

@Component({
  selector: 'app-sso-callback',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-muted">Iniciando sesion...</p>
      </div>
    </div>
  `,
})
export class SsoCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private store = inject(Store)
  private authService = inject(AuthenticationService)

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token')

    if (!token) {
      this.router.navigate(['/auth/login'])
      return
    }
    console.log(token)

    this.authService.handleSsoToken(token)
    this.store.dispatch(UserActions.ssoTokenReceived({ token }))

    const decoded = this.authService.getDecodedToken()
    const isSuperAdmin = decoded?.['isSuperAdmin'] === true
    const redirectPath = isSuperAdmin ? '/admin' : '/dashboard'
    this.router.navigate([redirectPath], { replaceUrl: true })
  }
}
