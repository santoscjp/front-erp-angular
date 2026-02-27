# Security & Authentication Rules

## JWT Handling

- Store JWT in `localStorage` under a constant key (`AUTH_TOKEN_KEY`).
- NEVER store sensitive data beyond the token itself.
- Decode JWT client-side ONLY for UI display (user name, role, permissions). The backend is the source of truth.
- Token expiration: check before each API call. If expired, redirect to login.

## Auth Interceptor

- Every HTTP request to the API must include `Authorization: Bearer <token>` header.
- The interceptor must handle:
  - **401 Unauthorized**: Clear token, redirect to login.
  - **403 Forbidden**: Show "access denied" message, do NOT redirect.

```typescript
// auth.interceptor.ts pattern
intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  const token = this.tokenService.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) { this.authService.logout(); }
      return throwError(() => error);
    })
  );
}
```

## SSO Flow

- When Angular loads with `?token=JWT_CONTABILIDAD` in the URL:
  1. Extract the token from query params.
  2. Store it via `TokenService`.
  3. Remove the token from the URL (use `router.navigate` with `replaceUrl: true`).
  4. Navigate to `/dashboard`.
- The SSO callback component handles this. It is a route, not a guard.

## Route Guards

### AuthGuard
- Checks if a valid, non-expired token exists.
- If not → redirect to `/auth/login`.

### PermissionGuard
- Reads the required permission from `route.data.permission`.
- Checks if the user's permissions (from JWT) include it.
- If not → redirect to `/dashboard` with an error message.
- The special permission `all` (ADMIN) grants access to everything.

```typescript
// Route definition
{ path: 'journal-entries', canActivate: [AuthGuard, PermissionGuard],
  data: { permission: Permission.JOURNAL_ENTRIES_READ } }
```

## Permissions in UI

- Hide menu items the user cannot access (use `*appHasPermission` directive).
- Disable action buttons if the user lacks the write/approve permission.
- NEVER rely solely on UI hiding for security — the backend enforces permissions too.

```html
<!-- Hide menu item -->
<li *appHasPermission="Permission.JOURNAL_ENTRIES_READ">
  <a routerLink="/journal-entries">Libro Diario</a>
</li>

<!-- Disable button -->
<button [disabled]="!hasPermission(Permission.JOURNAL_ENTRIES_APPROVE)"
        (click)="onApprove(entry.id)">
  Aprobar
</button>
```

## Permission Directive

Create a structural directive `HasPermissionDirective` that:
- Injects `PermissionService`.
- Accepts a permission string.
- Shows/hides the element based on `PermissionService.hasPermission()`.
- Handles the `all` permission (ADMIN).

## User Types

| Source System | Has Password | Login Method |
|--------------|-------------|-------------|
| `LOCAL` | Yes (bcrypt) | Email + password on `/auth/login` |
| `INVOICING` | No (null) | SSO redirect from facturación only |

- SSO users (`source_system = 'INVOICING'`) are read-only in the user management UI.
- Only `LOCAL` users can change their password.
