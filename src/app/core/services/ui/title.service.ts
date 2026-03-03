import { DestroyRef, inject, Injectable } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, take } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private titleService = inject(Title)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private translate = inject(TranslateService)
  private readonly destroyRef = inject(DestroyRef)

  init(): void {
    combineLatest([
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
      this.translate.onLangChange,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateTitle()
      })
  }

  private updateTitle(): void {
    let route = this.activatedRoute
    while (route.firstChild) {
      route = route.firstChild
    }

    const titleKey = route.snapshot.data['title']

    if (titleKey) {
      this.translate
        .get(titleKey)
        .pipe(take(1))
        .subscribe((translatedTitle: string) => {
          this.titleService.setTitle(translatedTitle + ' | ZFacturacion')
        })
    }
  }
}
