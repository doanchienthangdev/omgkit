# Contributing to OMGKIT

Thank you for your interest in contributing to OMGKIT!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/doanchienthangdev/omgkit.git
cd omgkit

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Link for local development
npm link
```

## Versioning

OMGKIT follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

### Release Process

#### Option 1: Manual Version Bump (GitHub Actions)

1. Go to **Actions** → **Version Bump**
2. Click **Run workflow**
3. Select version type: `patch`, `minor`, or `major`
4. The workflow will:
   - Run tests
   - Bump version in package.json
   - Create git tag
   - Push changes
   - Trigger release workflow

#### Option 2: Manual Release

```bash
# Bump version (creates tag automatically)
npm version patch  # or minor, major

# Push with tags
git push && git push --tags
```

The release workflow will automatically:
1. Run tests
2. Publish to npm
3. Create GitHub Release

### Prerelease Versions

For alpha/beta releases:

```bash
npm version prerelease --preid=alpha  # 1.0.1-alpha.0
npm version prerelease --preid=beta   # 1.0.1-beta.0
npm version prerelease --preid=rc     # 1.0.1-rc.0
```

## CI/CD Pipeline

### Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI** | Push/PR to main | Run tests, validate plugins |
| **Release** | Tag push (v*) | Publish to npm, create release |
| **Version Bump** | Manual | Bump version, create tag |

### Required Secrets

| Secret | Description |
|--------|-------------|
| `NPM_TOKEN` | npm access token for publishing |

To add NPM_TOKEN:
1. Generate token: https://www.npmjs.com/settings/tokens
2. Add to repo: Settings → Secrets → Actions → New repository secret

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and add tests
4. Run tests: `npm test`
5. Commit with conventional commits:
   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`
   - `chore: maintenance task`
6. Push and create PR

## Code Style

- ES Modules (import/export)
- Node.js >= 18
- Use descriptive variable names
- Add JSDoc comments for public functions

## Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:validation  # Plugin validation
npm run test:integration # Integration tests
npm run test:coverage # With coverage report
```

All tests must pass before merging.

---

*Think Omega. Build Omega. Be Omega.* 🔮
