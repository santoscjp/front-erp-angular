import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  type OnInit,
} from '@angular/core'
import {
  changelayout,
  changetheme,
  changemode,
  changetopbarcolor,
  changemenucolor,
  changesidebarsize,
  resetState,
} from '@core/states/layout/layout-action'
import { LayoutState } from '@core/states/layout/layout-reducers'
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { SimplebarAngularModule } from 'simplebar-angular'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [SimplebarAngularModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  offcanvas = inject(NgbActiveOffcanvas)
  store = inject(Store)

  private readonly destroy$ = new Subject<void>()

  layout: string = ''
  color: string = ''
  topbar: string = ''
  menuColor: string = ''
  menuSize: string = ''
  mode: string = ''

  ngOnInit(): void {
    this.store
      .select('layout')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: LayoutState) => {
        this.layout = data.LAYOUT
        this.color = data.LAYOUT_THEME
        this.topbar = data.TOPBAR_COLOR
        this.menuColor = data.MENU_COLOR
        this.menuSize = data.MENU_SIZE
        this.mode = data.LAYOUT_MODE
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  changeLayout(layout: string): void {
    this.layout = layout
    this.store.dispatch(changelayout({ layout }))
  }

  changeLayoutColor(color: string): void {
    this.store.dispatch(changetheme({ color }))
    document.documentElement.setAttribute('data-bs-theme', color)
  }

  changeLayoutMode(mode: string): void {
    this.store.dispatch(changemode({ mode }))
    document.documentElement.setAttribute('data-layout-mode', mode)
  }

  changeTopbar(topbar: string): void {
    this.store.dispatch(changetopbarcolor({ topbar }))
    document.documentElement.setAttribute('data-topbar-color', topbar)
  }

  changeMenu(menu: string): void {
    this.store.dispatch(changemenucolor({ menu }))
    document.documentElement.setAttribute('data-menu-color', menu)
  }

  changeSize(size: string): void {
    this.store.dispatch(changesidebarsize({ size }))
    document.documentElement.setAttribute('data-sidenav-size', size)
  }

  reset(): void {
    this.store.dispatch(resetState())
  }
}
