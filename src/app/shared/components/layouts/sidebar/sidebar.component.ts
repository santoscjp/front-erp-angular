import {
  Component,
  inject,
  Renderer2,
  type OnInit,
  type OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import { SimplebarAngularModule } from 'simplebar-angular'
import { LogoComponent } from '../logo/logo.component'
import {
  MENU_ITEMS,
  ADMIN_MENU_ITEMS,
  type MenuItemType,
} from '@core/helpers/ui/menu-meta'
import { basePath } from '@core/helpers/ui/constants'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { Store } from '@ngrx/store'
import { findAllParent, findMenuItem } from '@core/helpers/ui/utils'
import {
  NgbCollapseModule,
  type NgbCollapse,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { changesidebarsize } from '@core/states/layout/layout-action'
import { getSidebarsize } from '@core/states/layout/layout-selector'
import {
  selectPermissions,
  selectIsSuperAdmin,
  selectModules,
} from '@core/states/auth/auth.selectors'
import { combineLatest, filter, type Subscription, take } from 'rxjs'
import { AuthenticationService } from '@core/services/api/auth.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'
import { SidebarMenuService } from '@core/services/ui/sidebar-menu.service'
import { scrollToActiveElement } from '@/app/shared/utils/scroll.utils'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SimplebarAngularModule,
    LogoComponent,
    CommonModule,
    NgbCollapseModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './sidebar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItemType[] = []
  activeMenuItems: string[] = []

  router = inject(Router)
  trimmedURL = this.router.url?.replaceAll(
    basePath !== '' ? basePath + '/' : '',
    '/',
  )

  store = inject(Store)
  private renderer = inject(Renderer2)
  private authService = inject(AuthenticationService)
  private notificationService = inject(ToastrNotificationService)
  private sidebarMenuService = inject(SidebarMenuService)
  private menuSub?: Subscription
  private routerSub?: Subscription

  ngOnInit(): void {
    this.initMenu()
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.trimmedURL = this.router.url?.replaceAll(
          basePath !== '' ? basePath + '/' : '',
          '/',
        )
        this._activateMenu()
        setTimeout(() => scrollToActiveElement('.sidenav-menu', '.side-nav-item li a.active'), 200)
        if (document.documentElement.classList.contains('sidebar-enable')) {
          this.closeSidebar()
        }
      })
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe()
    this.routerSub?.unsubscribe()
  }

  ngAfterViewInit(): void {
    setTimeout(() => this._activateMenu())
    setTimeout(() => scrollToActiveElement('.sidenav-menu', '.side-nav-item li a.active'), 200)
  }

  initMenu(): void {
    this.menuSub = combineLatest([
      this.store.select(selectIsSuperAdmin),
      this.store.select(selectPermissions),
      this.store.select(selectModules),
    ]).subscribe(([isSuperAdmin, permissions, modules]) => {
      if (isSuperAdmin) {
        this.menuItems = [...ADMIN_MENU_ITEMS]
      } else {
        this.menuItems = this.sidebarMenuService.filterMenu(MENU_ITEMS, permissions, modules)
      }
    })
  }

  onExternalMenuClick(menu: MenuItemType): void {
    if (menu.key === 'INVOICING') {
      this.authService.getSsoToInvoicingUrl().subscribe({
        next: (response) => {
          window.open(response.data.redirectUrl, '_blank')
        },
        error: () => {
          this.notificationService.showNotification({
            title: 'SIDEBAR.INVOICING',
            message: 'ADMIN.EMISOR.MODULES.NOT_LINKED',
            type: 'warning',
          })
        },
      })
    }
  }

  hasSubmenu(menu: MenuItemType): boolean {
    return !!menu.children
  }

  _activateMenu(): void {
    const div = document.querySelector('.sidenav-menu')
    if (!div) return

    const items = div.getElementsByClassName('nav-link-ref')
    let matchingMenuItem: HTMLAnchorElement | null = null

    for (let i = 0; i < items.length; ++i) {
      const navItem = items[i] as HTMLAnchorElement
      if (this.trimmedURL === navItem.pathname) {
        matchingMenuItem = navItem
        break
      }
    }

    if (!matchingMenuItem) return

    const mid = matchingMenuItem.getAttribute('aria-controls')
    if (!mid) return
    const activeMt = findMenuItem(this.menuItems, mid)

    if (activeMt) {
      const matchingObjs = [activeMt['key'], ...findAllParent(this.menuItems, activeMt)]
      this.activeMenuItems = matchingObjs
      this.menuItems.forEach((menu: MenuItemType) => {
        menu.collapsed = !matchingObjs.includes(menu.key!)
      })
    }
  }

  toggleMenuItem(menuItem: MenuItemType, collapse: NgbCollapse): void {
    collapse.toggle()
    if (!menuItem.collapsed) {
      const openMenuItems = [menuItem['key'], ...findAllParent(this.menuItems, menuItem)]
      this.menuItems.forEach((menu: MenuItemType) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true
        }
      })
    }
  }

  closeSidebar(): void {
    document.documentElement.classList.remove('sidebar-enable')
    const backdrop = document.querySelector('.offcanvas-backdrop')
    if (backdrop) {
      this.renderer.removeChild(document.body, backdrop)
      this.renderer.setStyle(document.body, 'overflow', null)
      this.renderer.setStyle(document.body, 'paddingRight', null)
    }
  }

  changeSidebarSize(): void {
    let size = document.documentElement.getAttribute('data-sidenav-size')
    size = size === 'sm-hover' ? 'sm-hover-active' : 'sm-hover'
    this.store.dispatch(changesidebarsize({ size }))
    this.store
      .select(getSidebarsize)
      .pipe(take(1))
      .subscribe((currentSize: string) => {
        document.documentElement.setAttribute('data-sidenav-size', currentSize)
      })
  }
}
