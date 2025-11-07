# Build and Pack Guide for Trinity Method SDK

## Quick Reference

After making changes to the SDK source code, follow these steps to rebuild and test locally:

```bash
# 1. Build TypeScript (compiles src/ to dist/)
npm run build

# 2. Remove old package
rm trinity-method-sdk-1.0.0.tgz

# 3. Create new package
npm pack

# 4. Install in test project
cd "/path/to/your/test/project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force

# 5. Deploy Trinity to test
npx trinity deploy
```

## Detailed Steps

### 1. Build the TypeScript Project

```bash
npm run build
```

**What this does:**
- Runs `prebuild` script → Cleans `dist/` directory
- Compiles TypeScript (`src/`) to JavaScript (`dist/`)
- Runs `copy-templates` → Copies `src/templates/` to `dist/templates/`

**Output:** All source files compiled to `dist/` directory

**Important:** The package uses compiled files from `dist/`, not source files from `src/`. Always build before packing!

### 2. Remove Old Package (Optional but Recommended)

```bash
rm trinity-method-sdk-1.0.0.tgz
```

**Why:** Ensures you're not accidentally using an old package file.

### 3. Create Package File

```bash
npm pack
```

**What this does:**
- Reads `package.json` to determine package name and version
- Respects `.npmignore` to exclude files (tests, source files, etc.)
- Includes files from `dist/` directory
- Creates `trinity-method-sdk-1.0.0.tgz` tarball

**Output:** `trinity-method-sdk-1.0.0.tgz` (compressed package file)

**Package contents:**
- Compiled JavaScript in `dist/`
- Templates in `dist/templates/`
- Type definitions (`.d.ts` files)
- README, LICENSE, CHANGELOG
- package.json

### 4. Install in Test Project

```bash
cd "/path/to/your/test/project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force
```

**Flags:**
- `--force` - Forces reinstallation even if already installed
- Relative path works from your test project to SDK directory

**What this does:**
- Extracts package to `node_modules/trinity-method-sdk/`
- Makes `npx trinity` command available
- Updates `package.json` with file reference

### 5. Deploy/Redeploy Trinity

```bash
npx trinity deploy
```

**What this does:**
- Copies slash commands from SDK to `.claude/commands/`
- Sets up Trinity structure in your project
- Deploys agents, templates, hooks, etc.

**Note:** If Trinity is already deployed, this will update existing files.

## Common Scenarios

### Scenario 1: Updated Slash Commands

You've edited files in `src/templates/shared/claude-commands/`:

```bash
# 1. Build to copy templates to dist/
npm run build

# 2. Repack
rm trinity-method-sdk-1.0.0.tgz && npm pack

# 3. Reinstall in test project
cd "../Your Test Project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force

# 4. Redeploy (updates .claude/commands/)
npx trinity deploy
```

### Scenario 2: Updated TypeScript Code

You've edited files in `src/` (agents, CLI commands, learning system, etc.):

```bash
# 1. Build TypeScript
npm run build

# 2. Repack
rm trinity-method-sdk-1.0.0.tgz && npm pack

# 3. Reinstall
cd "../Your Test Project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force

# 4. Test new functionality
npx trinity [command]
```

### Scenario 3: Updated Investigation Templates

You've edited files in `src/templates/investigations/`:

```bash
# 1. Build to copy templates
npm run build

# 2. Repack
rm trinity-method-sdk-1.0.0.tgz && npm pack

# 3. Reinstall
cd "../Your Test Project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force

# 4. Redeploy to update templates
npx trinity deploy
```

## Verify Package Contents

To verify what's included in the package before installing:

```bash
# List all files in package
tar -tzf trinity-method-sdk-1.0.0.tgz

# Search for specific files
tar -tzf trinity-method-sdk-1.0.0.tgz | grep "claude-commands"

# Extract package to inspect (creates package/ directory)
tar -xzf trinity-method-sdk-1.0.0.tgz
```

## Troubleshooting

### Problem: Changes Not Appearing After Install

**Cause:** Forgot to build before packing, or used old package file.

**Solution:**
```bash
# 1. Verify you built
ls -lh dist/templates/shared/claude-commands/trinity-crisis.md

# 2. Check package timestamp
ls -lh trinity-method-sdk-1.0.0.tgz

# 3. If old, rebuild and repack
npm run build && rm trinity-method-sdk-1.0.0.tgz && npm pack
```

### Problem: "Module not found" errors

**Cause:** TypeScript build failed or incomplete.

**Solution:**
```bash
# Clean and rebuild
npm run clean
npm run build

# Check for build errors in output
```

### Problem: Slash commands are old versions

**Cause:** Package was built before slash command updates.

**Solution:**
```bash
# Verify files exist in dist/
ls -lh dist/templates/shared/claude-commands/trinity-crisis.md
ls -lh dist/templates/shared/claude-commands/trinity-investigate-templates.md
ls -lh dist/templates/shared/claude-commands/trinity-knowledge-preservation.md

# If missing, build and repack
npm run build && rm trinity-method-sdk-1.0.0.tgz && npm pack
```

### Problem: Package size seems wrong

**Expected size:** ~488 KB compressed, ~2.0 MB unpacked

**Check:**
```bash
ls -lh trinity-method-sdk-1.0.0.tgz
```

If size is very different:
```bash
# Clean, build, and repack
npm run clean
npm run build
rm trinity-method-sdk-1.0.0.tgz
npm pack
```

## What Gets Included/Excluded

### Included in Package:
✅ `dist/` - Compiled JavaScript and types
✅ `dist/templates/` - All templates (slash commands, investigations, etc.)
✅ `README.md`, `LICENSE`, `CHANGELOG.md`
✅ `package.json`

### Excluded from Package (via `.npmignore`):
❌ `src/` - TypeScript source files
❌ `tests/` - Test files
❌ `node_modules/` - Dependencies
❌ `.git/` - Git repository
❌ `*.tgz` - Old package files
❌ Development configuration files

## Publishing vs. Local Testing

### Local Testing (Current Workflow):
```bash
npm pack → trinity-method-sdk-1.0.0.tgz
npm install ../path/to/package.tgz
```

### Publishing to npm (Future):
```bash
# Bump version
npm version patch  # or minor, or major

# Build and test
npm run build
npm test

# Publish to npm registry
npm publish

# Install from npm
npm install trinity-method-sdk
```

**Current status:** Using local `.tgz` file for testing before publishing to npm.

## Automated Build Script

Create a build script for convenience:

**File: `scripts/build-and-pack.sh`**
```bash
#!/bin/bash
set -e

echo "🔨 Building TypeScript..."
npm run build

echo "📦 Removing old package..."
rm -f trinity-method-sdk-1.0.0.tgz

echo "📦 Creating new package..."
npm pack

echo "✅ Package ready: trinity-method-sdk-1.0.0.tgz"
echo ""
echo "To install in test project:"
echo "  cd /path/to/test/project"
echo "  npm install \"../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz\" --force"
echo "  npx trinity deploy"
```

**Usage:**
```bash
chmod +x scripts/build-and-pack.sh
./scripts/build-and-pack.sh
```

## Git Workflow with Build and Pack

When working with git branches:

```bash
# 1. Make changes on feature branch
git checkout migration-implementations
# ... edit files in src/ ...

# 2. Build and pack
npm run build
rm trinity-method-sdk-1.0.0.tgz && npm pack

# 3. Test locally
cd "../Test Project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force
npx trinity deploy

# 4. If tests pass, commit
cd "../Trinity Method SDK"
git add .
git commit -m "feat: your changes"

# 5. Merge to testing branch
git checkout testing
git merge migration-implementations

# 6. Rebuild and repack from testing
npm run build
rm trinity-method-sdk-1.0.0.tgz && npm pack

# 7. Test from testing branch
cd "../Test Project"
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force
```

## Quick Commands Cheat Sheet

```bash
# Build only
npm run build

# Build and pack (one-liner)
npm run build && rm trinity-method-sdk-1.0.0.tgz && npm pack

# Install in Lion Machinery Tools (from SDK directory)
cd "../Lion Machinery Tools" && npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force && cd -

# Full workflow (build, pack, install, deploy)
npm run build && \
rm trinity-method-sdk-1.0.0.tgz && \
npm pack && \
cd "../Lion Machinery Tools" && \
npm install "../Trinity Method SDK/trinity-method-sdk-1.0.0.tgz" --force && \
npx trinity deploy && \
cd -
```

## Remember

1. **Always build before packing** - Package uses `dist/`, not `src/`
2. **Check package timestamp** - Ensure you're using the latest `.tgz`
3. **Use `--force` flag** - Forces npm to reinstall even if already present
4. **Redeploy after install** - `npx trinity deploy` updates `.claude/commands/`
5. **Verify in target project** - Check `.claude/commands/` for new slash commands

---

**Last Updated:** 2025-01-07
**SDK Version:** 1.0.0
**Build System:** TypeScript + npm pack