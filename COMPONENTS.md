# Component Library Documentation

## Overview

Dunderligan uses a component-based architecture with reusable Svelte 5 components organized by function and complexity level.

## Component Organization

```
src/lib/components/
├── admin/       # Admin panel specific components
├── match/       # Match display components
├── structure/   # Layout and page structure
├── table/       # Standings and data tables
└── ui/          # Reusable UI primitives
```

## Structure Components

### PageHeader

Page title header with consistent styling.

**Props:**
- `title` (string) - Page title text

**Usage:**
```svelte
<PageHeader title="Ställningar" />
```

### PageSection

Wraps page content in a centered, max-width container.

**Props:**
- `class` (string, optional) - Additional CSS classes
- `topMargin` (boolean, default: true) - Add top margin

**Usage:**
```svelte
<PageSection>
  <p>Content here</p>
</PageSection>
```

## UI Components

### Button

Versatile button component with multiple variants.

**Props:**
- `label` (string) - Button text
- `href` (string, optional) - Link destination (renders as anchor)
- `icon` (string, optional) - Iconify icon name
- `variant` (string, optional) - Style variant (primary, secondary, etc.)
- `disabled` (boolean, optional) - Disable button
- `class` (string, optional) - Additional CSS classes

**Usage:**
```svelte
<Button 
  label="Save" 
  icon="ph:check" 
  variant="primary" 
  onclick={handleSave} 
/>
```

### Subheading

Styled subheading for section titles.

**Usage:**
```svelte
<Subheading>Kommande matcher</Subheading>
```

## Match Components

### Match

Displays a single match with teams, scores, and status.

**Props:**
- `match` - Match data object
- `division` (optional) - Division context
- `group` (optional) - Group context
- `seasonSlug` - Season identifier for links

**Features:**
- Shows team names and logos
- Displays scores (if played)
- Shows scheduled time
- Links to VOD if available
- Responsive design

**Usage:**
```svelte
<Match 
  {match} 
  {division} 
  {group} 
  seasonSlug="2024" 
/>
```

## Table Components

### Standings Table

Displays league standings with sorting and styling.

**Features:**
- Team rankings
- Win/loss/draw records
- Points and differentials
- Playoff line indicators
- Responsive columns

## Admin Components

### Form Components

Located in `src/lib/components/admin/`, these components handle CRUD operations:

- Form inputs with validation
- Data tables with edit/delete actions
- Modal dialogs for confirmations
- File upload components

## Component Patterns

### Svelte 5 Features

Components use Svelte 5's latest features:

**Runes:**
```svelte
<script>
let { data } = $props();
let count = $state(0);
let doubled = $derived(count * 2);
</script>
```

**Snippets:**
```svelte
{#snippet header(title)}
  <h2>{title}</h2>
{/snippet}

{@render header("Welcome")}
```

### Props Destructuring

```svelte
<script lang="ts">
let { 
  title, 
  subtitle = "Default", 
  ...rest 
} = $props<{
  title: string;
  subtitle?: string;
  class?: string;
}>();
</script>
```

### Event Handlers

```svelte
<Button 
  label="Click me" 
  onclick={() => {
    console.log("Clicked!");
  }} 
/>
```

## Styling

### TailwindCSS

All components use Tailwind utility classes:

```svelte
<div class="rounded-lg bg-white p-4 shadow-md">
  <h2 class="text-xl font-bold">Title</h2>
</div>
```

### Responsive Design

Use Tailwind breakpoints:

```svelte
<div class="flex flex-col sm:flex-row gap-4">
  <!-- Stacks on mobile, row on desktop -->
</div>
```

### Component Scoped Styles

When needed, use scoped `<style>` blocks:

```svelte
<style>
h1 {
  line-height: 110%;
}
</style>
```

## Best Practices

1. **Keep components focused** - Each component should have a single responsibility
2. **Use TypeScript** - Type all props and state
3. **Make components reusable** - Avoid hard-coding values
4. **Document complex props** - Add JSDoc comments for clarity
5. **Use semantic HTML** - Choose appropriate HTML elements
6. **Maintain accessibility** - Include ARIA labels where needed
7. **Optimize for performance** - Avoid unnecessary reactivity

## Creating New Components

### Template

```svelte
<script lang="ts">
/**
 * Component description
 */

// Props
let { 
  propName,
  optionalProp = "default"
} = $props<{
  propName: string;
  optionalProp?: string;
}>();

// State
let internalState = $state(0);

// Derived values
let computed = $derived(internalState * 2);

// Event handlers
function handleClick() {
  internalState++;
}
</script>

<div class="component-wrapper">
  <button onclick={handleClick}>
    {propName} - {computed}
  </button>
</div>

<style>
.component-wrapper {
  /* Scoped styles */
}
</style>
```

## Common Utilities

### cdnSrc

Helper for Cloudflare CDN URLs:

```typescript
import { cdnSrc } from '$lib/util';

const imageUrl = cdnSrc('/team-logos/logo.png');
```

### toSlug

Convert text to URL-friendly slug:

```typescript
import { toSlug } from '$lib/util';

const slug = toSlug("Team Awesome"); // "team-awesome"
```

## Icons

Uses **Iconify** for icons:

```svelte
<iconify-icon icon="ph:arrow-right"></iconify-icon>
```

Or in components:

```svelte
<Button icon="ph:check" label="Save" />
```

## Testing Components

Currently no automated component tests. Manual testing approach:

1. View component in development
2. Test different prop combinations
3. Test responsive behavior
4. Test in different browsers
5. Verify accessibility

## Future Improvements

- **Component library documentation** - Interactive Storybook or similar
- **Automated testing** - Unit tests with Vitest
- **Accessibility testing** - Automated a11y checks
- **Visual regression testing** - Screenshot comparison
- **Component playground** - Live editing and preview
