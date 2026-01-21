# Version Management API Reference

**Module:** `src/cli/commands/update/version.ts`
**Purpose:** Version detection, comparison, and VERSION file management
**Priority:** HIGH (Critical for update decision-making)

---

## Overview

The Version Management module detects the currently installed Trinity Method SDK version, compares it with the latest available version, and determines if an update is needed.

**Key Features:**

- Current version detection from `trinity/VERSION` file
- Latest version detection from SDK `package.json`
- Version comparison logic
- Update necessity determination
- User-friendly version display

---

## Core Types

### `VersionInfo` Interface

```typescript
interface VersionInfo {
  currentVersion: string; // Installed version (e.g., "2.0.0")
  latestVersion: string; // Latest SDK version (e.g., "2.1.0")
  isUpToDate: boolean; // true if currentVersion === latestVersion
}
```

**Purpose:** Encapsulates version information for update decision-making

---

## Core Function

### `detectInstalledSDKVersion(spinner: Ora): Promise<VersionInfo>`

Detects current and latest SDK versions, performs comparison.

**Parameters:**

- `spinner` (Ora) - Spinner instance for status display

**Returns:** `Promise<VersionInfo>` - Version information object

**Detection Process:**

#### Step 1: Read Current Version

**Source:** `trinity/VERSION` file

**Logic:**

```typescript
const versionPath = 'trinity/VERSION';
let currentVersion = '0.0.0';

if (await fs.pathExists(versionPath)) {
  currentVersion = (await fs.readFile(versionPath, 'utf8')).trim();
}
```

**Fallback:** If VERSION file doesn't exist → `"0.0.0"`

**Rationale:** `0.0.0` indicates no deployment or corrupted deployment

---

#### Step 2: Read Latest Version

**Source:** Trinity SDK `package.json` file

**Logic:**

```typescript
const sdkPkgPath = await getPackageJsonPath();
const sdkPkg = JSON.parse(await fs.readFile(sdkPkgPath, 'utf8'));
const latestVersion = sdkPkg.version;
```

**Helper Function:** `getPackageJsonPath()`

- Locates SDK installation directory
- Returns absolute path to SDK `package.json`

**Version Source:** SDK's own package.json (`version` field)

---

#### Step 3: Version Comparison

**Logic:**

```typescript
return {
  currentVersion,
  latestVersion,
  isUpToDate: currentVersion === latestVersion,
};
```

**Comparison Method:** Exact string equality (`===`)

**Note:** No semantic versioning logic (e.g., `2.0.1` vs `2.0.0` comparison)

---

### Example Usage

```typescript
import ora from 'ora';
import { detectInstalledSDKVersion } from './version.js';

const spinner = ora();
const versionInfo = await detectInstalledSDKVersion(spinner);

console.log(versionInfo);
// Output:
// {
//   currentVersion: "2.0.0",
//   latestVersion: "2.1.0",
//   isUpToDate: false
// }

if (!versionInfo.isUpToDate) {
  console.log('Update available!');
}
```

---

### User Display

**Spinner Messages:**

```
⠙ Checking versions...
✓ Version check complete
   Current version: 2.0.0
   Latest version:  2.1.0
```

**Display Format:**

- Spinner shows "Checking versions..." during detection
- Success message: "Version check complete"
- Current and latest versions displayed in gray
- Aligned for readability

---

## Version Detection Scenarios

### Scenario 1: Update Available

**Condition:** `currentVersion < latestVersion`

**Example:**

```typescript
{
  currentVersion: "2.0.0",
  latestVersion: "2.1.0",
  isUpToDate: false
}
```

**Update Behavior:** Proceed with update (after user confirmation)

---

### Scenario 2: Up-to-Date

**Condition:** `currentVersion === latestVersion`

**Example:**

```typescript
{
  currentVersion: "2.1.0",
  latestVersion: "2.1.0",
  isUpToDate: true
}
```

**Update Behavior:**

- If `--force` flag: Show warning, proceed with update
- Otherwise: Display "Already up to date", exit

**User Messages:**

```
✅ Already up to date
```

---

### Scenario 3: No Deployment (First Run)

**Condition:** `trinity/VERSION` doesn't exist

**Example:**

```typescript
{
  currentVersion: "0.0.0",
  latestVersion: "2.1.0",
  isUpToDate: false
}
```

**Update Behavior:** Error in pre-flight checks (Trinity not deployed)

**User Message:**

```
⚠️  Trinity Method is not deployed
Run: trinity deploy
```

---

### Scenario 4: Future Version (Downgrade)

**Condition:** `currentVersion > latestVersion`

**Example:**

```typescript
{
  currentVersion: "3.0.0",
  latestVersion: "2.1.0",
  isUpToDate: false
}
```

**Update Behavior:** Treats as update needed (downgrades to latest SDK version)

**Note:** No warning about downgrade (exact equality check)

---

## VERSION File Format

### File Location

```
trinity/VERSION
```

### File Content

```
2.1.0
```

**Format:**

- Single line
- Semantic version string (MAJOR.MINOR.PATCH)
- No leading/trailing whitespace (trimmed on read)
- No newline at end

### Version String Format

**Standard:** Semantic Versioning (SemVer 2.0.0)

**Pattern:** `MAJOR.MINOR.PATCH`

**Examples:**

- `2.0.0` - Major version 2, no minor/patch changes
- `2.1.0` - Major version 2, minor version 1
- `2.1.3` - Major version 2, minor version 1, patch version 3

---

## SDK Package.json Detection

### Helper Function

**Function:** `getPackageJsonPath()`
**Module:** `src/cli/utils/get-sdk-path.ts`

**Purpose:** Locate Trinity SDK installation directory

**Detection Logic:**

1. Start from current module location (`__dirname`)
2. Traverse up directory tree
3. Find directory containing `package.json` with `name: "trinity-method"`
4. Return absolute path to `package.json`

**Example:**

```typescript
const sdkPath = await getPackageJsonPath();
// Returns: "/usr/local/lib/node_modules/trinity-method/package.json"
```

---

### SDK Package.json Structure

```json
{
  "name": "trinity-method",
  "version": "2.1.0",
  "description": "Trinity Method SDK for Claude Agent Orchestration",
  "main": "dist/index.js",
  "bin": {
    "trinity": "./bin/trinity.js"
  },
  "files": ["dist/", "templates/"]
}
```

**Version Field:** `version: "2.1.0"`

**Note:** This is the authoritative source for latest SDK version

---

## Version Comparison Logic

### Current Implementation

**Method:** Exact string equality

```typescript
isUpToDate: currentVersion === latestVersion;
```

**Behavior:**

- `"2.0.0" === "2.0.0"` → `true` (up-to-date)
- `"2.0.0" === "2.1.0"` → `false` (update needed)
- `"2.1.0" === "2.0.0"` → `false` (downgrade needed)

---

### Limitations

1. **No Semantic Version Comparison:**
   - Cannot determine if `2.0.1` is newer than `2.0.0`
   - String comparison only

2. **No Pre-release Handling:**
   - `2.1.0-beta` vs `2.1.0` not handled correctly

3. **No Build Metadata:**
   - `2.1.0+build123` not supported

---

### Alternative Implementations (Future)

**Semantic Version Comparison:**

```typescript
import semver from 'semver';

isUpToDate: semver.gte(currentVersion, latestVersion);
// 2.0.1 >= 2.0.0 → true (up-to-date)
// 2.0.0 >= 2.1.0 → false (update needed)
```

**Benefits:**

- Proper version ordering
- Pre-release support (`2.1.0-beta`)
- Range support (`^2.0.0`)

---

## Integration with Update Command

### Update Decision Flow

```typescript
const versionInfo = await detectInstalledSDKVersion(spinner);

if (versionInfo.isUpToDate && !options.force) {
  console.log('✅ Already up to date');
  return; // Exit early
}

if (options.force && versionInfo.isUpToDate) {
  console.log('⚠️  Forcing update (already at latest version)');
}

// Proceed with update confirmation and execution
const { confirm } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'confirm',
    message: `Update Trinity Method from ${versionInfo.currentVersion} to ${versionInfo.latestVersion}?`,
    default: true,
  },
]);
```

---

## Error Handling

### VERSION File Missing

**Error:** Pre-flight check fails (handled in `pre-flight.ts`)

**Behavior:**

- `detectInstalledSDKVersion()` returns `currentVersion: "0.0.0"`
- Pre-flight check detects missing Trinity deployment
- Update command aborted

---

### SDK Package.json Missing

**Error:** SDK installation corrupted

**Behavior:**

```typescript
const sdkPkgPath = await getPackageJsonPath();
// Throws error if package.json not found
```

**User Message:**

```
❌ Error: Trinity SDK installation corrupted
   Could not locate SDK package.json
```

**Recovery:** Reinstall Trinity SDK globally

---

### Invalid JSON in Package.json

**Error:** SDK package.json corrupted

**Behavior:**

```typescript
const sdkPkg = JSON.parse(await fs.readFile(sdkPkgPath, 'utf8'));
// Throws SyntaxError if invalid JSON
```

**User Message:**

```
❌ Error: Trinity SDK installation corrupted
   package.json contains invalid JSON
```

**Recovery:** Reinstall Trinity SDK globally

---

## Performance Considerations

**File I/O Operations:**

- Read `trinity/VERSION` (1 file read, ~10 bytes)
- Read SDK `package.json` (1 file read, ~500 bytes)

**Typical Performance:** <10ms

**Optimization:** Results not cached (detection runs once per update command)

---

## Testing Recommendations

### Unit Tests

```typescript
describe('detectInstalledSDKVersion', () => {
  it('should detect current version from VERSION file', async () => {
    fs.writeFileSync('trinity/VERSION', '2.0.0');
    const versionInfo = await detectInstalledSDKVersion(ora());
    expect(versionInfo.currentVersion).toBe('2.0.0');
  });

  it('should fallback to 0.0.0 if VERSION missing', async () => {
    fs.removeSync('trinity/VERSION');
    const versionInfo = await detectInstalledSDKVersion(ora());
    expect(versionInfo.currentVersion).toBe('0.0.0');
  });

  it('should detect latest version from SDK package.json', async () => {
    const versionInfo = await detectInstalledSDKVersion(ora());
    expect(versionInfo.latestVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should determine if up-to-date', async () => {
    fs.writeFileSync('trinity/VERSION', '2.1.0');
    // Assume SDK version is 2.1.0
    const versionInfo = await detectInstalledSDKVersion(ora());
    expect(versionInfo.isUpToDate).toBe(true);
  });

  it('should determine if update needed', async () => {
    fs.writeFileSync('trinity/VERSION', '2.0.0');
    // Assume SDK version is 2.1.0
    const versionInfo = await detectInstalledSDKVersion(ora());
    expect(versionInfo.isUpToDate).toBe(false);
  });
});
```

---

## Known Limitations

1. **No Semantic Version Comparison:**
   - Cannot determine version precedence (e.g., `2.0.1` > `2.0.0`)
   - Only exact string equality

2. **No Online Version Check:**
   - Only compares with locally installed SDK version
   - Cannot check npm registry for newer versions

3. **No Version History:**
   - No tracking of previous versions
   - No rollback to specific version

4. **No Pre-release Support:**
   - Cannot handle `2.1.0-beta` or `2.1.0-rc.1`

5. **No Version Constraints:**
   - Cannot enforce minimum required version
   - Cannot warn about breaking changes

---

## Future Enhancements

### Planned Improvements

- [ ] Semantic version comparison (use `semver` package)
- [ ] Online version check (npm registry API)
- [ ] Version history tracking (`trinity/versions/history.json`)
- [ ] Pre-release version support
- [ ] Breaking change detection and warnings
- [ ] Rollback to previous version support
- [ ] Automatic update notifications (weekly check)

---

## Related Documentation

- **Update Command:** [docs/api/update-command.md](update-command.md) - Main update orchestration
- **Verification Module:** [docs/api/update-verification.md](update-verification.md) - Post-update VERSION verification
- **Update Pre-flight:** [docs/api/update-pre-flight.md](update-pre-flight.md) - Pre-flight VERSION check

---

## Version Display Examples

### Up-to-Date Scenario

```
⠙ Checking versions...
✓ Version check complete
   Current version: 2.1.0
   Latest version:  2.1.0

✅ Already up to date
```

---

### Update Available Scenario

```
⠙ Checking versions...
✓ Version check complete
   Current version: 2.0.0
   Latest version:  2.1.0

? Update Trinity Method from 2.0.0 to 2.1.0? (Y/n)
```

---

### Force Update Scenario

```
⠙ Checking versions...
✓ Version check complete
   Current version: 2.1.0
   Latest version:  2.1.0

⚠️  Forcing update (already at latest version)

? Update Trinity Method from 2.1.0 to 2.1.0? (Y/n)
```

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
