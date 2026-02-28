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
assets/scss/
/─--pages/           # Page-specific styles (e.g. dashboard.scss)
/─--components/      # Styles for reusable components (e.g. _modal./
/---structure/       # Layout and grid system (e.g. _grid.scss)
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

---

## Responsive Design — Mandatory for Every New UI Element

Every new component or page MUST work correctly on mobile, tablet, and desktop. Design mobile-first: write base styles for small screens, then override with breakpoint mixins for larger ones.

### Breakpoints (use SCSS variables — never hardcode px values)

```scss
// _breakpoints.scss (reference only — use the mixins below)
$breakpoint-sm:  576px;   // small devices (landscape phones)
$breakpoint-md:  768px;   // medium devices (tablets)
$breakpoint-lg:  992px;   // large devices (desktops)
$breakpoint-xl:  1200px;  // extra large (wide desktops)
```

### Mobile-first approach

```scss
// ✅ Mobile-first: base styles for mobile, scale up
.journal-entry-form {
  display: flex;
  flex-direction: column;   // stacked on mobile
  gap: $spacing-md;

  @media (min-width: $breakpoint-md) {
    flex-direction: row;    // side-by-side on tablet+
  }
}

.journal-entry-form__detail-row {
  grid-template-columns: 1fr;  // single column on mobile

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: 3fr 1fr 1fr 1fr auto;  // full table layout on desktop
  }
}

// ❌ Desktop-first with max-width overrides (avoid)
.journal-entry-form {
  flex-direction: row;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}
```

### Tables — always responsive

Tables must never overflow horizontally. Wrap them or transform to card layout on small screens.

```html
<!-- ✅ always wrap tables -->
<div class="table-responsive">
  <table class="table">...</table>
</div>
```

```scss
// ✅ or transform to card layout on mobile
.data-table {
  @media (max-width: $breakpoint-md) {
    display: block;

    thead { display: none; }  // hide headers
    tr { display: flex; flex-direction: column; margin-bottom: $spacing-md; }
    td::before { content: attr(data-label); font-weight: bold; }
  }
}
```

### Touch targets — minimum 44×44px

```scss
// ✅ touch-friendly buttons and links
.btn,
.action-link {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Responsive checklist (required before every commit)

- [ ] Tested at 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] No horizontal scroll on any breakpoint
- [ ] Tables wrapped or converted to card layout on mobile
- [ ] Touch targets are at least 44×44px
- [ ] Font sizes remain readable (min 14px body, 12px secondary)
- [ ] Modals/dialogs do not overflow on small screens
