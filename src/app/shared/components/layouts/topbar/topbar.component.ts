import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  inject,
} from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
  NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

import { splitArray } from '@core/helpers/ui/utils'
import { currency } from '@core/helpers/ui/constants'
import { appData, languages, languageToFlagMap } from './data'

import { User } from '@core/interfaces/api/user.interface'
import { GlobalService } from '@core/services/ui/global.service'

import { UserActions } from '@core/states/auth/auth.actions'

import { LogoComponent } from '../logo/logo.component'
import { environment } from '@environment/environment'
import { changetheme } from '@core/states/layout/layout-action'
import { LayoutState } from '@core/states/layout/layout-reducers'
import { getLayoutColor } from '@core/states/layout/layout-selector'

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgbOffcanvasModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    NgbModalModule,
    LogoComponent,
    TranslateModule,
  ],
  styles: ``,
})
export class TopbarComponent implements OnInit {
  public userProfile!: User
  public currency = currency
  public languageList = languages
  public appsChunks = splitArray(appData, 3)
  public color!: string
  public readonly languageToFlagMap = languageToFlagMap
  private baseUrl: string = environment.apiBaseUrl
  public userImage: string = ''

  @Output() settingsButtonClicked = new EventEmitter<void>()
  @Output() mobileMenuButtonClicked = new EventEmitter<void>()

  private modalService = inject(NgbModal)
  private store = inject(Store)
  public translate = inject(TranslateService)
  private profileService = inject(GlobalService)
  private router = inject(Router)

  ngOnInit(): void {
    this.initializeLanguage()
    this.getProfile()
    this.getLayoutTheme()
  }

  private getProfile(): void {
    this.profileService.profile.subscribe((user) => {
      this.userProfile = user
      this.userImage = user.profilePhoto
        ? this.formatUrl(user.profilePhoto)
        : 'assets/images/default-avatar.png'
    })
  }

  private formatUrl(url?: string): string {
    if (!url) {
      return 'assets/images/default-avatar.png'
    }
    return this.baseUrl + '/' + url.replace(/ /g, '%20').replace(/\\/g, '/')
  }

  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en'
    this.translate.setDefaultLang('en')
    this.translate.use(savedLanguage)
  }

  private getLayoutTheme(): void {
    this.store.select('layout').subscribe((data: LayoutState) => {
      this.color = data.LAYOUT_THEME
    })
  }

  open(content: TemplateRef<any>): void {
    this.modalService.open(content, { size: 'lg' })
  }

  settingMenu(): void {
    this.settingsButtonClicked.emit()
  }

  toggleMobileMenu(): void {
    this.mobileMenuButtonClicked.emit()
  }

  changeTheme(): void {
    const currentTheme =
      document.documentElement.getAttribute('data-bs-theme') || 'light'
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'

    this.store.dispatch(changetheme({ color: newTheme }))
    this.store.select(getLayoutColor).subscribe((theme) => {
      document.documentElement.setAttribute('data-bs-theme', theme)
    })
  }

  changeLanguage(language: string): void {
    this.translate.use(language)
    localStorage.setItem('preferredLanguage', language)
  }

  logout(): void {
    this.store.dispatch(UserActions.userLogout())
  }
}
