import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core'
import { Store } from '@ngrx/store'
import { selectPermissions } from '@core/states/auth/auth.selectors'
import { ADMIN_PERMISSION } from '@core/helpers/global/global.constants'
import { Subject, takeUntil } from 'rxjs'

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input('appHasPermission') permission!: string

  private templateRef = inject(TemplateRef<any>)
  private viewContainer = inject(ViewContainerRef)
  private store = inject(Store)
  private destroy$ = new Subject<void>()
  private hasView = false

  ngOnInit(): void {
    this.store
      .select(selectPermissions)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissions) => {
        const hasAccess =
          permissions.includes(ADMIN_PERMISSION) ||
          permissions.includes(this.permission)

        if (hasAccess && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef)
          this.hasView = true
        } else if (!hasAccess && this.hasView) {
          this.viewContainer.clear()
          this.hasView = false
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
