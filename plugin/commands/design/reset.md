---
description: Reset to original theme
allowed-tools: Read, Write
argument-hint: [confirm]
---

# 🔄 Reset Theme: $ARGUMENTS

Reset the project theme to the original configuration or remove theme customizations.

## Process

1. Check for theme backup (if exists)
2. Prompt for confirmation (unless `confirm` passed)
3. Restore original theme.json
4. Regenerate theme.css
5. Confirm reset complete

## Options

### Reset to Original
If you modified a curated theme, restore the original:
```bash
/design:reset              # Prompts for confirmation
/design:reset confirm      # Skip confirmation
```

### Reset to Default
Remove all theme customizations and use default:
```bash
/design:reset default
```

## Files Affected

- `.omgkit/design/theme.json` - Restored/reset
- `.omgkit/design/theme.css` - Regenerated

## Backup Behavior

Before any theme change, OMGKIT creates a backup:
- `.omgkit/design/theme.json.backup`

Reset will restore from this backup if available.

## Usage

```bash
/design:reset           # Interactive confirmation
/design:reset confirm   # Skip confirmation
/design:reset default   # Reset to default theme
```

## Recovery

If you accidentally reset:
1. Check git history for previous theme files
2. Use `/design:theme <id>` to apply a curated theme
3. Use `/design:builder` to recreate custom theme

## Related Commands

- `/design:theme <id>` - Apply a specific theme
- `/design:builder` - Build new custom theme
- `/design:preview` - Preview current theme
