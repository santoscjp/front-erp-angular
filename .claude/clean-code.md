# Reglas de Desarrollo

> Claude Code DEBE leer y aplicar TODAS estas reglas antes de escribir cualquier código.

---

## 1. Idioma del Código: Inglés

Todo en inglés: variables, funciones, clases, interfaces, enums, constantes, nombres de archivos, comentarios.

```typescript
// ✅
const invoiceTotal = 112.5
function calculateTrialBalance() {}

// ❌
const totalFactura = 112.5
function calcularBalanceComprobacion() {}
```

Excepción: textos visibles al usuario van en español (labels, mensajes, placeholders). Nunca hardcodeados en templates, siempre en constantes dedicadas.

---

## 2. No Magic Strings ni Magic Numbers

Todo valor literal con significado va en constante o enum. Aplica en TypeScript Y en templates HTML.

```typescript
// ✅
if (entry.status === JournalEntryStatus.APPROVED) { ... }

// ❌
if (entry.status === 'APPROVED') { ... }
```

```html
<!-- ✅ -->
<button *ngIf="hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)">Aprobar</button>

<!-- ❌ -->
<button *ngIf="hasPermission('journal_entries:approve')">Aprobar</button>
```

---

## 3. No `any`

Prohibido en todo el proyecto. Cada variable, parámetro y retorno tiene tipo explícito. Si no se conoce el tipo, usar `unknown` con type narrowing.

```typescript
// ✅
function getAccounts(filters: AccountFilter): Observable<Account[]> {}

// ❌
function getAccounts(filters: any): Observable<any> {}
```

tsconfig.json obligatorio:

```json
{ "compilerOptions": { "strict": true, "noImplicitAny": true } }
```

---

## 4. Interfaces, Enums y Types en Archivos Propios

NUNCA definir dentro de componentes o servicios. Una interfaz/enum por archivo.

```
src/app/shared/
├── interfaces/
│   ├── account.interface.ts
│   ├── journal-entry.interface.ts
│   └── api-response.interface.ts
├── enums/
│   ├── document-type.enum.ts
│   └── journal-entry-status.enum.ts
└── types/
    └── form-mode.type.ts
```

```typescript
// ✅ archivo propio: shared/interfaces/journal-entry.interface.ts
export interface JournalEntry {
  id: number;
  status: JournalEntryStatus;
  details: JournalEntryDetail[];
}

// ❌ dentro del componente
@Component({ ... })
export class JournalEntryListComponent {
  interface JournalEntry { ... } // PROHIBIDO
}
```

---

## 5. Constantes en Archivos Propios

NUNCA dentro de componentes o servicios. Van en `shared/constants/`.

```typescript
// ✅ shared/constants/api-endpoints.constants.ts
export const ApiEndpoints = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    SSO: '/api/v1/auth/sso',
  },
  CHART_OF_ACCOUNTS: '/api/v1/chart-of-accounts',
  JOURNAL_ENTRIES: '/api/v1/journal-entries',
} as const

// ✅ shared/constants/permissions.constants.ts
export const Permission = {
  CHART_OF_ACCOUNTS_READ: 'chart_of_accounts:read',
  CHART_OF_ACCOUNTS_WRITE: 'chart_of_accounts:write',
  JOURNAL_ENTRIES_APPROVE: 'journal_entries:approve',
  ALL: 'all',
} as const
```

```typescript
// ❌ dentro de un componente
@Component({ ... })
export class SidebarComponent {
  private readonly API_URL = '/api/v1/journal-entries'; // PROHIBIDO
}
```

---

## 6. Estilos

### 6.1 Siempre en archivos SCSS separados

```typescript
// ✅
@Component({
  styleUrls: ['./journal-entry-list.component.scss'],
})

// ❌ estilos en el decorador
@Component({
  styles: [`.entry-row { padding: 10px; }`],
})
```

### 6.2 No estilos inline

```html
<!-- ✅ -->
<div class="entry-row">...</div>

<!-- ❌ -->
<div style="padding: 10px; border: 1px solid #ccc;">...</div>
```

### 6.3 No duplicar clases CSS

```scss
// ❌ clases duplicadas
.modal {
  padding: 20px;
  border-radius: 8px;
  background: white;
}
.modal-accounting {
  padding: 20px;
  border-radius: 8px;
  background: white;
}

// ✅ una sola clase, variantes solo si difieren
.modal {
  padding: 20px;
  border-radius: 8px;
  background: white;
  &--large {
    max-width: 800px;
  }
  &--small {
    max-width: 400px;
  }
}
```

### 6.4 Usar variables SCSS

```scss
// ✅
.card__header {
  background-color: $color-primary;
  padding: $spacing-md;
}

// ❌ valores hardcodeados
.card__header {
  background-color: #2e75b6;
  padding: 16px;
}
```

### 6.5 Estructura SCSS global

```
src/styles/
├── _variables.scss
├── _mixins.scss
├── _typography.scss
├── _reset.scss
├── base/
│   ├── _buttons.scss
│   ├── _forms.scss
│   ├── _tables.scss
│   └── _cards.scss
├── components/
│   ├── _modal.scss
│   ├── _sidebar.scss
│   ├── _breadcrumb.scss
│   └── _badge.scss
├── layout/
│   ├── _header.scss
│   └── _grid.scss
└── styles.scss
```

---

## 7. Clean Code

### Nombres descriptivos — el código se entiende sin comentarios

```typescript
// ✅
const pendingApprovalEntries = entries.filter((e) => e.status === JournalEntryStatus.DRAFT)

// ❌
const data = entries.filter((e) => e.status === 'B')
```

### Funciones cortas, responsabilidad única

```typescript
// ✅ cada función hace UNA cosa
function validateDoubleEntry(details: JournalEntryDetail[]): boolean {
  const totalDebit = calculateTotalDebit(details)
  const totalCredit = calculateTotalCredit(details)
  return Math.abs(totalDebit - totalCredit) < BALANCE_TOLERANCE
}
```

### Early return — evitar nesting

```typescript
// ✅
function approveEntry(entry: JournalEntry): void {
  if (!entry) return
  if (entry.status !== JournalEntryStatus.DRAFT) return
  if (!this.hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)) return
  this.journalEntryService.approve(entry.id).subscribe()
}

// ❌ nesting innecesario
function approveEntry(entry: JournalEntry): void {
  if (entry) {
    if (entry.status === JournalEntryStatus.DRAFT) {
      if (this.hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)) {
        this.journalEntryService.approve(entry.id).subscribe()
      }
    }
  }
}
```

### Componentes < 200 líneas de TypeScript

Si crece más, extraer sub-componentes.

### Lógica de negocio en servicios, NUNCA en componentes

```typescript
// ✅ componente delgado
export class JournalEntryListComponent {
  entries$ = this.journalEntryService.getAll()
  onApprove(id: number): void {
    this.journalEntryService.approve(id).subscribe()
  }
}

// ❌ HTTP y lógica en el componente
export class JournalEntryListComponent {
  onApprove(id: number): void {
    this.http.patch(`/api/v1/journal-entries/${id}/approve`, {}).subscribe()
  }
}
```

---

## 8. Templates HTML

### No lógica compleja en templates

```html
<!-- ✅ lógica en el componente -->
<span [ngClass]="getStatusClass(entry.status)"> {{ getStatusLabel(entry.status) }} </span>

<!-- ❌ lógica en el template -->
<span [ngClass]="{'badge--success': entry.status === 'APPROVED', 'badge--warning': entry.status === 'DRAFT'}"> {{ entry.status === 'APPROVED' ? 'Aprobado' : 'Borrador' }} </span>
```

### TrackBy obligatorio en ngFor

```html
<!-- ✅ -->
<tr *ngFor="let entry of entries; trackBy: trackByEntryId">
  <!-- ❌ -->
</tr>

<tr *ngFor="let entry of entries"></tr>
```

---

## 9. Nombres de Archivos

Todo en kebab-case. PascalCase para clases. camelCase para variables y funciones.

| Tipo        | Patrón                | Ejemplo                           |
| ----------- | --------------------- | --------------------------------- |
| Componente  | `name.component.ts`   | `journal-entry-list.component.ts` |
| Servicio    | `name.service.ts`     | `chart-of-accounts.service.ts`    |
| Interfaz    | `name.interface.ts`   | `journal-entry.interface.ts`      |
| Enum        | `name.enum.ts`        | `document-type.enum.ts`           |
| Constante   | `name.constants.ts`   | `permissions.constants.ts`        |
| Guard       | `name.guard.ts`       | `permission.guard.ts`             |
| Interceptor | `name.interceptor.ts` | `auth.interceptor.ts`             |
| Pipe        | `name.pipe.ts`        | `currency-ec.pipe.ts`             |
| Directiva   | `name.directive.ts`   | `has-permission.directive.ts`     |

---

## 10. Git Commits

Conventional Commits en inglés:

```bash
# ✅
feat: add journal entry approval workflow
fix: validate double entry before saving
refactor: extract account tree into separate component

# ❌
update
fix bug
cambios
```

---

## Checklist Pre-Commit

- [ ] No `any`
- [ ] No magic strings/numbers
- [ ] No interfaces/constantes/enums dentro de componentes
- [ ] No estilos inline ni `styles: []`
- [ ] No clases CSS duplicadas
- [ ] No lógica de negocio en componentes
- [ ] Variables y funciones en inglés
- [ ] Nombres descriptivos
- [ ] Componentes < 200 líneas
- [ ] Cada `ngFor` tiene `trackBy`
- [ ] Estilos usan variables SCSS
