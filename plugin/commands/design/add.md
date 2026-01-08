---
description: Add shadcn/ui components to the project
allowed-tools: Bash, Read, Write
argument-hint: <components...>
---

# ➕ Add Components: $ARGUMENTS

Add shadcn/ui components to the project. Components will use your OMGKIT theme's CSS variables.

## Prerequisites

1. Theme configured (run `/design:theme <id>` first)
2. shadcn/ui initialized (or will guide through setup)

## Process

1. Check if shadcn is initialized
2. If not, guide through `npx shadcn@latest init`
3. Verify theme CSS variables are in place
4. Run `npx shadcn@latest add <components>`
5. Components automatically use theme colors

## Common Components

**Layout:**
- `card` - Content cards
- `separator` - Visual dividers
- `skeleton` - Loading states

**Forms:**
- `button` - Primary buttons
- `input` - Text inputs
- `textarea` - Multi-line inputs
- `select` - Dropdowns
- `checkbox` - Checkboxes
- `radio-group` - Radio buttons
- `switch` - Toggle switches
- `form` - Form with validation

**Feedback:**
- `alert` - Alert messages
- `alert-dialog` - Confirmation dialogs
- `toast` - Toast notifications
- `progress` - Progress bars

**Navigation:**
- `tabs` - Tab navigation
- `dropdown-menu` - Dropdown menus
- `navigation-menu` - Nav menus
- `breadcrumb` - Breadcrumbs

**Data Display:**
- `table` - Data tables
- `badge` - Status badges
- `avatar` - User avatars

**Overlays:**
- `dialog` - Modal dialogs
- `sheet` - Slide-out panels
- `popover` - Popovers
- `tooltip` - Tooltips

## Usage

```bash
/design:add button card input          # Add specific components
/design:add form dialog toast          # Add multiple components
/design:add --all                      # Add all available components
```

## Integration

Components will be created in `components/ui/` and will automatically use your theme's CSS variables:

```tsx
// Example: Button uses --primary from your theme
<Button>Click me</Button>  // Uses theme.css --primary color
```

## Troubleshooting

If components don't reflect theme colors:
1. Ensure theme.css is imported in globals.css
2. Check Tailwind config extends theme colors
3. Run `/design:preview` to verify theme is applied
