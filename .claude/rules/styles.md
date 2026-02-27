# Styling Rules (SCSS)

## Always Use Separate SCSS Files

Every component uses its own `.component.scss` file. NEVER use inline styles.

```typescript
// ✅
@Component({
  selector: 'app-journal-entry-list',
  templateUrl: './journal-entry-list.component.html',
  styleUrls: ['./journal-entry-list.component.scss'],
})

// ❌ styles in decorator
@Component({
  styles: [`.entry-row { padding: 10px; }`],
})

// ❌ empty styles array
@Component({
  styles: [],
})
```

## No Inline Styles in Templates

```html
<!-- ✅ -->
<div class="entry-row">...</div>

<!-- ❌ -->
<div style="padding: 10px; border: 1px solid #ccc;">...</div>

<!-- ❌ -->
<div [style.padding]="'10px'">...</div>
```

## No Duplicate CSS Classes

If two components need the same style, the class goes in global styles or a shared SCSS partial. NEVER create redundant variants.

```scss
// ❌ duplicate classes with different names
.modal { padding: 20px; border-radius: 8px; background: white; }
.modal-accounting { padding: 20px; border-radius: 8px; background: white; }
.modal-users { padding: 20px; border-radius: 8px; background: white; }

// ✅ one reusable class with BEM modifiers only when they actually differ
.modal {
  padding: 20px;
  border-radius: 8px;
  background: white;

  &--large { max-width: 800px; }
  &--small { max-width: 400px; }
}
```

## Use SCSS Variables — No Hardcoded Values

```scss
// ✅
.card__header {
  background-color: $color-primary;
  padding: $spacing-md;
  font-size: $font-size-lg;
  border-radius: $border-radius-base;
}

// ❌
.card__header {
  background-color: #2E75B6;
  padding: 16px;
  font-size: 18px;
  border-radius: 8px;
}
```

## Global SCSS Structure

```
src/styles/
├── _variables.scss              // Colors, fonts, breakpoints, spacing, border-radius
├── _mixins.scss                 // Reusable mixins (responsive, flex-center, etc.)
├── _typography.scss             // Global typographic styles
├── _reset.scss                  // Reset/normalize
├── base/
│   ├── _buttons.scss            // .btn, .btn--primary, .btn--danger, .btn--sm
│   ├── _forms.scss              // .form-group, .form-control, .form-label, .form-error
│   ├── _tables.scss             // .data-table, .data-table__header, .data-table__row
│   └── _cards.scss              // .card, .card__header, .card__body, .card__footer
├── components/
│   ├── _modal.scss              // .modal, .modal__header, .modal__body, .modal__footer
│   ├── _sidebar.scss            // .sidebar, .sidebar__nav, .sidebar__item
│   ├── _breadcrumb.scss         // .breadcrumb, .breadcrumb__item
│   └── _badge.scss              // .badge, .badge--success, .badge--warning, .badge--danger
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   └── _grid.scss
└── styles.scss                  // Main file that imports everything
```

## Naming Convention: BEM

Use Block-Element-Modifier for CSS class names:

```scss
// Block
.journal-entry-form { ... }

// Element
.journal-entry-form__header { ... }
.journal-entry-form__detail-row { ... }
.journal-entry-form__actions { ... }

// Modifier
.journal-entry-form__detail-row--error { ... }
.journal-entry-form__detail-row--readonly { ... }
```

## Component SCSS Scope

Component-specific styles go in the component's `.scss` file. Styles reused across 2+ components go in `src/styles/`.

If you find yourself writing the same CSS in two component files, move it to a shared partial in `src/styles/base/` or `src/styles/components/`.
