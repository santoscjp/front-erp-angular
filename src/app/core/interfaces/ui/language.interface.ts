import { AVAILABLE_LANGUAGES } from '@core/helpers/global/global.constants'

export type LanguageCode =
  (typeof AVAILABLE_LANGUAGES)[keyof typeof AVAILABLE_LANGUAGES]

export interface LanguageState {
  code: LanguageCode
}
