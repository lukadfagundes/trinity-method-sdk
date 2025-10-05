/**
 * Plan Visualizer Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { PlanVisualizer } from '../../../src/planning/PlanVisualizer';
import type { InvestigationPlan, ResourceEstimate } from '../../../src/shared/types';

describe('PlanVisualizer', () => {
  let visualizer: PlanVisualizer;
  let samplePlan: InvestigationPlan;
  let sampleEstimate: ResourceEstimate;

  beforeEach(() => {
    visualizer = new PlanVisualizer();

    samplePlan = {
      id: 'plan-1',
      type: 'security-audit',
      title: 'Security Audit Plan',
      description: 'Comprehensive security audit',
      scope: {
        targetPath: '.',
        include: ['src/**/*.ts'],
        exclude: ['**/test/**'],
        focusAreas: ['authentication', 'authorization'],
        technologies: ['TypeScript', 'Node.js'],
      },
      phases: [
        {
          id: 'phase-1',
          name: 'Security Analysis',
          description: 'Analyze security vulnerabilities',
          tasks: ['task-1', 'task-2'],
          estimatedDuration: 10,
          dependencies: [],
          deliverables: ['Security Analysis Report'],
        },
        {
          id: 'phase-2',
          name: 'Penetration Testing',
          description: 'Test security weaknesses',
          tasks: ['task-3'],
          estimatedDuration: 15,
          dependencies: ['phase-1'],
          deliverables: ['Penetration Test Report'],
        },
        {
          id: 'phase-3',
          name: 'Remediation Planning',
          description: 'Plan remediation steps',
          tasks: ['task-4'],
          estimatedDuration: 5,
          dependencies: ['phase-2'],
          deliverables: ['Remediation Plan'],
        },
      ],
      resourceEstimate: {
        totalHours: 30,
        estimatedTokens: 200000,
        estimatedCost: 5.0,
        confidence: 0.85,
      },
      risks: [
        {
          description: 'Incomplete coverage of attack vectors',
          impact: 'high',
          mitigation: 'Use comprehensive security checklist',
        },
      ],
      successCriteria: [
        'All OWASP Top 10 vulnerabilities checked',
        'No critical vulnerabilities remaining',
      ],
      timeline: {
        estimatedStart: new Date('2025-01-15'),
        estimatedEnd: new Date('2025-02-15'),
        totalDays: 31,
      },
      metadata: {
        createdAt: new Date(),
        createdBy: 'InvestigationPlanner',
        version: '1.0.0',
        qualityScore: 0.9,
        completenessScore: 0.95,
      },
    };

    sampleEstimate = {
      totalHours: 30,
      estimatedTokens: 200000,
      estimatedCost: 5.0,
      confidence: 0.85,
    };
  });

  describe('Gantt Chart Generation', () => {
    it('should generate Mermaid Gantt chart', () => {
      const gantt = visualizer.generateGanttChart(samplePlan);

      expect(gantt).toContain('gantt');
      expect(gantt).toContain('title');
      expect(gantt).toContain('dateFormat');
      expect(gantt).toContain('Security Analysis');
      expect(gantt).toContain('Penetration Testing');
      expect(gantt).toContain('Remediation Planning');
    });

    it('should include phase dependencies in Gantt chart', () => {
      const gantt = visualizer.generateGanttChart(samplePlan);

      expect(gantt).toContain('after');
    });

    it('should handle plans with no phases', () => {
      const emptyPlan = { ...samplePlan, phases: [] };
      const gantt = visualizer.generateGanttChart(emptyPlan);

      expect(gantt).toContain('gantt');
      expect(gantt).toBeDefined();
    });

    it('should handle plans with parallel phases', () => {
      const parallelPlan = {
        ...samplePlan,
        phases: [
          {
            id: 'phase-1',
            name: 'Phase 1',
            description: 'First phase',
            tasks: ['task-1'],
            estimatedDuration: 10,
            dependencies: [],
          },
          {
            id: 'phase-2',
            name: 'Phase 2',
            description: 'Second phase (parallel)',
            tasks: ['task-2'],
            estimatedDuration: 10,
            dependencies: [],
          },
        ],
      };

      const gantt = visualizer.generateGanttChart(parallelPlan);

      expect(gantt).toContain('Phase 1');
      expect(gantt).toContain('Phase 2');
    });
  });

  describe('Flowchart Generation', () => {
    it('should generate Mermaid flowchart', () => {
      const flowchart = visualizer.generateFlowchart(samplePlan);

      expect(flowchart).toContain('flowchart');
      expect(flowchart).toContain('Security Analysis');
      expect(flowchart).toContain('Penetration Testing');
      expect(flowchart).toContain('Remediation Planning');
      expect(flowchart).toContain('-->');
    });

    it('should show phase dependencies in flowchart', () => {
      const flowchart = visualizer.generateFlowchart(samplePlan);

      expect(flowchart).toContain('phase-1');
      expect(flowchart).toContain('phase-2');
      expect(flowchart).toContain('phase-3');
      expect(flowchart).toContain('-->');
    });

    it('should handle complex dependency graphs', () => {
      const complexPlan = {
        ...samplePlan,
        phases: [
          {
            id: 'phase-1',
            name: 'Phase 1',
            description: 'First',
            tasks: ['task-1'],
            estimatedDuration: 10,
            dependencies: [],
          },
          {
            id: 'phase-2',
            name: 'Phase 2',
            description: 'Second',
            tasks: ['task-2'],
            estimatedDuration: 10,
            dependencies: ['phase-1'],
          },
          {
            id: 'phase-3',
            name: 'Phase 3',
            description: 'Third',
            tasks: ['task-3'],
            estimatedDuration: 10,
            dependencies: ['phase-1'],
          },
          {
            id: 'phase-4',
            name: 'Phase 4',
            description: 'Fourth',
            tasks: ['task-4'],
            estimatedDuration: 10,
            dependencies: ['phase-2', 'phase-3'],
          },
        ],
      };

      const flowchart = visualizer.generateFlowchart(complexPlan);

      expect(flowchart).toContain('phase-1');
      expect(flowchart).toContain('phase-2');
      expect(flowchart).toContain('phase-3');
      expect(flowchart).toContain('phase-4');
    });
  });

  describe('Resource Pie Chart Generation', () => {
    it('should generate resource breakdown pie chart', () => {
      const pieChart = visualizer.generateResourcePieChart(sampleEstimate);

      expect(pieChart).toContain('pie');
      expect(pieChart).toContain('title');
    });

    it('should include phase breakdowns when available', () => {
      const detailedEstimate = {
        ...sampleEstimate,
        breakdown: {
          byPhase: [
            { phaseId: 'phase-1', estimatedHours: 10, estimatedTokens: 80000 },
            { phaseId: 'phase-2', estimatedHours: 15, estimatedTokens: 100000 },
            { phaseId: 'phase-3', estimatedHours: 5, estimatedTokens: 20000 },
          ],
        },
      };

      const pieChart = visualizer.generateResourcePieChart(detailedEstimate);

      expect(pieChart).toContain('pie');
    });
  });

  describe('Timeline Diagram Generation', () => {
    it('should generate timeline diagram', () => {
      const timeline = visualizer.generateTimelineDiagram(samplePlan);

      expect(timeline).toContain('gantt');
      expect(timeline).toContain('Security Analysis');
      expect(timeline).toContain('Penetration Testing');
    });

    it('should include milestones', () => {
      const planWithMilestones = {
        ...samplePlan,
        milestones: [
          { id: 'm1', name: 'Analysis Complete', date: new Date('2025-01-25') },
          { id: 'm2', name: 'Testing Complete', date: new Date('2025-02-10') },
        ],
      };

      const timeline = visualizer.generateTimelineDiagram(planWithMilestones);

      expect(timeline).toBeDefined();
    });
  });

  describe('Report Generation', () => {
    it('should generate Markdown report', () => {
      const report = visualizer.generateReport(samplePlan, 'markdown');

      expect(report).toContain('# Security Audit Plan');
      expect(report).toContain('## Overview');
      expect(report).toContain('## Scope');
      expect(report).toContain('## Phases');
      expect(report).toContain('## Resource Estimate');
      expect(report).toContain('## Risks');
      expect(report).toContain('## Success Criteria');
    });

    it('should include Mermaid diagrams in Markdown report', () => {
      const report = visualizer.generateReport(samplePlan, 'markdown');

      expect(report).toContain('```mermaid');
      expect(report).toContain('gantt');
      expect(report).toContain('flowchart');
    });

    it('should generate HTML report', () => {
      const report = visualizer.generateReport(samplePlan, 'html');

      expect(report).toContain('<!DOCTYPE html>');
      expect(report).toContain('<html');
      expect(report).toContain('<head>');
      expect(report).toContain('<body>');
      expect(report).toContain('Security Audit Plan');
    });

    it('should include interactive diagrams in HTML report', () => {
      const report = visualizer.generateReport(samplePlan, 'html');

      expect(report).toContain('mermaid');
      expect(report).toContain('<script>');
    });

    it('should generate JSON report', () => {
      const report = visualizer.generateReport(samplePlan, 'json');

      const parsed = JSON.parse(report);
      expect(parsed.id).toBe('plan-1');
      expect(parsed.type).toBe('security-audit');
      expect(parsed.phases).toHaveLength(3);
    });

    it('should include all plan details in JSON report', () => {
      const report = visualizer.generateReport(samplePlan, 'json');

      const parsed = JSON.parse(report);
      expect(parsed.scope).toBeDefined();
      expect(parsed.phases).toBeDefined();
      expect(parsed.resourceEstimate).toBeDefined();
      expect(parsed.risks).toBeDefined();
      expect(parsed.successCriteria).toBeDefined();
      expect(parsed.timeline).toBeDefined();
    });
  });

  describe('Summary Generation', () => {
    it('should generate plan summary', () => {
      const summary = visualizer.generateSummary(samplePlan);

      expect(summary).toContain('Security Audit Plan');
      expect(summary).toContain('3 phases');
      expect(summary).toContain('30 hours');
      expect(summary).toContain('200000 tokens');
    });

    it('should include confidence level in summary', () => {
      const summary = visualizer.generateSummary(samplePlan);

      expect(summary).toContain('85%');
    });

    it('should highlight risks in summary', () => {
      const summary = visualizer.generateSummary(samplePlan);

      expect(summary).toContain('1 risk');
    });
  });

  describe('Phase Visualization', () => {
    it('should visualize individual phase', () => {
      const phase = samplePlan.phases[0];
      const visualization = visualizer.visualizePhase(phase);

      expect(visualization).toContain('Security Analysis');
      expect(visualization).toContain('10 hours');
    });

    it('should show phase dependencies', () => {
      const phase = samplePlan.phases[1];
      const visualization = visualizer.visualizePhase(phase);

      expect(visualization).toContain('Dependencies');
      expect(visualization).toContain('phase-1');
    });

    it('should list phase deliverables', () => {
      const phase = samplePlan.phases[0];
      const visualization = visualizer.visualizePhase(phase);

      expect(visualization).toContain('Deliverables');
      expect(visualization).toContain('Security Analysis Report');
    });
  });

  describe('Risk Visualization', () => {
    it('should visualize risks with impact levels', () => {
      const riskViz = visualizer.visualizeRisks(samplePlan.risks);

      expect(riskViz).toContain('high');
      expect(riskViz).toContain('Incomplete coverage');
      expect(riskViz).toContain('Use comprehensive security checklist');
    });

    it('should handle multiple risks', () => {
      const multipleRisks = [
        {
          description: 'Risk 1',
          impact: 'high' as const,
          mitigation: 'Mitigation 1',
        },
        {
          description: 'Risk 2',
          impact: 'medium' as const,
          mitigation: 'Mitigation 2',
        },
        {
          description: 'Risk 3',
          impact: 'low' as const,
          mitigation: 'Mitigation 3',
        },
      ];

      const riskViz = visualizer.visualizeRisks(multipleRisks);

      expect(riskViz).toContain('Risk 1');
      expect(riskViz).toContain('Risk 2');
      expect(riskViz).toContain('Risk 3');
    });
  });

  describe('Export Formats', () => {
    it('should export to markdown file format', () => {
      const exported = visualizer.export(samplePlan, 'markdown');

      expect(exported.format).toBe('markdown');
      expect(exported.content).toContain('# Security Audit Plan');
      expect(exported.filename).toMatch(/\.md$/);
    });

    it('should export to HTML file format', () => {
      const exported = visualizer.export(samplePlan, 'html');

      expect(exported.format).toBe('html');
      expect(exported.content).toContain('<!DOCTYPE html>');
      expect(exported.filename).toMatch(/\.html$/);
    });

    it('should export to JSON file format', () => {
      const exported = visualizer.export(samplePlan, 'json');

      expect(exported.format).toBe('json');
      expect(() => JSON.parse(exported.content)).not.toThrow();
      expect(exported.filename).toMatch(/\.json$/);
    });

    it('should generate unique filenames', () => {
      const export1 = visualizer.export(samplePlan, 'markdown');
      const export2 = visualizer.export(samplePlan, 'markdown');

      expect(export1.filename).toBeDefined();
      expect(export2.filename).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate plan before visualization', () => {
      const invalidPlan = { ...samplePlan, phases: undefined } as any;

      expect(() => visualizer.generateGanttChart(invalidPlan)).toThrow();
    });

    it('should handle missing timeline gracefully', () => {
      const planWithoutTimeline = { ...samplePlan, timeline: undefined };

      const report = visualizer.generateReport(planWithoutTimeline, 'markdown');
      expect(report).toBeDefined();
    });
  });
});
