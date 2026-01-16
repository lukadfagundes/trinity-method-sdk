/**
 * Agent configuration deployment
 */

import fs from 'fs-extra';
import path from 'path';
import { processTemplate } from '../../utils/template-processor.js';
import { validatePath } from '../../utils/validate-path.js';
import type { Spinner } from './types.js';

/**
 * Deploy Claude Code agent configurations
 *
 * @param templatesPath - Path to templates directory
 * @param variables - Template variables for substitution
 * @param spinner - Spinner instance for status updates
 * @returns Number of agents deployed
 */
export async function deployAgents(
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<number> {
  spinner.start('Deploying Claude Code agents...');

  let agentsDeployed = 0;

  const agentDirs = [
    { dir: 'leadership', agents: ['aly-cto.md', 'aj-maestro.md'] },
    {
      dir: 'deployment',
      agents: ['tan-structure.md', 'zen-knowledge.md', 'ino-context.md', 'ein-cicd.md'],
    },
    { dir: 'audit', agents: ['juno-auditor.md'] },
    {
      dir: 'planning',
      agents: ['mon-requirements.md', 'ror-design.md', 'tra-planner.md', 'eus-decomposer.md'],
    },
    {
      dir: 'aj-team',
      agents: [
        'kil-task-executor.md',
        'bas-quality-gate.md',
        'dra-code-reviewer.md',
        'apo-documentation-specialist.md',
        'bon-dependency-manager.md',
        'cap-configuration-specialist.md',
        'uro-refactoring-specialist.md',
      ],
    },
  ];

  for (const { dir, agents } of agentDirs) {
    for (const agent of agents) {
      const templatePath = path.join(templatesPath, '.claude/agents', dir, `${agent}.template`);

      if (await fs.pathExists(templatePath)) {
        const content = await fs.readFile(templatePath, 'utf8');
        const processed = processTemplate(content, variables);

        // Validate destination path for security
        const destPath = validatePath(`.claude/agents/${dir}/${agent}`);
        await fs.writeFile(destPath, processed);
        agentsDeployed++;
      }
    }
  }

  spinner.succeed(`Agents deployed (${agentsDeployed} agents)`);

  return agentsDeployed;
}
