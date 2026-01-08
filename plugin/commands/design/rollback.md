---
name: rollback
description: Rollback to a previous theme state from backup
usage: /design:rollback [backup-id]
args:
  - name: backup-id
    required: false
    description: Specific backup ID to restore (defaults to most recent)
---

# Design Rollback

Restore project to a previous theme state from backup. Created automatically when using `/design:rebuild`.

## What This Command Does

1. **Finds Backup**
   - Defaults to most recent backup
   - Or uses specified backup ID

2. **Creates Safety Backup**
   - Backs up current state before rollback
   - Allows re-rollback if needed

3. **Restores Files**
   - `.omgkit/design/theme.json`
   - `.omgkit/design/theme.css`
   - `tailwind.config.ts` (if backed up)
   - Any component files modified during rebuild

## Usage Examples

### Rollback to Latest Backup
```bash
/design:rollback
```

### Rollback to Specific Backup
```bash
/design:rollback 2024-01-08T14-30-00-neo-tokyo
```

### List Available Backups First
```bash
omgkit design:backups
```

## Example Output

```
🔄 Theme Rollback

✓ Rolled back to: minimal-slate

Restored Files:
  ✓ .omgkit/design/theme.json
  ✓ .omgkit/design/theme.css
  ✓ tailwind.config.ts

Backup used: 2024-01-08T14-30-00-neo-tokyo
```

## Backup Structure

Backups are stored in `.omgkit/design/backups/`:

```
.omgkit/design/backups/
├── 2024-01-08T14-30-00-neo-tokyo/
│   ├── manifest.json       # Backup metadata
│   ├── theme.json.bak      # Previous theme config
│   ├── theme.css.bak       # Previous CSS variables
│   └── tailwind.config.ts.bak  # Previous Tailwind config
│
└── 2024-01-07T10-15-00-minimal-slate/
    ├── manifest.json
    ├── theme.json.bak
    └── ...
```

### Manifest Format

```json
{
  "id": "2024-01-08T14-30-00-neo-tokyo",
  "previousTheme": "minimal-slate",
  "newTheme": "neo-tokyo",
  "timestamp": "2024-01-08T14:30:00.000Z",
  "changedFiles": [
    { "path": ".omgkit/design/theme.json", "backup": "theme.json.bak" },
    { "path": ".omgkit/design/theme.css", "backup": "theme.css.bak" },
    { "path": "tailwind.config.ts", "backup": "tailwind.config.ts.bak" }
  ]
}
```

## CLI Commands

```bash
# Rollback to latest
omgkit design:rollback

# Rollback to specific backup
omgkit design:rollback 2024-01-08T14-30-00-neo-tokyo

# List available backups
omgkit design:backups
```

## Listing Backups

To see available backups:

```bash
omgkit design:backups
```

Output:
```
📦 Theme Backups

  2024-01-08T14-30-00-neo-tokyo
    minimal-slate → neo-tokyo
    1/8/2024, 2:30:00 PM (3 files)

  2024-01-07T10-15-00-minimal-slate
    ocean-blue → minimal-slate
    1/7/2024, 10:15:00 AM (3 files)

To rollback: omgkit design:rollback
Or specify: omgkit design:rollback <backup-id>
```

## Safety Features

1. **Auto-backup before rollback**: Creates new backup before restoring
2. **Backup preservation**: Original backups are never deleted
3. **Chain rollback**: Can rollback from a rollback
4. **Partial restore**: Only restores files that were backed up

## When to Use Rollback

- Theme rebuild caused visual issues
- Want to return to previous color scheme
- Testing different themes
- Accidentally applied wrong theme

## Limitations

- Only restores files that were modified during rebuild
- Component color replacements are not reversed (would need manual fix)
- Requires existing backup

## Error Handling

### No Backups Found
```
✗ No theme backups found
ℹ No backups available. Rebuild a theme first to create backups.
```

### Backup Not Found
```
✗ Backup not found: invalid-backup-id
```

## Related Commands

- `/design:rebuild <theme-id>` - Apply new theme (creates backup)
- `/design:scan` - Scan for non-compliant colors
- `/design:themes` - List available themes
- `/design:preview` - Preview current theme

## Best Practices

1. **Test before committing**: Always test after theme rebuild
2. **Keep backups**: Don't delete `.omgkit/design/backups/`
3. **Use dry-run**: Preview changes with `/design:rebuild <theme> --dry`
4. **Git backup**: Commit before rebuilding for additional safety
