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
import { combineLatest, type Subscription } from 'rxjs'
import { AuthenticationService } from '@core/services/api/auth.service'
import { ToastrNotificationService } from '@core/services/ui/notification.service'

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
  private menuSub?: Subscription

  constructor() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.trimmedURL = this.router.url?.replaceAll(
          basePath !== '' ? basePath + '/' : '',
          '/',
        )
        this._activateMenu()
        setTimeout(() => {
          this.scrollToActive()
        }, 200)
        if (document.documentElement.classList.contains('sidebar-enable')) {
          this.closeSidebar()
        }
      }
    })
  }

  ngOnInit(): void {
    this.initMenu()
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe()
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
        this.menuItems = this.filterMenu(MENU_ITEMS, permissions, modules)
      }
    })
  }

  private filterMenu(
    items: MenuItemType[],
    permissions: string[],
    modules: string[],
  ): MenuItemType[] {
    const hasAll = permissions.includes('all')

    const filteredItems = items.map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          this.isItemVisible(child, permissions, modules, hasAll),
        )
        if (filteredChildren.length === 0) return null
        return { ...item, children: filteredChildren }
      }
      if (item.isTitle) return item
      if (!this.isItemVisible(item, permissions, modules, hasAll)) return null
      return item
    })

    const result: MenuItemType[] = []
    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i]
      if (!item) continue

      if (item.isTitle) {
        let hasVisibleChild = false
        for (let j = i + 1; j < filteredItems.length; j++) {
          if (filteredItems[j]?.isTitle) break
          if (filteredItems[j]) {
            hasVisibleChild = true
            break
          }
        }
        if (hasVisibleChild) result.push(item)
      } else {
        result.push(item)
      }
    }

    return result
  }

  private isItemVisible(
    item: MenuItemType,
    permissions: string[],
    modules: string[],
    hasAllPermissions: boolean,
  ): boolean {
    if (item.module && !modules.includes(item.module)) return false
    if (item.permission) {
      return hasAllPermissions || permissions.includes(item.permission)
    }
    return true
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

  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu()
    })
    setTimeout(() => {
      this.scrollToActive()
    }, 200)
  }

  hasSubmenu(menu: MenuItemType): boolean {
    return menu.children ? true : false
  }

  scrollToActive(): void {
    const activatedItem = document.querySelector('.side-nav-item li a.active')
    if (activatedItem) {
      const simplebarContent = document.querySelector(
        '.sidenav-menu .simplebar-content-wrapper',
      )
      if (simplebarContent) {
        const activatedItemRect = activatedItem.getBoundingClientRect()
        const simplebarContentRect = simplebarContent.getBoundingClientRect()
        const activatedItemOffsetTop =
          activatedItemRect.top + simplebarContent.scrollTop
        const centerOffset =
          activatedItemOffsetTop -
          simplebarContentRect.top -
          simplebarContent.clientHeight / 2 +
          activatedItemRect.height / 2
        this.scrollTo(simplebarContent, centerOffset, 600)
      }
    }
  }

  easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  scrollTo(element: Element, to: number, duration: number): void {
    const start = element.scrollTop
    const change = to - start
    const increment = 20
    let currentTime = 0

    const animateScroll = () => {
      currentTime += increment
      const val = this.easeInOutQuad(currentTime, start, change, duration)
      element.scrollTop = val
      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }
    }
    animateScroll()
  }

  _activateMenu(): void {
    const div = document.querySelector('.sidenav-menu')

    let matchingMenuItem = null

    if (div) {
      const items: HTMLCollectionOf<Element> =
        div.getElementsByClassName('nav-link-ref')
      for (let i = 0; i < items.length; ++i) {
        const navItem = items[i] as HTMLAnchorElement
        if (this.trimmedURL === navItem.pathname) {
          matchingMenuItem = navItem
          break
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('aria-controls')
        if (!mid) return
        const activeMt = findMenuItem(this.menuItems, mid)

        if (activeMt) {
          const matchingObjs = [
            activeMt['key'],
            ...findAllParent(this.menuItems, activeMt),
          ]

          this.activeMenuItems = matchingObjs
          this.menuItems.forEach((menu: MenuItemType) => {
            menu.collapsed = !matchingObjs.includes(menu.key!)
          })
        }
      }
    }
  }

  toggleMenuItem(menuItem: MenuItemType, collapse: NgbCollapse): void {
    collapse.toggle()
    let openMenuItems: string[]
    if (!menuItem.collapsed) {
      openMenuItems = [
        menuItem['key'],
        ...findAllParent(this.menuItems, menuItem),
      ]
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

  changeSidebarSize() {
    let size = document.documentElement.getAttribute('data-sidenav-size')
    if (size == 'sm-hover') {
      size = 'sm-hover-active'
    } else {
      size = 'sm-hover'
    }
    this.store.dispatch(changesidebarsize({ size }))
    this.store.select(getSidebarsize).subscribe((size) => {
      document.documentElement.setAttribute('data-sidenav-size', size)
    })
  }
}
