export const TOKEN_HEADER_KEY = 'x-api-key'
export const USER_SESSION = 'USER_SESSION'
export const USER_SESSION_PRE = 'USER_SESSION_PRE'

export const LOCAL_STORAGE_NAMES = {
  LANGUAGE: 'Language',
  THEME: 'Theme',
}

export const AVAILABLE_LANGUAGES = {
  ES: 'es',
  EN: 'en',
} as const

export const USER_SESSION_LOGIN = {
  USER: 'user',
} as const

export const BLOCKED_OPTIONS = [
  { value: true, label: 'WORDS.YES' },
  { value: false, label: 'WORDS.NO' },
]

export const MODAL_TYPE = {
  ROLE_FORM: 'role-form',
  MODULE_FORM: 'module-form',
  PERMISSION_FORM: 'permission-form',
}

export const PERMISSIONS_ROLES_AND_PERMISSIONS = {
  view_all: 'ver_todo',
  view_all_roles: 'ver_modulo_de_roles',
  create_roles: 'crear_roles',
}
