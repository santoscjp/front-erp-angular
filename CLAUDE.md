# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install --force   # Install dependencies (--force required due to peer conflicts)
npm start             # ng serve → localhost:4200
npm run build         # Production build → dist/osen/
npm test              # Karma + Jasmine tests
npm run format        # Prettier: src/**/*.{ts,html}
npm run translate     # Auto-translate en.json → es.json (and other locales)
```

## Architecture

Angular 19 standalone-component SPA with NgRx state management. This is the frontend for an accounting microservice ("Contabilidad") that connects to an existing invoicing system ("Facturación") via JWT SSO and API Key sync. Multi-tenant SaaS for Ecuadorian companies (50-500 issuers).

### Project Layout

- **`core/`** — Singletons: guards, interceptors, services (`api/` and `ui/`), NgRx state (`states/`), interfaces, constants
- **`features/`** — Lazy-loaded feature modules, each with `pages/`, `components/`, and a `*.route.ts`
- **`shared/`** — Reusable layout components (sidebar, topbar, footer), directives, pipes
- **`assets/i18n/`** — Translation JSON files (en.json, es.json)
- **`environments/`** — Dev (`192.168.1.17:3000/v1/api`) and prod config

### Routing

Root routes in `app.routes.ts` split into two layouts:
- **`LayoutComponent`** (authenticated) → loads `features/views.route.ts` which lazy-loads each feature. Protected by `AuthGuard` + `LockScreenGuard`.
- **`AuthLayoutComponent`** (public) → login, lock-screen, account-deactivation. Protected by `LoginGuard` (redirects if already logged in).

Each feature defines routes as `export const FEATURE_ROUTES: Route[]` in a `*.route.ts` file, registered in `views.route.ts` via `loadChildren`.

### Auth & Token Flow

1. Login posts to `/auth/login` with header `{ skip: 'skip' }` to bypass the token interceptor
2. Response stored encrypted in localStorage under key `USER_SESSION` via `StorageService.secureStorage` (AES encryption with `environment.secretKey`)
3. `AuthTokenInterceptor` reads the stored session and sets header `x-api-key: <token>` on all subsequent requests
4. `ErrorInterceptor` catches HTTP errors, shows toastr notifications, and redirects to `/auth/account-deactivation` on 403
5. Token expiration checked via manually decoded JWT `exp` claim using `date-fns.isBefore()`

Session also supports lock-screen (sessionStorage flag) and remember-me (AES-encrypted credentials in localStorage).

### NgRx State

Defined in `core/states/index.ts`. AppState has four slices:

| Slice | Key files | Purpose |
|-------|-----------|---------|
| `auth` | `auth.actions.ts`, `auth.reducers.ts`, `auth.effects.ts`, `auth.selectors.ts` | User session, login/logout, profile updates |
| `language` | `language.*` | Current locale (ES/EN) |
| `layout` | `layout-*` | Theme, sidebar size, topbar color via HTML `data-*` attributes |
| `Calendar` | `calendar.*` | Calendar events |

Pattern: Actions grouped as exported object (e.g. `UserActions`), effects use `inject()`, reducers use `createReducer` with `on()`.

### Sidebar Menu

Defined in `core/helpers/ui/menu-meta.ts` as `MENU_ITEMS: MenuItemType[]`. Each item has `key`, `label` (translation key), `icon` (Tabler Icons `ti-*`), `url`, and optional `children`. Items with `isTitle: true` render as section headers.

## Key Conventions

### Components
- Always `standalone: true`, no NgModules
- Use `inject()` for DI, not constructor parameters
- Selector prefix: `app-`
- Add `CUSTOM_ELEMENTS_SCHEMA` when using `<iconify-icon>` or other web components
- Templates in separate files (`templateUrl`); styles via `styleUrl`

### Services
- `@Injectable({ providedIn: 'root' })`
- Base URL from `environment.apiBaseUrl`
- Return `Observable<ApiResponse<T>>` — wrapper: `{ statusCode, status, message: MsgTranslate, data: T }`
- Paginated responses use `ApiData<T>`: `{ result: T, totalCount: number }`
- Show notifications via `ToastrNotificationService` using `tap()` in pipe

### TypeScript Path Aliases
```
@core/*         → src/app/core/*
@environment/*  → src/environments/*
@/*             → src/*
@assets/*       → src/assets/*
```

### Formatting
- Prettier: no semicolons, single quotes, trailing commas (es5), 2-space indent
- EditorConfig: UTF-8, 2-space indent, final newline

### i18n
- `TranslateModule` imported in each standalone component
- Templates: `{{ 'KEY' | translate }}`
- TypeScript: `this.translateService.instant('KEY')`
- API messages use bilingual format: `MsgTranslate { es: string, en: string }`

## Accounting Domain Context

This system implements Ecuadorian accounting standards. The backend (Express+TypeScript, separate repo) handles multi-tenant isolation via `emisor_id` extracted from JWT — the frontend never sends it.

### Permissions System
JWT payload includes `permissions` array (e.g. `chart_of_accounts:read`, `journal_entries:approve`, `fiscal_periods:close`). Role `"all"` grants full access (ADMIN only). Roles: ADMIN, ACCOUNTANT, ASSISTANT_ACCOUNTANT, VIEWER.

### Key Business Rules
- **Double-entry**: Every journal entry must satisfy `SUM(debit) = SUM(credit)`
- **Closed periods**: Block creation/editing of journal entries
- **Auto-generated entries**: Documents synced from invoicing arrive as DRAFT status
- **SSO users**: No password, authenticate only via redirect from invoicing system
