# Clean Code Rules

## Descriptive, Self-Documenting Names

Code must be understandable without comments. If a comment is needed to explain what a variable or function does, the name is bad.

```typescript
// ✅
const pendingApprovalEntries = entries.filter(e => e.status === JournalEntryStatus.DRAFT);
const isCurrentPeriodClosed = currentPeriod.status === FiscalPeriodStatus.CLOSED;
function calculateAccountBalance(accountId: number, periodId: number): Observable<AccountBalance> {}

// ❌
const data = entries.filter(e => e.status === 'B');
const flag = currentPeriod.status === 'C';
function calc(id: number, pid: number): Observable<any> {}
```

## Short Functions, Single Responsibility

A function does ONE thing. If you need "and" to describe it, split it.

```typescript
// ✅
function validateDoubleEntry(details: JournalEntryDetail[]): boolean {
  const totalDebit = calculateTotalDebit(details);
  const totalCredit = calculateTotalCredit(details);
  return Math.abs(totalDebit - totalCredit) < BALANCE_TOLERANCE;
}

function calculateTotalDebit(details: JournalEntryDetail[]): number {
  return details.reduce((sum, d) => sum + d.debit, 0);
}

function calculateTotalCredit(details: JournalEntryDetail[]): number {
  return details.reduce((sum, d) => sum + d.credit, 0);
}
```

## Early Return — Avoid Nesting

```typescript
// ✅
function approveEntry(entry: JournalEntry): void {
  if (!entry) return;
  if (entry.status !== JournalEntryStatus.DRAFT) return;
  if (!this.hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)) return;

  this.journalEntryService.approve(entry.id).subscribe();
}

// ❌
function approveEntry(entry: JournalEntry): void {
  if (entry) {
    if (entry.status === JournalEntryStatus.DRAFT) {
      if (this.hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)) {
        this.journalEntryService.approve(entry.id).subscribe();
      }
    }
  }
}
```

## Components Under 200 Lines

If a component exceeds 200 lines of TypeScript, extract sub-components.

```
// ✅ focused components
journal-entry-list.component.ts          // List with filters and pagination
journal-entry-form.component.ts          // Create/edit form
journal-entry-detail-row.component.ts    // Individual debit/credit row
journal-entry-status-badge.component.ts  // Status badge

// ❌ monolithic
journal-entry.component.ts              // 800 lines doing everything
```

## Business Logic in Services, NEVER in Components

Components handle the view only. HTTP calls, data transformations, and business rules go in services.

```typescript
// ✅ thin component
export class JournalEntryListComponent implements OnInit {
  entries$: Observable<JournalEntry[]>;
  constructor(private journalEntryService: JournalEntryService) {}
  ngOnInit(): void { this.entries$ = this.journalEntryService.getAll(); }
  onApprove(id: number): void { this.journalEntryService.approve(id).subscribe(); }
}

// ❌ fat component with HTTP and logic
export class JournalEntryListComponent {
  onApprove(id: number): void {
    this.http.patch(`/api/v1/journal-entries/${id}/approve`, {}).subscribe(
      response => { /* data manipulation, notifications, redirects here */ }
    );
  }
}
```

## Template Rules

### Use new Angular control flow syntax — NEVER the old structural directives

Angular 17+ introduced built-in control flow (`@if`, `@for`, `@switch`). Always use the new syntax. The old `*ngIf`, `*ngFor`, `*ngSwitch` directives are **forbidden** in new code.

#### Conditionals

```html
<!-- ✅ new syntax -->
@if (entry.status === JournalEntryStatus.APPROVED) {
  <span class="badge badge--success">{{ 'STATUS.APPROVED' | translate }}</span>
} @else if (entry.status === JournalEntryStatus.DRAFT) {
  <span class="badge badge--warning">{{ 'STATUS.DRAFT' | translate }}</span>
} @else {
  <span class="badge badge--danger">{{ 'STATUS.VOIDED' | translate }}</span>
}

<!-- ❌ old syntax — forbidden -->
<span *ngIf="entry.status === 'APPROVED'" class="badge badge--success">Aprobado</span>
<ng-container *ngIf="isLoading; else content">...</ng-container>
```

#### Lists

```html
<!-- ✅ new syntax — track is mandatory (replaces trackBy) -->
@for (entry of entries; track entry.id) {
  <tr class="entry-row">
    <td>{{ entry.date | date }}</td>
    <td>{{ entry.description }}</td>
  </tr>
} @empty {
  <tr><td colspan="5">{{ 'JOURNAL_ENTRIES.EMPTY' | translate }}</td></tr>
}

<!-- ❌ old syntax — forbidden -->
<tr *ngFor="let entry of entries; trackBy: trackById">...</tr>
```

#### Switch / multi-branch

```html
<!-- ✅ new syntax -->
@switch (entry.status) {
  @case (JournalEntryStatus.DRAFT)    { <span class="badge badge--warning">Borrador</span> }
  @case (JournalEntryStatus.APPROVED) { <span class="badge badge--success">Aprobado</span> }
  @case (JournalEntryStatus.VOIDED)   { <span class="badge badge--danger">Anulado</span> }
}

<!-- ❌ old syntax — forbidden -->
<ng-container [ngSwitch]="entry.status">
  <span *ngSwitchCase="'DRAFT'">Borrador</span>
</ng-container>
```

#### Deferred loading (use for heavy components)

```html
<!-- ✅ defer heavy tables/charts until visible -->
@defer (on viewport) {
  <app-general-ledger-table [entries]="entries" />
} @placeholder {
  <div class="skeleton-loader"></div>
}
```

### No complex logic in templates

```html
<!-- ✅ logic in component -->
<span [ngClass]="getStatusClass(entry.status)">
  {{ getStatusLabel(entry.status) }}
</span>

<!-- ❌ logic in template -->
<span [ngClass]="{'badge--success': entry.status === 'APPROVED', 'badge--warning': entry.status === 'DRAFT'}">
  {{ entry.status === 'APPROVED' ? 'Aprobado' : entry.status === 'DRAFT' ? 'Borrador' : 'Anulado' }}
</span>
```

## Observable Handling

- Prefer `async` pipe in templates over manual `subscribe()` in components.
- If `subscribe()` is necessary, always unsubscribe (use `takeUntil`, `DestroyRef`, or `Subscription`).
- NEVER leave orphan subscriptions.

---

## Reusable Code (DRY — Don't Repeat Yourself)

If a piece of logic, component, or utility is used in more than one place, extract it.

- **Repeated UI pattern** → create a component in `shared/components/`
- **Repeated logic** → create a utility function in `shared/utils/` or move to a service
- **Repeated type/interface** → define once in `shared/interfaces/`
- **Repeated style** → move to `src/styles/` partial

```typescript
// ✅ Reusable utility extracted to shared/utils/currency.utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// ✅ Used in multiple components and services
import { formatCurrency } from '@shared/utils/currency.utils';

// ❌ Same logic duplicated in 3 different components
// journal-entry-list.component.ts
formatAmount(value: number) { return '$' + value.toFixed(2); }

// general-ledger.component.ts
displayAmount(n: number) { return '$' + n.toFixed(2); }
```

When writing new code, always ask: **"Does this already exist somewhere?"** Check `shared/` before writing anything new.

---

## Readable Code

Code is read far more often than it is written. Optimize for the reader.

### One concept per line

```typescript
// ✅ clear, one step at a time
const activeAccounts = accounts.filter(account => account.isActive);
const sortedAccounts = activeAccounts.sort((a, b) => a.code.localeCompare(b.code));
const accountOptions = sortedAccounts.map(account => ({ label: account.name, value: account.id }));

// ❌ compressed, hard to read and debug
const accountOptions = accounts.filter(a => a.isActive).sort((a,b) => a.code.localeCompare(b.code)).map(a => ({label:a.name,value:a.id}));
```

### Avoid abbreviations

```typescript
// ✅
const accountBalance = calculateBalance(accountId);
const journalEntryDetails = entry.details;
const isPermissionGranted = this.permissionService.hasPermission(permission);

// ❌
const bal = calcBal(accId);
const dets = entry.dets;
const perm = this.ps.hasPerm(p);
```

### Boolean variables read as questions

```typescript
// ✅ reads like a sentence
const isFormValid = this.form.valid;
const hasPendingChanges = this.form.dirty;
const canApproveEntry = this.hasPermission(Permission.JOURNAL_ENTRIES_APPROVE);

// ❌
const valid = this.form.valid;
const changed = this.form.dirty;
const approve = this.hasPermission(Permission.JOURNAL_ENTRIES_APPROVE);
```

### Keep related code together

Group imports, then constants, then properties, then lifecycle hooks, then public methods, then private methods. Consistent ordering makes files predictable.

```typescript
// ✅ consistent class structure
export class JournalEntryListComponent implements OnInit, OnDestroy {
  // 1. Inputs / Outputs
  @Input() periodId!: number;

  // 2. Public observable properties
  entries$!: Observable<JournalEntry[]>;

  // 3. Private state
  private readonly destroy$ = new Subject<void>();

  // 4. Constructor
  constructor(private journalEntryService: JournalEntryService) {}

  // 5. Lifecycle hooks
  ngOnInit(): void { ... }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  // 6. Public event handlers
  onApprove(id: number): void { ... }
  onVoid(id: number): void { ... }

  // 7. Private helpers
  private loadEntries(): void { ... }
}
```

---

## Best Practices

### SOLID principles (applied to Angular)

- **S** — Single Responsibility: one component/service = one purpose.
- **O** — Open/Closed: extend behavior via new components or services; do not modify stable, shared code.
- **L** — Liskov: services should fulfill the contract of their interface.
- **I** — Interface Segregation: keep interfaces focused; do not create a single `ApiResponse` interface that covers every possible shape.
- **D** — Dependency Inversion: depend on abstractions (interfaces, service tokens), not concrete implementations.

### Fail fast and be explicit about errors

```typescript
// ✅ explicit error handling
this.journalEntryService.approve(id).pipe(
  takeUntil(this.destroy$)
).subscribe({
  next: () => this.toastService.success('JOURNAL_ENTRIES.APPROVED'),
  error: (err: HttpErrorResponse) => this.toastService.error('ERRORS.GENERIC'),
});

// ❌ silent failure
this.journalEntryService.approve(id).subscribe();
```

### Immutability — never mutate input data

```typescript
// ✅ return new object, do not mutate
function applyDiscount(entry: JournalEntry, discount: number): JournalEntry {
  return { ...entry, total: entry.total - discount };
}

// ❌ mutating the input
function applyDiscount(entry: JournalEntry, discount: number): void {
  entry.total -= discount;
}
```

### Avoid boolean parameters — use named options or enums

```typescript
// ✅ intention is clear
loadEntries(mode: LoadMode.DRAFT_ONLY | LoadMode.ALL): void { ... }

// ❌ what does `true` mean here?
loadEntries(true);
```
