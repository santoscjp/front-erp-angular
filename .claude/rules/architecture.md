# Architecture Rules

## Project Structure

```
src/app/
├── core/                          # Singleton: guards, interceptors, services de auth
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── permission.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Agrega Bearer token a cada request
│   │   └── error.interceptor.ts   # Maneja 401, 403, 500
│   └── services/
│       ├── auth.service.ts
│       ├── token.service.ts       # Almacena/decodifica JWT
│       └── permission.service.ts
│
├── shared/                        # Reutilizable en todo el proyecto
│   ├── components/                # Componentes genéricos (confirm-dialog, spinner, pagination)
│   ├── directives/                # has-permission.directive.ts, etc.
│   ├── pipes/                     # currency-ec.pipe.ts, ruc.pipe.ts
│   ├── interfaces/                # UNA interfaz por archivo
│   ├── enums/                     # UN enum por archivo
│   ├── constants/                 # Constantes agrupadas por dominio
│   └── types/                     # Type aliases
│
├── features/                      # Un módulo lazy-loaded por feature
│   ├── auth/
│   │   ├── pages/
│   │   │   └── login/
│   │   └── components/
│   │       └── sso-callback/
│   ├── dashboard/
│   ├── chart-of-accounts/
│   │   ├── pages/                 # Componentes de página (routed)
│   │   ├── components/            # Sub-componentes internos del feature
│   │   └── services/              # Servicios específicos del feature
│   ├── journal-entries/
│   ├── general-ledger/
│   ├── financial-statements/
│   ├── fiscal-periods/
│   ├── bank-reconciliation/
│   ├── sri-reports/
│   └── users/
│
└── layout/                        # Shell: header, sidebar, breadcrumb, footer
    └── components/
```

## Rules

- Every feature module lives under `features/` with its own `pages/`, `components/`, and `services/` folders.
- Feature modules MUST be lazy-loaded via `loadChildren` in the router.
- `core/` contains singleton services, guards, and interceptors. Imported ONLY in `AppModule`.
- `shared/` contains reusable components, pipes, directives, interfaces, enums, constants, and types. Imported in any feature module that needs it.
- `layout/` contains the application shell (header, sidebar, breadcrumb). Not a feature, not shared.
- NEVER import a feature module into another feature module. Use `shared/` for cross-feature needs.
- Each feature service handles HTTP calls and business logic for that feature only.

## Component Responsibility

- Components handle ONLY the view: template binding, user events, navigation.
- Business logic, HTTP calls, and data transformations go in services.
- A component should NEVER inject `HttpClient` directly. Always use a dedicated service.

## Routing

- Define routes in each feature's own routing module.
- Use route guards for auth (`AuthGuard`) and permissions (`PermissionGuard`).
- Pass required permissions as route data:

```typescript
{
  path: 'journal-entries',
  component: JournalEntryListComponent,
  canActivate: [AuthGuard, PermissionGuard],
  data: { permission: Permission.JOURNAL_ENTRIES_READ }
}
```
