import { Component, inject, ViewChild, type OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { SessionTimeoutService } from '@core/services/ui/session-timeout.service'
import { TitleService } from '@core/services/ui/title.service'
import { UserActions } from '@core/states/auth/auth.actions'
import { loadPreviewLanguage } from '@core/states/language/language.actions'
import { loadPreviewTheme } from '@core/states/layout/layout-action'
import { Store } from '@ngrx/store'
import { NgProgressComponent, NgProgressModule } from 'ngx-progressbar'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgProgressModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent

  private titleService = inject(TitleService)
  private _router = inject(Router)
  private _sessionTimeoutService = inject(SessionTimeoutService)
  private _storeService = inject(Store)

  ngOnInit(): void {
    this.initializeApp()
    this.titleService.init()
  }

  private initializeApp(): void {
    this._storeService.dispatch(UserActions.loadUserSession())
    this._storeService.dispatch(loadPreviewLanguage())
    this._storeService.dispatch(loadPreviewTheme())
  }
}
