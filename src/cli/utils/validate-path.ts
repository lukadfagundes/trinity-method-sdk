/**
 * Path Validation Utility
 * Security module for preventing path traversal and symlink attacks
 * @module cli/utils/validate-path
 */

import path from 'path';
import fs from 'fs-extra';

/**
 * Validate that a path is safe and within project directory
 *
 * Security checks:
 * - Rejects absolute paths (Unix: /path, Windows: C:\path, UNC: \\server\share)
 * - Rejects path traversal attempts (../)
 * - Normalizes path separators for cross-platform compatibility
 * - Ensures resolved path is within baseDir
 *
 * @param userPath - User-provided path (potentially malicious)
 * @param baseDir - Base directory (defaults to current working directory)
 * @throws Error if path is invalid, absolute, or attempts traversal
 * @returns Validated absolute path within baseDir
 *
 * @example
 * ```typescript
 * // Valid usage
 * const safe = validatePath('trinity/agents'); // OK
 * const safe2 = validatePath('./trinity/agents'); // OK
 *
 * // Blocked - path traversal
 * validatePath('../../../etc/passwd'); // throws Error
 *
 * // Blocked - absolute path
 * validatePath('/etc/passwd'); // throws Error
 * validatePath('C:\\Windows\\System32'); // throws Error
 * ```
 */
export function validatePath(userPath: string, baseDir: string = process.cwd()): string {
  // Check for null bytes (path injection attempt)
  if (userPath.includes('\0')) {
    throw new Error(
      `Invalid path: null byte detected in "${userPath}"\n` +
        `Null bytes are not allowed in file paths.`
    );
  }

  // Normalize path separators (handles Windows \ and Unix /)
  const normalized = path.normalize(userPath);

  // Reject absolute paths (security policy: only relative paths allowed)
  if (path.isAbsolute(normalized)) {
    throw new Error(
      `Absolute paths are not allowed: ${userPath}\n` +
        `Use relative paths within project directory.`
    );
  }

  // Resolve to absolute path (relative to baseDir)
  const resolved = path.resolve(baseDir, normalized);

  // Check if resolved path is within baseDir
  // This is the core security check for path traversal
  const relative = path.relative(baseDir, resolved);

  // If relative path starts with ".." or is absolute, it's outside baseDir
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(
      `Path traversal detected: ${userPath}\n` +
        `Path must be within project directory: ${baseDir}\n` +
        `Attempted to access: ${resolved}`
    );
  }

  return resolved;
}

/**
 * Validate that a path is not a symlink
 *
 * Security rationale:
 * - Prevents symlink attacks where malicious symlinks point to sensitive files
 * - Ensures file operations act on actual files, not symlink references
 * - Protects against symlink race conditions
 *
 * @param filePath - Path to validate (should be absolute path from validatePath)
 * @throws Error if path is a symlink
 *
 * @example
 * ```typescript
 * await validateNotSymlink('/project/trinity/agents/mon.md'); // OK
 * await validateNotSymlink('/project/link-to-passwd'); // throws Error
 * ```
 */
export async function validateNotSymlink(filePath: string): Promise<void> {
  try {
    // Use lstat to get symlink info (stat would follow the symlink)
    const stats = await fs.lstat(filePath);

    if (stats.isSymbolicLink()) {
      throw new Error(
        `Symlink detected: ${filePath}\n` +
          `For security, symlinks are not allowed in Trinity operations.\n` +
          `Please use the actual file or directory instead.`
      );
    }
  } catch (error: unknown) {
    // Re-throw if it's our symlink error
    const { getErrorMessage } = await import('./errors.js');
    const message = getErrorMessage(error);
    if (message.includes('Symlink detected')) {
      throw error;
    }
    // If file doesn't exist, that's OK (will be created)
    // Other errors should be handled by caller
    const err = error as { code?: string };
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Safely copy files or directories with security validation
 *
 * Security features:
 * - Validates both source and destination paths
 * - Rejects symlinks (prevents symlink attacks)
 * - Doesn't follow symlinks during copy (dereference: false)
 * - Ensures copy stays within project directory
 *
 * @param src - Source path (relative to baseDir)
 * @param dest - Destination path (relative to baseDir)
 * @param baseDir - Base directory (defaults to current working directory)
 * @throws Error if paths are invalid or contain symlinks
 *
 * @example
 * ```typescript
 * // Safe copy
 * await safeCopy('templates/agent.md', 'trinity/agents/new-agent.md');
 *
 * // Blocked - path traversal
 * await safeCopy('file.txt', '../outside/file.txt'); // throws Error
 *
 * // Blocked - symlink source
 * await safeCopy('symlink-to-file', 'dest.txt'); // throws Error
 * ```
 */
export async function safeCopy(
  src: string,
  dest: string,
  baseDir: string = process.cwd()
): Promise<void> {
  // Validate paths are within project directory
  const validSrc = validatePath(src, baseDir);
  const validDest = validatePath(dest, baseDir);

  // Check if source exists and is not a symlink
  if (await fs.pathExists(validSrc)) {
    await validateNotSymlink(validSrc);
  } else {
    throw new Error(`Source path does not exist: ${src}\n` + `Resolved to: ${validSrc}`);
  }

  // Copy with security options
  await fs.copy(validSrc, validDest, {
    dereference: false, // Don't follow symlinks (security)
    overwrite: true, // Allow overwriting existing files
  });
}
