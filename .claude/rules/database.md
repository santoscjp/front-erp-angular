# Database & API Reference

## Database Schema (`c5_contabilidad`)

### emisor (tenant)
```
id, ruc, razon_social, nombre_comercial, direccion_matriz,
obligado_contabilidad, contribuyente_especial, agente_retencion,
regimen_microempresa, regimen_rimpe, source_emisor_id,
last_synced_at, is_active, created_at, updated_at
```

### role
```
id, name (ADMIN|ACCOUNTANT|ASSISTANT_ACCOUNTANT|VIEWER),
display_name, description, permissions (JSON), is_system,
created_at, updated_at
```

### user
```
id, emisor_id, role_id, email, password (NULL for SSO users),
first_name, last_name, is_active, failed_login_attempts, locked_until,
source_system (LOCAL|INVOICING), source_user_id,
two_factor_secret, two_factor_enabled, last_login_at,
created_at, updated_at
```

### cuenta_contable
```
id, codigo, nombre, tipo, naturaleza, nivel, padre_id, emisor_id, activa
```

### periodo_fiscal
```
id, emisor_id, anio, mes, estado, cerrado, fecha_cierre
```

### asiento
```
id, emisor_id, periodo_id, numero, fecha, descripcion,
tipo_origen (FACTURA|NOTA_CREDITO|RETENCION|COMPRA|MANUAL),
origen_id, estado (DRAFT|APPROVED|VOIDED), created_at, created_by_id
```

### asiento_detalle
```
id, asiento_id, cuenta_id, descripcion, debe, haber
CONSTRAINT: SUM(debe) = SUM(haber) per entry
```

### conciliacion_bancaria
```
id, emisor_id, cuenta_banco_id, periodo_id,
saldo_libro, saldo_banco, fecha, estado
```

### conciliacion_detalle
```
id, conciliacion_id, tipo_movimiento, descripcion, monto, conciliado, fecha
```

### reporte_ats
```
id, emisor_id, periodo_id, tipo, datos_xml, estado, fecha_generacion
```

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/sso?token=JWT` | SSO from invoicing system |
| POST | `/api/v1/auth/login` | Direct login `{ email, password }` |

### Sync (API Key, server-to-server — frontend does NOT call these)
| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/sync/document` |
| POST | `/api/v1/sync/withholding` |
| POST | `/api/v1/sync/purchase` |

### Protected (JWT + tenant + role)
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/v1/chart-of-accounts` | `chart_of_accounts:read` |
| POST | `/api/v1/chart-of-accounts` | `chart_of_accounts:write` |
| PUT | `/api/v1/chart-of-accounts/:id` | `chart_of_accounts:write` |
| DELETE | `/api/v1/chart-of-accounts/:id` | `chart_of_accounts:write` |
| GET | `/api/v1/journal-entries` | `journal_entries:read` |
| POST | `/api/v1/journal-entries` | `journal_entries:write` |
| PUT | `/api/v1/journal-entries/:id` | `journal_entries:write` |
| PATCH | `/api/v1/journal-entries/:id/approve` | `journal_entries:approve` |
| PATCH | `/api/v1/journal-entries/:id/void` | `journal_entries:approve` |
| GET | `/api/v1/general-ledger` | `general_ledger:read` |
| GET | `/api/v1/financial-statements/trial-balance` | `financial_statements:read` |
| GET | `/api/v1/financial-statements/balance-sheet` | `financial_statements:read` |
| GET | `/api/v1/financial-statements/income-statement` | `financial_statements:read` |
| GET | `/api/v1/fiscal-periods` | `fiscal_periods:read` |
| PATCH | `/api/v1/fiscal-periods/:id/close` | `fiscal_periods:close` |
| GET | `/api/v1/bank-reconciliation` | `bank_reconciliation:read` |
| POST | `/api/v1/bank-reconciliation` | `bank_reconciliation:write` |
| GET | `/api/v1/sri-reports/ats` | `sri_reports:read` |
| POST | `/api/v1/sri-reports/ats/generate` | `sri_reports:generate` |
| GET | `/api/v1/users` | `users:read` |
| POST | `/api/v1/users` | `users:write` |
| PUT | `/api/v1/users/:id` | `users:write` |

### API Response Format

```typescript
// Success
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error
interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

// Paginated
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Middleware Chain
```
Request → AuthMiddleware → TenantMiddleware → RoleMiddleware → Controller
```
The frontend NEVER sends `emisor_id`. The backend extracts it from the JWT.
