# TypeScript Rules

## Language: English Only

All code is written in English: variables, functions, classes, interfaces, enums, constants, file names, and technical comments.

```typescript
// ✅
const invoiceTotal = 112.50;
const isAccountingPeriodClosed = true;
function calculateTrialBalance() {}

// ❌
const totalFactura = 112.50;
const estaCerradoPeriodo = true;
function calcularBalanceComprobacion() {}
```

Exception: User-facing text (labels, messages, placeholders) is in Spanish. These go in dedicated constant files, never hardcoded in templates.

## No `any`

Prohibited everywhere. Every variable, parameter, and return type must be explicitly typed.

```typescript
// ✅
function getAccounts(filters: AccountFilter): Observable<Account[]> {}
const response: ApiResponse<JournalEntry> = await this.http.get<ApiResponse<JournalEntry>>(url);

// ❌
function getAccounts(filters: any): Observable<any> {}
const response: any = await this.http.get(url);
```

If the type is truly unknown, use `unknown` with type narrowing:

```typescript
function handleError(error: unknown): void {
  if (error instanceof HttpErrorResponse) { ... }
}
```

tsconfig.json must include:
```json
{ "compilerOptions": { "strict": true, "noImplicitAny": true } }
```

## No Magic Strings or Magic Numbers

Every literal with business meaning goes in a constant or enum. This applies in TypeScript AND in HTML templates.

```typescript
// ✅
if (entry.status === JournalEntryStatus.APPROVED) { ... }
if (retryCount > MAX_RETRY_ATTEMPTS) { ... }

// ❌
if (entry.status === 'APPROVED') { ... }
if (retryCount > 3) { ... }
```

```html
<!-- ✅ -->
<button *ngIf="hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)">Aprobar</button>

<!-- ❌ -->
<button *ngIf="hasPermission('journal_entries:approve')">Aprobar</button>
```

## Interfaces, Enums, and Types in Dedicated Files

NEVER define inside components or services. One interface/enum per file.

```
shared/interfaces/journal-entry.interface.ts
shared/enums/journal-entry-status.enum.ts
shared/types/form-mode.type.ts
```

```typescript
// ✅ shared/interfaces/journal-entry.interface.ts
export interface JournalEntry {
  id: number;
  status: JournalEntryStatus;
  details: JournalEntryDetail[];
}

// ❌ inside a component
@Component({ ... })
export class JournalEntryListComponent {
  interface JournalEntry { ... }  // FORBIDDEN
}
```

## Constants in Dedicated Files

NEVER inside components or services. Go in `shared/constants/`.

```typescript
// ✅ shared/constants/api-endpoints.constants.ts
export const ApiEndpoints = {
  AUTH: { LOGIN: '/api/v1/auth/login', SSO: '/api/v1/auth/sso' },
  CHART_OF_ACCOUNTS: '/api/v1/chart-of-accounts',
  JOURNAL_ENTRIES: '/api/v1/journal-entries',
} as const;

// ❌ inside a component
@Component({ ... })
export class SidebarComponent {
  private readonly API_URL = '/api/v1/journal-entries';  // FORBIDDEN
}
```

## Naming Conventions

- Files: `kebab-case` → `journal-entry-list.component.ts`
- Classes: `PascalCase` → `JournalEntryListComponent`
- Variables/functions: `camelCase` → `calculateTrialBalance()`
- Constants: `PascalCase` object with `as const` → `Permission.JOURNAL_ENTRIES_READ`
- Enums: `PascalCase` → `JournalEntryStatus.APPROVED`

| Type | File Pattern | Example |
|------|-------------|---------|
| Component | `name.component.ts` | `journal-entry-list.component.ts` |
| Service | `name.service.ts` | `chart-of-accounts.service.ts` |
| Interface | `name.interface.ts` | `journal-entry.interface.ts` |
| Enum | `name.enum.ts` | `document-type.enum.ts` |
| Constant | `name.constants.ts` | `permissions.constants.ts` |
| Guard | `name.guard.ts` | `permission.guard.ts` |
| Interceptor | `name.interceptor.ts` | `auth.interceptor.ts` |
| Pipe | `name.pipe.ts` | `currency-ec.pipe.ts` |
| Directive | `name.directive.ts` | `has-permission.directive.ts` |
