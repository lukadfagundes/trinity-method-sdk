import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { validatePath } from './validate-path.js';
import { processTemplate } from './template-processor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CIDeploymentStats {
  deployed: string[];
  skipped: string[];
  errors: Array<{ file?: string; error?: string; general?: string }>;
}

interface CIDeployOptions {
  yes?: boolean;
  force?: boolean;
}

type GitPlatform = 'github' | 'gitlab' | 'unknown';

/**
 * Deploy GitLab CI template
 * @param templatesPath - Path to templates directory
 * @param options - Deployment options
 * @param stats - Statistics object to update
 */
async function deployGitLabCI(
  templatesPath: string,
  options: CIDeployOptions,
  stats: CIDeploymentStats
): Promise<void> {
  try {
    const gitlabTemplate = path.join(templatesPath, 'gitlab-ci.yml');

    if (!(await fs.pathExists(gitlabTemplate))) {
      return;
    }

    const content = await fs.readFile(gitlabTemplate, 'utf8');
    const gitlabCIExists = await fs.pathExists('.gitlab-ci.yml');

    if (gitlabCIExists && !options.force) {
      stats.skipped.push('.gitlab-ci.yml (already exists)');
      return;
    }

    // Validate destination path for security
    const destPath = validatePath('.gitlab-ci.yml');
    await fs.writeFile(destPath, content);
    stats.deployed.push('.gitlab-ci.yml');
  } catch (error: unknown) {
    const { getErrorMessage } = await import('./errors.js');
    stats.errors.push({ file: '.gitlab-ci.yml', error: getErrorMessage(error) });
  }
}

/**
 * Deploy CI workflow templates based on detected Git platform
 *
 * @param options - Deployment options
 * @param variables - Template variables for processing
 * @returns Deployment results with statistics
 */
export async function deployCITemplates(
  options: CIDeployOptions = {},
  variables: Record<string, string> = {}
): Promise<CIDeploymentStats> {
  const stats: CIDeploymentStats = {
    deployed: [],
    skipped: [],
    errors: [],
  };

  try {
    // Detect Git platform
    const platform = await detectGitPlatform();

    const templatesPath = path.join(__dirname, '../../templates/ci');

    // GitHub Actions - Deploy CI workflow
    if (platform === 'github' || platform === 'unknown') {
      try {
        await fs.ensureDir('.github/workflows');

        // Deploy CI workflow
        const ciTemplate = path.join(templatesPath, 'ci.yml.template');
        if (await fs.pathExists(ciTemplate)) {
          const ciExists = await fs.pathExists('.github/workflows/ci.yml');

          if (ciExists && !options.force) {
            stats.skipped.push('.github/workflows/ci.yml (already exists)');
          } else {
            const content = await fs.readFile(ciTemplate, 'utf8');
            const processed = processTemplate(content, variables);

            // Validate destination path for security
            const destPath = validatePath('.github/workflows/ci.yml');
            await fs.writeFile(destPath, processed);
            stats.deployed.push('.github/workflows/ci.yml');
          }
        }
      } catch (error: unknown) {
        const { getErrorMessage } = await import('./errors.js');
        stats.errors.push({
          file: '.github/workflows/ci.yml',
          error: getErrorMessage(error),
        });
      }
    }

    // GitLab CI
    if (platform === 'gitlab') {
      await deployGitLabCI(templatesPath, options, stats);
    }

    // Generic template (always deploy to trinity/templates/ci)
    try {
      await fs.ensureDir('trinity/templates/ci');
      const genericTemplate = path.join(templatesPath, 'generic-ci.yml');

      if (await fs.pathExists(genericTemplate)) {
        const content = await fs.readFile(genericTemplate, 'utf8');

        // Validate destination path for security
        const destPath = validatePath('trinity/templates/ci/generic-ci.yml');
        await fs.writeFile(destPath, content);
        stats.deployed.push('trinity/templates/ci/generic-ci.yml');
      }
    } catch (error: unknown) {
      const { getErrorMessage } = await import('./errors.js');
      stats.errors.push({
        file: 'trinity/templates/ci/generic-ci.yml',
        error: getErrorMessage(error),
      });
    }

    return stats;
  } catch (error: unknown) {
    const { getErrorMessage } = await import('./errors.js');
    stats.errors.push({ general: getErrorMessage(error) });
    return stats;
  }
}

/**
 * Detect Git platform (GitHub, GitLab, or unknown)
 *
 * @returns Platform name: 'github', 'gitlab', or 'unknown'
 */
async function detectGitPlatform(): Promise<GitPlatform> {
  try {
    // Check .git/config for remote origin
    const gitConfigPath = '.git/config';

    if (await fs.pathExists(gitConfigPath)) {
      const config = await fs.readFile(gitConfigPath, 'utf8');

      if (config.includes('github.com')) {
        return 'github';
      }

      if (config.includes('gitlab.com') || config.includes('gitlab')) {
        return 'gitlab';
      }
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}
