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

### TrackBy mandatory on every ngFor

```html
<!-- ✅ -->
<tr *ngFor="let entry of entries; trackBy: trackByEntryId">

<!-- ❌ -->
<tr *ngFor="let entry of entries">
```

## Observable Handling

- Prefer `async` pipe in templates over manual `subscribe()` in components.
- If `subscribe()` is necessary, always unsubscribe (use `takeUntil`, `DestroyRef`, or `Subscription`).
- NEVER leave orphan subscriptions.
