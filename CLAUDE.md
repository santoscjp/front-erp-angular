# Contabilidad — Frontend Angular

Sistema de contabilidad SaaS para Ecuador. Microservicio independiente conectado con sistema de facturación existente (Symfony 2).

## Read All Rules First

Before writing ANY code, read and follow ALL rules in `.claude/rules/`:

- `architecture.md` — Project structure, module organization, routing
- `typescript.md` — Language, typing, naming, no `any`, no magic strings
- `clean-code.md` — Functions, components, templates, observables
- `styles.md` — SCSS files, no inline, no duplicates, BEM, variables
- `accounting.md` — Business rules, double-entry, fiscal periods, Ecuador context
- `security.md` — JWT, SSO, guards, interceptors, permissions
- `database.md` — Schema, API endpoints, response formats
- `git.md` — Conventional commits, branch naming, pre-commit checklist

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Angular |
| Backend | Express.js + TypeScript |
| Database | MySQL (`c5_contabilidad`) |
| Auth | JWT (HS256) |
| Styles | SCSS with BEM naming |

## i18n — Spanish Only, No Translations

- The app is **Spanish only**. There is no multi-language support.
- `ngx-translate` is still installed (used in 85+ files via `| translate` pipe) but locked to `es`.
- All user-facing text goes in `src/assets/i18n/es.json`. Write labels directly in Spanish.
- Do NOT create additional language files. Do NOT add language switching logic.
- When writing new components, use the `| translate` pipe with keys from `es.json` to stay consistent with existing code.

## Architecture

```
FACTURACIÓN (Symfony 2, Servidor A) ──JWT/API──► CONTABILIDAD (Express+Angular, Servidor B)
```

Two separate servers. No cross-database JOINs. All communication via REST API + JWT.

## Quick Reference

### Roles
ADMIN (all access) → ACCOUNTANT (full accounting) → ASSISTANT_ACCOUNTANT (draft only) → VIEWER (read only)

### Auth Flows
1. **SSO**: Facturación → JWT redirect → `/api/v1/auth/sso?token=...` → Angular `/dashboard?token=...`
2. **Direct login**: `/auth/login` → `POST /api/v1/auth/login` → JWT stored in localStorage

### Key Business Rules
- Double-entry: `SUM(debit) === SUM(credit)` on every journal entry
- Closed periods block all journal entry operations
- Auto-generated entries from invoicing start as DRAFT
- Frontend NEVER sends `emisor_id` — extracted from JWT in backend
- SSO users have no password and are read-only in user management
