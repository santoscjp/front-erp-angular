import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  Renderer2,
  type OnInit,
} from '@angular/core'
import { TopbarComponent } from '../topbar/topbar.component'
import { SidebarComponent } from '../sidebar/sidebar.component'
import { FooterComponent } from '../footer/footer.component'
import { RouterModule } from '@angular/router'
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap'
import { RightSidebarComponent } from '@/app/shared/components/layouts/right-sidebar/right-sidebar.component'
import { Store } from '@ngrx/store'
import { changesidebarsize } from '@core/states/layout/layout-action'
import { LayoutState } from '@core/states/layout/layout-reducers'
import { getSidebarsize } from '@core/states/layout/layout-selector'
import { Subject, take, takeUntil } from 'rxjs'

@Component({
  selector: 'app-vertical-layout',
  standalone: true,
  imports: [
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    RouterModule,
    NgbOffcanvasModule,
  ],
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss'],
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private offcanvasService = inject(NgbOffcanvas)
  private renderer = inject(Renderer2)

  private readonly destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.store
      .select('layout')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: LayoutState) => {
        document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_THEME)
        document.documentElement.setAttribute('data-menu-color', data.MENU_COLOR)
        document.documentElement.setAttribute('data-topbar-color', data.TOPBAR_COLOR)
        document.documentElement.setAttribute('data-sidenav-size', data.MENU_SIZE)
      })

    if (document.documentElement.clientWidth <= 1140) {
      this.onResize()
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSettingsButtonClicked(): void {
    this.offcanvasService.open(RightSidebarComponent, {
      position: 'end',
      backdrop: true,
    })
  }

  onToggleMobileMenu(): void {
    const size = document.documentElement.getAttribute('data-sidenav-size')

    document.documentElement.classList.toggle('sidebar-enable')
    if (size !== 'full') {
      if (document.documentElement.classList.contains('sidebar-enable')) {
        this.store.dispatch(changesidebarsize({ size: 'condensed' }))
      } else {
        this.store.dispatch(changesidebarsize({ size: 'default' }))
      }
    } else {
      this.showBackdrop()
    }
  }

  showBackdrop(): void {
    const backdrop = this.renderer.createElement('div')
    this.renderer.addClass(backdrop, 'offcanvas-backdrop')
    this.renderer.addClass(backdrop, 'fade')
    this.renderer.addClass(backdrop, 'show')
    this.renderer.appendChild(document.body, backdrop)
    this.renderer.setStyle(document.body, 'overflow', 'hidden')

    if (window.innerWidth > 1040) {
      this.renderer.setStyle(document.body, 'paddingRight', '15px')
    }

    this.renderer.listen(backdrop, 'click', () => {
      document.documentElement.classList.remove('sidebar-enable')
      this.renderer.removeChild(document.body, backdrop)
      this.renderer.setStyle(document.body, 'overflow', null)
      this.renderer.setStyle(document.body, 'paddingRight', null)
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (
      document.documentElement.clientWidth <= 1140 &&
      document.documentElement.clientWidth >= 768
    ) {
      this.store.dispatch(changesidebarsize({ size: 'condensed' }))
    } else if (document.documentElement.clientWidth <= 768) {
      this.store.dispatch(changesidebarsize({ size: 'full' }))
    } else {
      this.store.dispatch(changesidebarsize({ size: 'default' }))
      document.documentElement.classList.remove('sidebar-enable')
      const backdrop = document.querySelector('.offcanvas-backdrop')
      if (backdrop) this.renderer.removeChild(document.body, backdrop)
    }

    this.store
      .select(getSidebarsize)
      .pipe(take(1))
      .subscribe((size: string) => {
        this.renderer.setAttribute(document.documentElement, 'data-sidenav-size', size)
      })
  }
}
