# Git Rules

## Conventional Commits in English

```bash
# ✅
feat: add journal entry approval workflow
feat: implement chart of accounts tree view
fix: validate double entry balance before saving
fix: handle 401 redirect in auth interceptor
refactor: extract account tree into separate component
style: standardize modal scss classes
docs: add API endpoint documentation
test: add unit tests for permission guard
chore: update angular to v17

# ❌
update
fix bug
changes
WIP
arreglar error
```

## Format

```
<type>: <short description in English>
```

| Type | Use |
|------|-----|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | CSS/SCSS changes, formatting (no logic change) |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Build, config, dependencies |

## Branch Naming

```bash
# ✅
feature/journal-entry-form
feature/chart-of-accounts-crud
fix/double-entry-validation
fix/sso-token-handling
refactor/extract-shared-modal

# ❌
fix1
my-branch
test
dev2
```

## Pre-Commit Checklist

Before every commit, verify:

- [ ] No `any` in the code
- [ ] No magic strings or magic numbers
- [ ] No interfaces/constants/enums defined inside components
- [ ] No inline styles or `styles: []` in decorators
- [ ] No duplicate CSS classes
- [ ] No business logic in components (must be in services)
- [ ] All variables and functions are in English
- [ ] Names are descriptive and self-documenting
- [ ] Components are under 200 lines
- [ ] Every `ngFor` has `trackBy`
- [ ] Styles use SCSS variables, not hardcoded values
- [ ] No orphan subscriptions (unsubscribed or using async pipe)
