# Accounting & Business Rules

## Multi-Tenancy

- Every entity is scoped by `emisor_id` (the tenant).
- The frontend NEVER sends `emisor_id`. It is extracted from the JWT in the backend.
- The UI shows the emisor name and RUC in the header/sidebar for context.
- A user NEVER sees data from another emisor.

## Double-Entry Accounting (Partida Doble)

- Every journal entry MUST satisfy: `SUM(debit) === SUM(credit)`.
- The form must validate this in real-time before allowing save.
- Use a tolerance constant (`BALANCE_TOLERANCE = 0.01`) for floating-point comparison.
- Display the difference clearly when the entry is unbalanced.

## Journal Entry Workflow

```
DRAFT → APPROVED → VOIDED
```

- **DRAFT**: Created by users or auto-generated from invoicing sync. Editable.
- **APPROVED**: Locked. Only users with `journal_entries:approve` permission can approve.
- **VOIDED**: Cancelled. Cannot be edited or re-approved. A reversing entry should be created instead.
- Auto-generated entries from invoicing always start as DRAFT for the accountant to review.

## Fiscal Periods

- A closed period does NOT allow creating, editing, or approving journal entries.
- The UI must check period status before showing action buttons.
- Only users with `fiscal_periods:close` permission can close a period.

## Chart of Accounts (Plan de Cuentas)

- Hierarchical tree structure based on Ecuador's Superintendencia de Compañías.
- Top-level categories: 1 (Activo), 2 (Pasivo), 3 (Patrimonio), 4 (Ingresos), 5 (Gastos).
- Code format: `1.01` (Activo Corriente), `1.01.01` (Efectivo), etc.
- Only leaf accounts (lowest level) can be used in journal entry details.
- Parent accounts show aggregated balances from their children.

## Automatic Journal Entry Templates

| Source Document | Debit | Credit |
|----------------|-------|--------|
| Sales Invoice (Factura) | Accounts Receivable | Sales Revenue + VAT Payable |
| Credit Note (Nota de Crédito) | Reverse of invoice | Reverse of invoice |
| Withholding Received (Retención) | Prepaid Income Tax / VAT | Accounts Receivable |
| Purchase (Compra) | Inventory/Expense + VAT Credit | Accounts Payable |

## ATS (Anexo Transaccional Simplificado)

- Mandatory monthly report for Ecuador's SRI (tax authority).
- Crosses purchase and sales data.
- Generated as XML in the specific format required by SRI.
- The UI should show a preview of the data before generating the XML.

## Currency

- All amounts are in USD (Ecuador's official currency).
- Display format: `$1,234.56` (US format, since Ecuador uses USD).
- Store amounts as numbers with 2 decimal places.

## Source Document Types

```typescript
export enum DocumentType {
  INVOICE = 'FACTURA',
  CREDIT_NOTE = 'NOTA_CREDITO',
  DEBIT_NOTE = 'NOTA_DEBITO',
  WITHHOLDING = 'RETENCION',
  PURCHASE = 'COMPRA',
  SETTLEMENT = 'LIQUIDACION',
  WAYBILL = 'GUIA',
  MANUAL = 'MANUAL',
}
```
