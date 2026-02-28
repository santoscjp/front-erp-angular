import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { TranslateService } from '@ngx-translate/core'
import { exhaustMap, of } from 'rxjs'
import {
  loadPreviewLanguage,
  loadPreviewLanguageSuccess,
} from './language.actions'
import { AVAILABLE_LANGUAGES } from '@core/helpers/global/global.constants'

@Injectable()
export class LanguageEffects {
  private _actions$ = inject(Actions)
  private _translate = inject(TranslateService)

  loadPreviewLanguage = createEffect(() =>
    this._actions$.pipe(
      ofType(loadPreviewLanguage),
      exhaustMap(() => {
        const language = AVAILABLE_LANGUAGES.ES
        this._translate.setDefaultLang(language)
        this._translate.use(language)

        return of(loadPreviewLanguageSuccess({ language }))
      })
    )
  )
}
