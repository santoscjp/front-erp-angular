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
import {
  selectIsSuperAdmin,
  selectModules,
} from '@core/states/auth/auth.selectors'
import { Subject, combineLatest, takeUntil } from 'rxjs'

@Directive({
  selector: '[appHasModule]',
  standalone: true,
})
export class HasModuleDirective implements OnInit, OnDestroy {
  @Input('appHasModule') moduleKey!: string

  private templateRef = inject(TemplateRef<unknown>)
  private viewContainer = inject(ViewContainerRef)
  private store = inject(Store)
  private destroy$ = new Subject<void>()
  private hasView = false

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectIsSuperAdmin),
      this.store.select(selectModules),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isSuperAdmin, modules]) => {
        const hasAccess = isSuperAdmin || modules.includes(this.moduleKey)

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
