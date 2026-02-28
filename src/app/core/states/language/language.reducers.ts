import { createReducer, on } from '@ngrx/store'
import { LanguageState } from '../../interfaces/ui/language.interface'
import { loadPreviewLanguageSuccess } from './language.actions'
import { AVAILABLE_LANGUAGES } from '@core/helpers/global/global.constants'

const initialState: LanguageState = {
  code: AVAILABLE_LANGUAGES.ES,
}

export const languageReducer = createReducer(
  initialState,
  on(loadPreviewLanguageSuccess, (state, { language }) => ({
    ...state,
    code: language,
  }))
)
