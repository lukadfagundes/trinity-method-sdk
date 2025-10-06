/**
 * Plan Visualizer - Investigation Plan Visualization
 *
 * Generates visual specifications and reports for investigation plans:
 * - Mermaid diagrams (Gantt charts, flowcharts, timelines)
 * - HTML reports with embedded visualizations
 * - Markdown reports
 * - PDF exports (via HTML)
 *
 * Provides professional deliverables for stakeholders and team members.
 *
 * @module planning/PlanVisualizer
 * @version 1.0.0
 */

import * as fs from 'fs/promises';
import * as path from 'path';

import { InvestigationPhase, Timeline, Risk } from '../shared/types';

import { InvestigationPlan, ResourceEstimate } from './InvestigationPlanner';

/**
 * Visualization output format
 */
export type VisualizationFormat = 'mermaid' | 'html' | 'markdown' | 'json';

/**
 * Visualization options
 */
export interface VisualizationOptions {
  /** Output format */
  format: VisualizationFormat;

  /** Include diagrams */
  includeDiagrams?: boolean;

  /** Include resource breakdown */
  includeResources?: boolean;

  /** Include risk analysis */
  includeRisks?: boolean;

  /** Include timeline */
  includeTimeline?: boolean;

  /** Theme (for HTML output) */
  theme?: 'light' | 'dark';

  /** Output file path */
  outputPath?: string;
}

/**
 * Visualization result
 */
export interface VisualizationResult {
  /** Success status */
  success: boolean;

  /** Output content */
  content?: string;

  /** Output file path (if saved) */
  filePath?: string;

  /** Errors */
  errors?: string[];

  /** Generated diagrams */
  diagrams?: Map<string, string>;
}

/**
 * Plan visualizer with Mermaid integration
 */
export class PlanVisualizer {
  private trinityRoot: string;

  constructor(trinityRoot: string = './trinity') {
    this.trinityRoot = trinityRoot;
  }

  /**
   * Visualize investigation plan
   * @param plan - Investigation plan
   * @param options - Visualization options
   * @returns Visualization result
   */
  async visualize(plan: InvestigationPlan, options: VisualizationOptions): Promise<VisualizationResult> {
    try {
      let content: string;
      const diagrams = new Map<string, string>();

      switch (options.format) {
        case 'mermaid':
          content = this.generateMermaidDiagrams(plan, diagrams);
          break;

        case 'markdown':
          content = this.generateMarkdownReport(plan, options, diagrams);
          break;

        case 'html':
          content = this.generateHTMLReport(plan, options, diagrams);
          break;

        case 'json':
          content = JSON.stringify(plan, this.mapReplacer, 2);
          break;

        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      // Save to file if path provided
      let filePath: string | undefined;
      if (options.outputPath) {
        await fs.writeFile(options.outputPath, content, 'utf-8');
        filePath = options.outputPath;
      }

      return {
        success: true,
        content,
        filePath,
        diagrams,
      };
    } catch (error) {
      return {
        success: false,
        errors: [(error as Error).message],
      };
    }
  }

  /**
   * Generate Gantt chart for investigation timeline
   * @param plan - Investigation plan
   * @returns Mermaid Gantt chart
   */
  generateGanttChart(plan: InvestigationPlan): string {
    const lines: string[] = ['gantt', '    title Investigation Timeline', '    dateFormat YYYY-MM-DD', ''];

    // Add sections for each phase
    for (const phase of plan.phases) {
      lines.push(`    section ${phase.name}`);

      // Calculate phase duration in days
      const durationDays = Math.ceil((phase.estimatedHours || 0) / 8);

      // Generate task line
      const taskLine = `    ${phase.name}: ${phase.id}, ${durationDays}d`;
      lines.push(taskLine);
    }

    return lines.join('\n');
  }

  /**
   * Generate flowchart for investigation phases
   * @param plan - Investigation plan
   * @returns Mermaid flowchart
   */
  generateFlowchart(plan: InvestigationPlan): string {
    const lines: string[] = ['flowchart TD', '    Start([Investigation Start])'];

    // Add phases
    for (let i = 0; i < plan.phases.length; i++) {
      const phase = plan.phases[i];
      const phaseId = `P${i + 1}`;
      const phaseName = phase.name.replace(/[^a-zA-Z0-9 ]/g, '');

      lines.push(`    ${phaseId}[${phaseName}]`);

      // Link from previous
      if (i === 0) {
        lines.push(`    Start --> ${phaseId}`);
      } else {
        lines.push(`    P${i} --> ${phaseId}`);
      }

      // Add deliverables as notes
      if (phase.deliverables && phase.deliverables.length > 0) {
        const delivId = `D${i + 1}`;
        const delivText = phase.deliverables.join(', ');
        lines.push(`    ${delivId}{{${delivText}}}`);
        lines.push(`    ${phaseId} -.-> ${delivId}`);
      }
    }

    // End node
    lines.push(`    P${plan.phases.length} --> End([Investigation Complete])`);

    // Add styling
    lines.push('    classDef phaseStyle fill:#e1f5ff,stroke:#01579b,stroke-width:2px');
    lines.push('    classDef delivStyle fill:#fff9c4,stroke:#f57f17,stroke-width:1px');

    for (let i = 0; i < plan.phases.length; i++) {
      lines.push(`    class P${i + 1} phaseStyle`);
      if (plan.phases[i].deliverables && plan.phases[i].deliverables.length > 0) {
        lines.push(`    class D${i + 1} delivStyle`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate pie chart for resource distribution
   * @param estimate - Resource estimate
   * @returns Mermaid pie chart
   */
  generateResourcePieChart(estimate: ResourceEstimate): string {
    const lines: string[] = ['pie title Agent Resource Distribution'];

    for (const [agent, hours] of estimate.agentBreakdown) {
      const percentage = Math.round((hours / estimate.totalHours) * 100);
      lines.push(`    "${agent}": ${percentage}`);
    }

    return lines.join('\n');
  }

  /**
   * Generate timeline diagram
   * @param timeline - Investigation timeline
   * @returns Mermaid timeline
   */
  generateTimelineDiagram(timeline: Timeline): string {
    const lines: string[] = ['timeline', '    title Investigation Timeline'];

    // Group events by date
    const eventsByDate = new Map<string, any[]>();

    for (const event of timeline.events) {
      const date = event.timestamp.split('T')[0];
      if (!eventsByDate.has(date)) {
        eventsByDate.set(date, []);
      }
      eventsByDate.get(date).push(event);
    }

    // Generate timeline entries
    for (const [date, events] of eventsByDate) {
      lines.push(`    ${date}`);
      for (const event of events) {
        lines.push(`        : ${event.description}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate all Mermaid diagrams
   */
  private generateMermaidDiagrams(plan: InvestigationPlan, diagrams: Map<string, string>): string {
    const sections: string[] = [];

    // Gantt chart
    const gantt = this.generateGanttChart(plan);
    diagrams.set('gantt', gantt);
    sections.push(`# Investigation Timeline (Gantt Chart)\n\n\`\`\`mermaid\n${  gantt  }\n\`\`\`\n`);

    // Flowchart
    const flowchart = this.generateFlowchart(plan);
    diagrams.set('flowchart', flowchart);
    sections.push(`# Investigation Flow\n\n\`\`\`mermaid\n${  flowchart  }\n\`\`\`\n`);

    // Resource distribution
    const resourcePie = this.generateResourcePieChart(plan.resourceEstimate);
    diagrams.set('resources', resourcePie);
    sections.push(`# Resource Distribution\n\n\`\`\`mermaid\n${  resourcePie  }\n\`\`\`\n`);

    // Timeline
    if (plan.timeline.events.length > 0) {
      const timelineDiagram = this.generateTimelineDiagram(plan.timeline);
      diagrams.set('timeline', timelineDiagram);
      sections.push(`# Timeline\n\n\`\`\`mermaid\n${  timelineDiagram  }\n\`\`\`\n`);
    }

    return sections.join('\n');
  }

  /**
   * Generate Markdown report
   */
  private generateMarkdownReport(
    plan: InvestigationPlan,
    options: VisualizationOptions,
    diagrams: Map<string, string>
  ): string {
    const sections: string[] = [];

    // Header
    sections.push(`# Investigation Plan: ${plan.goal}`);
    sections.push(`\n**Plan ID**: ${plan.planId}`);
    sections.push(`**Type**: ${plan.type}`);
    sections.push(`**Created**: ${plan.metadata.createdAt}`);
    sections.push(`**Quality Score**: ${plan.metadata.qualityScore}/100`);
    sections.push(`**Completeness**: ${plan.metadata.completenessScore}%\n`);

    // Executive Summary
    sections.push('## Executive Summary\n');
    sections.push(`This investigation plan outlines a comprehensive ${plan.type} investigation.`);
    sections.push(
      `The investigation is estimated to take **${plan.resourceEstimate.totalHours} hours** across ${plan.phases.length} phases.`
    );
    sections.push(
      `Estimated cost: **$${plan.resourceEstimate.estimatedCost.toFixed(2)}** with ${(plan.resourceEstimate.confidence * 100).toFixed(0)}% confidence.\n`
    );

    // Scope
    sections.push('## Investigation Scope\n');
    sections.push('### Focus Areas\n');
    for (const area of plan.scope.focusAreas) {
      sections.push(`- ${area}`);
    }

    sections.push('\n### Technologies\n');
    for (const tech of plan.scope.technologies) {
      sections.push(`- ${tech}`);
    }

    sections.push('\n### Out of Scope\n');
    for (const item of plan.scope.outOfScope) {
      sections.push(`- ${item}`);
    }

    // Phases
    sections.push('\n## Investigation Phases\n');
    for (let i = 0; i < plan.phases.length; i++) {
      const phase = plan.phases[i];
      sections.push(`### Phase ${i + 1}: ${phase.name}\n`);
      sections.push(`${phase.description}\n`);
      sections.push(`**Estimated Time**: ${phase.estimatedHours} hours`);
      sections.push(`**Agents**: ${phase.agents?.join(', ') || 'None'}`);

      if (phase.deliverables && phase.deliverables.length > 0) {
        sections.push('\n**Deliverables**:');
        for (const deliverable of phase.deliverables) {
          sections.push(`- ${deliverable}`);
        }
      }

      sections.push('');
    }

    // Resources
    if (options.includeResources !== false) {
      sections.push('## Resource Estimate\n');
      sections.push(`**Total Hours**: ${plan.resourceEstimate.totalHours}`);
      sections.push(`**Estimated Tokens**: ${plan.resourceEstimate.estimatedTokens.toLocaleString()}`);
      sections.push(`**Estimated Cost**: $${plan.resourceEstimate.estimatedCost.toFixed(2)}`);
      sections.push(`**Confidence**: ${(plan.resourceEstimate.confidence * 100).toFixed(0)}%\n`);

      sections.push('### Agent Breakdown\n');
      for (const [agent, hours] of plan.resourceEstimate.agentBreakdown) {
        sections.push(`- **${agent}**: ${hours.toFixed(1)} hours`);
      }
      sections.push('');
    }

    // Risks
    if (options.includeRisks !== false && plan.risks.length > 0) {
      sections.push('## Risk Analysis\n');
      for (const risk of plan.risks) {
        sections.push(`### ${risk.description}\n`);
        sections.push(`**Severity**: ${risk.severity}`);
        sections.push(`**Probability**: ${(risk.probability * 100).toFixed(0)}%`);
        sections.push(`**Impact**: ${risk.impact}`);
        sections.push(`**Mitigation**: ${risk.mitigation}\n`);
      }
    }

    // Success Criteria
    sections.push('## Success Criteria\n');
    for (const criterion of plan.successCriteria) {
      sections.push(`- ${criterion}`);
    }
    sections.push('');

    // Diagrams
    if (options.includeDiagrams !== false) {
      sections.push('## Visual Specifications\n');
      this.generateMermaidDiagrams(plan, diagrams);

      for (const [name, diagram] of diagrams) {
        const title = name.charAt(0).toUpperCase() + name.slice(1);
        sections.push(`### ${title}\n\n\`\`\`mermaid\n${diagram}\n\`\`\`\n`);
      }
    }

    return sections.join('\n');
  }

  /**
   * Generate HTML report
   */
  private generateHTMLReport(
    plan: InvestigationPlan,
    options: VisualizationOptions,
    diagrams: Map<string, string>
  ): string {
    const theme = options.theme || 'light';
    const markdown = this.generateMarkdownReport(plan, options, diagrams);

    // Simple HTML wrapper with Mermaid support
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investigation Plan: ${plan.goal}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        :root {
            --bg-color: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
            --text-color: ${theme === 'dark' ? '#e0e0e0' : '#333333'};
            --heading-color: ${theme === 'dark' ? '#ffffff' : '#000000'};
            --border-color: ${theme === 'dark' ? '#444444' : '#dddddd'};
            --code-bg: ${theme === 'dark' ? '#2a2a2a' : '#f5f5f5'};
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        h1, h2, h3 {
            color: var(--heading-color);
        }

        h1 {
            border-bottom: 3px solid #2196F3;
            padding-bottom: 10px;
        }

        h2 {
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
            margin-top: 40px;
        }

        .metadata {
            background-color: var(--code-bg);
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .phase {
            background-color: var(--code-bg);
            padding: 15px;
            border-left: 4px solid #2196F3;
            margin: 15px 0;
            border-radius: 3px;
        }

        .risk {
            background-color: var(--code-bg);
            padding: 15px;
            border-left: 4px solid #ff9800;
            margin: 15px 0;
            border-radius: 3px;
        }

        .mermaid {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }

        ul {
            padding-left: 25px;
        }

        code {
            background-color: var(--code-bg);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div id="content"></div>

    <script>
        mermaid.initialize({ startOnLoad: true, theme: '${theme}' });

        const markdown = \`${markdown.replace(/`/g, '\\`')}\`;

        // Simple markdown to HTML conversion (basic implementation)
        let html = markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/<\\/li>\\n<li>/g, '</li><li>')
            .replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>')
            .replace(/\\n\\n/g, '</p><p>')
            .replace(/^(.+)$/gim, '<p>$1</p>');

        document.getElementById('content').innerHTML = html;
    </script>
</body>
</html>`;
  }

  /**
   * Helper to handle Map serialization in JSON
   */
  private mapReplacer(key: string, value: any): any {
    if (value instanceof Map) {
      return Object.fromEntries(value);
    }
    return value;
  }
}
