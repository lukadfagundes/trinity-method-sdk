import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Deploy CI/CD workflow templates based on detected Git platform
 *
 * @param {Object} options - Deployment options
 * @param {boolean} options.yes - Skip confirmation prompts
 * @returns {Promise<Object>} Deployment results with statistics
 */
export async function deployCITemplates(options = {}) {
  const stats = {
    deployed: [],
    skipped: [],
    errors: []
  };

  try {
    // Detect Git platform
    const platform = await detectGitPlatform();

    const templatesPath = path.join(__dirname, '../../templates/ci');

    // GitHub Actions
    if (platform === 'github' || platform === 'unknown') {
      try {
        await fs.ensureDir('.github/workflows');
        const githubTemplate = path.join(templatesPath, 'github-actions.yml');

        if (await fs.pathExists(githubTemplate)) {
          const content = await fs.readFile(githubTemplate, 'utf8');
          await fs.writeFile('.github/workflows/trinity-ci.yml', content);
          stats.deployed.push('.github/workflows/trinity-ci.yml');
        }
      } catch (error) {
        stats.errors.push({ file: '.github/workflows/trinity-ci.yml', error: error.message });
      }
    }

    // GitLab CI
    if (platform === 'gitlab') {
      try {
        const gitlabTemplate = path.join(templatesPath, 'gitlab-ci.yml');

        if (await fs.pathExists(gitlabTemplate)) {
          const content = await fs.readFile(gitlabTemplate, 'utf8');

          // Check if .gitlab-ci.yml exists
          const gitlabCIExists = await fs.pathExists('.gitlab-ci.yml');

          if (gitlabCIExists && !options.force) {
            stats.skipped.push('.gitlab-ci.yml (already exists)');
          } else {
            await fs.writeFile('.gitlab-ci.yml', content);
            stats.deployed.push('.gitlab-ci.yml');
          }
        }
      } catch (error) {
        stats.errors.push({ file: '.gitlab-ci.yml', error: error.message });
      }
    }

    // Generic template (always deploy to trinity/templates/ci)
    try {
      await fs.ensureDir('trinity/templates/ci');
      const genericTemplate = path.join(templatesPath, 'generic-ci.yml');

      if (await fs.pathExists(genericTemplate)) {
        const content = await fs.readFile(genericTemplate, 'utf8');
        await fs.writeFile('trinity/templates/ci/generic-ci.yml', content);
        stats.deployed.push('trinity/templates/ci/generic-ci.yml');
      }
    } catch (error) {
      stats.errors.push({ file: 'trinity/templates/ci/generic-ci.yml', error: error.message });
    }

    return stats;
  } catch (error) {
    stats.errors.push({ general: error.message });
    return stats;
  }
}

/**
 * Detect Git platform (GitHub, GitLab, or unknown)
 *
 * @returns {Promise<string>} Platform name: 'github', 'gitlab', or 'unknown'
 */
async function detectGitPlatform() {
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
  } catch (error) {
    return 'unknown';
  }
}
