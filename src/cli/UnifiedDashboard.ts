/**
 * Unified Trinity Dashboard
 * Single web-based dashboard with all monitoring capabilities
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

export interface UnifiedDashboardOptions {
  port?: number;
  host?: string;
  autoOpen?: boolean;
}

export class UnifiedDashboard {
  private app: Express;
  private server: Server | null = null;
  private port: number;
  private host: string;

  constructor(options: UnifiedDashboardOptions = {}) {
    this.port = options.port ?? 3000;
    this.host = options.host ?? 'localhost';
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    // Main dashboard page
    this.app.get('/', (req: Request, res: Response) => {
      res.send(this.generateDashboardHTML());
    });

    // API endpoints
    this.app.get('/api/cache/stats', this.handleCacheStats.bind(this));
    this.app.get('/api/learning/metrics', this.handleLearningMetrics.bind(this));
    this.app.get('/api/analytics/summary', this.handleAnalyticsSummary.bind(this));
    this.app.get('/api/investigations/list', this.handleInvestigationsList.bind(this));
    this.app.get('/api/work-orders/list', this.handleWorkOrdersList.bind(this));
    this.app.get('/api/analytics-reports', this.handleAnalyticsReports.bind(this));
    this.app.get('/api/learning-exports', this.handleLearningExports.bind(this));
    this.app.get('/api/knowledge-base', this.handleKnowledgeBase.bind(this));
    this.app.get('/api/trinity-docs', this.handleTrinityDocs.bind(this));
    this.app.get('/api/health', this.handleHealthCheck.bind(this));
  }

  /**
   * Start the dashboard server
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, this.host, () => {
          console.log(`\n🚀 Trinity Dashboard started!`);
          console.log(`📊 Access dashboard at: http://${this.host}:${this.port}`);
          console.log(`\n💡 Press Ctrl+C to stop the dashboard\n`);
          resolve();
        });

        this.server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            console.error(`\n❌ Port ${this.port} is already in use`);
            console.log(`💡 Try: npx trinity dashboard --port ${this.port + 1}\n`);
          } else {
            console.error(`\n❌ Server error:`, error.message);
          }
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the dashboard server
   */
  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('\n✅ Dashboard stopped\n');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Handle cache stats API request
   */
  private async handleCacheStats(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const configPath = path.join(process.cwd(), 'trinity/cache/config.json');

      if (!await fs.pathExists(configPath)) {
        res.json({
          enabled: false,
          message: 'Cache system not initialized'
        });
        return;
      }

      const config = await fs.readJson(configPath);

      // Return mock stats for now (will be replaced with real cache manager)
      res.json({
        enabled: config.enabled,
        overall: {
          hitRate: 0,
          totalHits: 0,
          totalMisses: 0,
          tokensSaved: 0,
          similarityDetections: 0
        },
        tiers: {
          l1: { hits: 0, misses: 0, size: 0 },
          l2: { hits: 0, misses: 0, size: 0 },
          l3: { hits: 0, misses: 0, size: 0 }
        },
        health: {
          status: 'healthy',
          issues: [],
          recommendations: ['Start using cache to see performance metrics']
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle learning metrics API request
   */
  private async handleLearningMetrics(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const configPath = path.join(process.cwd(), 'trinity/learning/config.json');
      const registryPath = path.join(process.cwd(), 'trinity/learning/patterns/registry.json');

      if (!await fs.pathExists(configPath)) {
        res.json({
          enabled: false,
          message: 'Learning system not initialized'
        });
        return;
      }

      const config = await fs.readJson(configPath);
      let registry: any = { patterns: [], insights: [], improvements: [] };

      if (await fs.pathExists(registryPath)) {
        registry = await fs.readJson(registryPath);
      }

      res.json({
        enabled: config.enabled,
        agents: {
          AJ: { patterns: 0, strategies: 0, successRate: 0, progress: 'beginner' },
          TAN: { patterns: 0, strategies: 0, successRate: 0, progress: 'beginner' },
          ZEN: { patterns: 0, strategies: 0, successRate: 0, progress: 'beginner' },
          INO: { patterns: 0, strategies: 0, successRate: 0, progress: 'beginner' },
          JUNO: { patterns: 0, strategies: 0, successRate: 0, progress: 'beginner' }
        },
        totalPatterns: registry.patterns.length,
        totalInsights: registry.insights.length,
        recommendations: ['Run investigations to start learning']
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle analytics summary API request
   */
  private async handleAnalyticsSummary(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const configPath = path.join(process.cwd(), 'trinity/analytics/config.json');
      const metricsPath = path.join(process.cwd(), 'trinity/analytics/metrics.json');

      if (!await fs.pathExists(configPath)) {
        res.json({
          enabled: false,
          message: 'Analytics system not initialized'
        });
        return;
      }

      const config = await fs.readJson(configPath);
      let metrics: any = { sessions: [], performance: [], anomalies: [] };

      if (await fs.pathExists(metricsPath)) {
        metrics = await fs.readJson(metricsPath);
      }

      res.json({
        enabled: config.enabled,
        projectName: config.projectName,
        framework: config.framework,
        totalSessions: metrics.sessions.length,
        totalPerformanceEvents: metrics.performance.length,
        totalAnomalies: metrics.anomalies.length,
        thresholds: config.thresholds,
        recommendations: metrics.sessions.length === 0
          ? ['Start a Trinity session to collect analytics']
          : []
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle investigations list API request
   */
  private async handleInvestigationsList(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const investigationsDir = path.join(process.cwd(), 'trinity/investigations');

      if (!await fs.pathExists(investigationsDir)) {
        res.json({
          total: 0,
          investigations: [],
          message: 'No investigations yet'
        });
        return;
      }

      const files = await fs.readdir(investigationsDir);

      // Filter for markdown files and get their stats
      const investigations = [];
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(investigationsDir, file);
          const stats = await fs.stat(filePath);

          // Extract title from filename (INV-001-title.md -> title)
          const nameMatch = file.match(/INV-\d+-(.+)\.md$/);
          const displayName = nameMatch ? nameMatch[1].replace(/-/g, ' ') : file;

          investigations.push({
            name: displayName,
            filename: file,
            path: `trinity/investigations/${file}`,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString()
          });
        }
      }

      // Sort by modified time (most recent first)
      investigations.sort((a, b) =>
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
      );

      res.json({
        total: investigations.length,
        investigations
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle knowledge base API request
   */
  private async handleKnowledgeBase(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const knowledgeBasePath = path.join(process.cwd(), 'trinity/knowledge-base');

      if (!await fs.pathExists(knowledgeBasePath)) {
        res.json({ documents: [], message: 'Knowledge base not found' });
        return;
      }

      const documents = [
        'ARCHITECTURE.md',
        'ISSUES.md',
        'METHODOLOGY.md',
        'Technical-Debt.md',
        'To-do.md'
      ];

      const knowledgeBase = [];
      for (const doc of documents) {
        const docPath = path.join(knowledgeBasePath, doc);
        if (await fs.pathExists(docPath)) {
          const content = await fs.readFile(docPath, 'utf-8');
          knowledgeBase.push({
            name: doc.replace('.md', '').replace(/-/g, ' '),
            filename: doc,
            content
          });
        }
      }

      res.json({ documents: knowledgeBase });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle Trinity docs API request
   */
  private async handleTrinityDocs(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;

      const docFiles = [
        { path: 'trinity/CLAUDE.md', name: 'Trinity CLAUDE.md' },
        { path: 'TRINITY.md', name: 'TRINITY.md' },
        { path: 'CLAUDE.md', name: 'Project Root CLAUDE.md' },
        { path: '.claude/CLAUDE.md', name: 'Claude Folder CLAUDE.md' },
        { path: 'src/CLAUDE.md', name: 'Source CLAUDE.md' },
        { path: 'trinity/knowledge-base/Trinity.md', name: 'Trinity Methodology' }
      ];

      const docs = [];
      for (const doc of docFiles) {
        const docPath = path.join(process.cwd(), doc.path);
        if (await fs.pathExists(docPath)) {
          const content = await fs.readFile(docPath, 'utf-8');
          docs.push({
            name: doc.name,
            path: doc.path,
            content
          });
        }
      }

      res.json({ documents: docs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle work orders list API request
   */
  private async handleWorkOrdersList(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const workOrdersDir = path.join(process.cwd(), 'trinity/work-orders');

      if (!await fs.pathExists(workOrdersDir)) {
        res.json({
          total: 0,
          workOrders: [],
          message: 'No work orders yet'
        });
        return;
      }

      const files = await fs.readdir(workOrdersDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      const workOrders = await Promise.all(
        mdFiles.map(async (filename) => {
          const filePath = path.join(workOrdersDir, filename);
          const stats = await fs.stat(filePath);
          const content = await fs.readFile(filePath, 'utf-8');
          const firstLine = content.split('\n')[0];

          return {
            name: filename.replace('.md', '').replace(/^WO-\d+-/, '').replace(/-/g, ' '),
            filename,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
      );

      res.json({
        total: workOrders.length,
        workOrders: workOrders.sort((a, b) => b.modified.getTime() - a.modified.getTime())
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle analytics reports API request
   */
  private async handleAnalyticsReports(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const analyticsDir = path.join(process.cwd(), 'trinity/metrics/analytics');

      if (!await fs.pathExists(analyticsDir)) {
        res.json({ reports: [], message: 'No analytics reports yet' });
        return;
      }

      const reports = [];
      const files = await fs.readdir(analyticsDir);

      for (const file of files) {
        const filePath = path.join(analyticsDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          const content = await fs.readFile(filePath, 'utf-8');
          reports.push({
            name: file,
            path: `trinity/metrics/analytics/${file}`,
            created: stats.birthtime,
            modified: stats.mtime,
            size: stats.size,
            content
          });
        }
      }

      res.json({ reports: reports.sort((a, b) => b.modified.getTime() - a.modified.getTime()) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle learning exports API request
   */
  private async handleLearningExports(req: Request, res: Response): Promise<void> {
    try {
      const fsExtra = await import('fs-extra');
      const fs = fsExtra.default;
      const learningDir = path.join(process.cwd(), 'trinity/metrics/learning');

      if (!await fs.pathExists(learningDir)) {
        res.json({ exports: [], message: 'No learning exports yet' });
        return;
      }

      const exports = [];
      const files = await fs.readdir(learningDir);

      for (const file of files) {
        const filePath = path.join(learningDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          const content = await fs.readFile(filePath, 'utf-8');
          exports.push({
            name: file,
            path: `trinity/metrics/learning/${file}`,
            created: stats.birthtime,
            modified: stats.mtime,
            size: stats.size,
            content
          });
        }
      }

      res.json({ exports: exports.sort((a, b) => b.modified.getTime() - a.modified.getTime()) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle health check API request
   */
  private async handleHealthCheck(req: Request, res: Response): Promise<void> {
    const fsExtra = await import('fs-extra');
    const fs = fsExtra.default;

    const checks = {
      trinity: await fs.pathExists(path.join(process.cwd(), 'trinity')),
      cache: await fs.pathExists(path.join(process.cwd(), 'trinity/cache/config.json')),
      learning: await fs.pathExists(path.join(process.cwd(), 'trinity/learning/config.json')),
      analytics: await fs.pathExists(path.join(process.cwd(), 'trinity/analytics/config.json'))
    };

    const allHealthy = Object.values(checks).every(v => v);

    res.json({
      status: allHealthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate dashboard HTML
   */
  private generateDashboardHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trinity Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #0a0e27;
      color: #e4e4e7;
      line-height: 1.6;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .header p {
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .status-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .status-card {
      flex: 1;
      min-width: 200px;
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #334155;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .status-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }

    .status-card h3 {
      font-size: 0.875rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .status-card .value {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
    }

    .status-card .label {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .panel {
      background: #1e293b;
      border-radius: 12px;
      border: 1px solid #334155;
      overflow: hidden;
    }

    .panel-header {
      background: #0f172a;
      padding: 1.5rem;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .panel-header .icon {
      font-size: 1.5rem;
    }

    .panel-body {
      padding: 1.5rem;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #334155;
    }

    .metric-row:last-child {
      border-bottom: none;
    }

    .metric-label {
      color: #94a3b8;
    }

    .metric-value {
      font-weight: 600;
      color: #e4e4e7;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .badge-success {
      background: #10b981;
      color: #fff;
    }

    .badge-warning {
      background: #f59e0b;
      color: #fff;
    }

    .badge-info {
      background: #3b82f6;
      color: #fff;
    }

    .recommendation {
      background: #0f172a;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      border-left: 4px solid #667eea;
    }

    .recommendation:last-child {
      margin-bottom: 0;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }

    .spinner {
      border: 3px solid #334155;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }

    .agent-card {
      background: #0f172a;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #334155;
    }

    .agent-name {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #667eea;
    }

    .agent-stat {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }

    .refresh-indicator {
      position: fixed;
      top: 1rem;
      right: 1rem;
      background: #1e293b;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      border: 1px solid #334155;
      font-size: 0.875rem;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <div>
        <h1>🎯 Trinity Dashboard</h1>
        <p>Real-time monitoring for your Trinity Method deployment</p>
      </div>
      <div style="display: flex; gap: 1rem;">
        <button id="analytics-reports-btn" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          📊 Analytics Reports
        </button>
        <button id="learning-exports-btn" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          🧠 Learning Exports
        </button>
        <button id="trinity-docs-btn" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          📄 Trinity Docs
        </button>
        <button id="knowledge-base-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          📚 Knowledge Base
        </button>
      </div>
    </div>
  </div>

  <div class="refresh-indicator">
    Auto-refresh: <span id="countdown">30</span>s
  </div>

  <!-- Trinity Docs Modal -->
  <div id="trinity-docs-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
    <div style="max-width: 900px; margin: 2rem auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155;">
      <div style="padding: 2rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.5rem; color: #e4e4e7;">📄 Trinity Documentation</h2>
        <button id="close-trinity-docs-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>
      <div id="trinity-docs-content" style="padding: 2rem;">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading Trinity docs...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Analytics Reports Modal -->
  <div id="analytics-reports-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
    <div style="max-width: 900px; margin: 2rem auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155;">
      <div style="padding: 2rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.5rem; color: #e4e4e7;">📊 Analytics Reports</h2>
        <button id="close-analytics-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>
      <div id="analytics-reports-content" style="padding: 2rem;">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading analytics reports...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Learning Exports Modal -->
  <div id="learning-exports-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
    <div style="max-width: 900px; margin: 2rem auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155;">
      <div style="padding: 2rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.5rem; color: #e4e4e7;">🧠 Learning Exports</h2>
        <button id="close-learning-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>
      <div id="learning-exports-content" style="padding: 2rem;">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading learning exports...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Knowledge Base Modal -->
  <div id="knowledge-base-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
    <div style="max-width: 900px; margin: 2rem auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155;">
      <div style="padding: 2rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.5rem; color: #e4e4e7;">📚 Knowledge Base</h2>
        <button id="close-modal-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>
      <div id="knowledge-base-content" style="padding: 2rem;">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading knowledge base...</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="status-bar">
      <div class="status-card">
        <h3>System Status</h3>
        <div class="value" id="system-status">—</div>
        <div class="label">Trinity Health</div>
      </div>
      <div class="status-card">
        <h3>Cache Hit Rate</h3>
        <div class="value" id="cache-hit-rate">—</div>
        <div class="label">Overall Performance</div>
      </div>
      <div class="status-card">
        <h3>Total Patterns</h3>
        <div class="value" id="total-patterns">—</div>
        <div class="label">Learned Knowledge</div>
      </div>
      <div class="status-card">
        <h3>Investigations</h3>
        <div class="value" id="total-investigations">—</div>
        <div class="label">Completed</div>
      </div>
      <div class="status-card">
        <h3>Work Orders</h3>
        <div class="value" id="total-work-orders">—</div>
        <div class="label">Active</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Cache Performance Panel -->
      <div class="panel">
        <div class="panel-header">
          <h2>Cache Performance</h2>
          <span class="icon">📦</span>
        </div>
        <div class="panel-body" id="cache-panel">
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading cache metrics...</p>
          </div>
        </div>
      </div>

      <!-- Learning System Panel -->
      <div class="panel">
        <div class="panel-header">
          <h2>Learning System</h2>
          <span class="icon">🧠</span>
        </div>
        <div class="panel-body" id="learning-panel">
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading learning metrics...</p>
          </div>
        </div>
      </div>

      <!-- Analytics Panel -->
      <div class="panel">
        <div class="panel-header">
          <h2>Analytics</h2>
          <span class="icon">📊</span>
        </div>
        <div class="panel-body" id="analytics-panel">
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>

      <!-- Investigations Panel -->
      <div class="panel">
        <div class="panel-header">
          <h2>Investigations</h2>
          <span class="icon">🔍</span>
        </div>
        <div class="panel-body" id="investigations-panel">
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading investigations...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let refreshInterval;
    let countdown = 30;

    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [health, cache, learning, analytics, investigations, workOrders] = await Promise.all([
          fetch('/api/health').then(r => r.json()),
          fetch('/api/cache/stats').then(r => r.json()),
          fetch('/api/learning/metrics').then(r => r.json()),
          fetch('/api/analytics/summary').then(r => r.json()),
          fetch('/api/investigations/list').then(r => r.json()),
          fetch('/api/work-orders/list').then(r => r.json())
        ]);

        updateDashboard({ health, cache, learning, analytics, investigations, workOrders });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    function updateDashboard(data) {
      // Update status bar
      document.getElementById('system-status').innerHTML =
        data.health.status === 'healthy'
          ? '<span class="badge badge-success">Healthy</span>'
          : '<span class="badge badge-warning">Degraded</span>';

      document.getElementById('cache-hit-rate').textContent =
        (data.cache.overall?.hitRate * 100 || 0).toFixed(1) + '%';

      document.getElementById('total-patterns').textContent =
        data.learning.totalPatterns || 0;

      document.getElementById('total-investigations').textContent =
        data.investigations.total || 0;

      document.getElementById('total-work-orders').textContent =
        data.workOrders.total || 0;

      // Update cache panel
      updateCachePanel(data.cache);

      // Update learning panel
      updateLearningPanel(data.learning);

      // Update analytics panel
      updateAnalyticsPanel(data.analytics);

      // Update investigations panel
      updateInvestigationsPanel(data.investigations);
    }

    function updateCachePanel(cache) {
      const panel = document.getElementById('cache-panel');

      if (!cache.enabled) {
        panel.innerHTML = '<p style="text-align: center; color: #94a3b8;">Cache not initialized</p>';
        return;
      }

      panel.innerHTML = \`
        <div class="metric-row">
          <span class="metric-label">Hit Rate</span>
          <span class="metric-value">\${(cache.overall.hitRate * 100).toFixed(1)}%</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Total Hits</span>
          <span class="metric-value">\${cache.overall.totalHits.toLocaleString()}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Tokens Saved</span>
          <span class="metric-value">\${cache.overall.tokensSaved.toLocaleString()}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">L1 Hits</span>
          <span class="metric-value">\${cache.tiers.l1.hits}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">L2 Hits</span>
          <span class="metric-value">\${cache.tiers.l2.hits}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">L3 Hits</span>
          <span class="metric-value">\${cache.tiers.l3.hits}</span>
        </div>
        <div style="margin-top: 1rem;">
          <h4 style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.75rem;">Health</h4>
          \${cache.health.recommendations.map(rec =>
            \`<div class="recommendation">💡 \${rec}</div>\`
          ).join('')}
        </div>
      \`;
    }

    function updateLearningPanel(learning) {
      const panel = document.getElementById('learning-panel');

      if (!learning.enabled) {
        panel.innerHTML = '<p style="text-align: center; color: #94a3b8;">Learning not initialized</p>';
        return;
      }

      const agents = Object.entries(learning.agents || {});

      panel.innerHTML = \`
        <div class="metric-row">
          <span class="metric-label">Total Patterns</span>
          <span class="metric-value">\${learning.totalPatterns}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Total Insights</span>
          <span class="metric-value">\${learning.totalInsights}</span>
        </div>
        <div style="margin-top: 1rem;">
          <h4 style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.75rem;">Agents</h4>
          <div class="agent-grid">
            \${agents.map(([name, data]) => \`
              <div class="agent-card">
                <div class="agent-name">\${name}</div>
                <div class="agent-stat">\${data.patterns} patterns</div>
                <div class="agent-stat">\${data.progress}</div>
              </div>
            \`).join('')}
          </div>
        </div>
        \${learning.recommendations?.length > 0 ? \`
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.75rem;">Recommendations</h4>
            \${learning.recommendations.map(rec =>
              \`<div class="recommendation">💡 \${rec}</div>\`
            ).join('')}
          </div>
        \` : ''}
      \`;
    }

    function updateAnalyticsPanel(analytics) {
      const panel = document.getElementById('analytics-panel');

      if (!analytics.enabled) {
        panel.innerHTML = '<p style="text-align: center; color: #94a3b8;">Analytics not initialized</p>';
        return;
      }

      panel.innerHTML = \`
        <div class="metric-row">
          <span class="metric-label">Project</span>
          <span class="metric-value">\${analytics.projectName}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Framework</span>
          <span class="metric-value">\${analytics.framework}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Total Sessions</span>
          <span class="metric-value">\${analytics.totalSessions}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Performance Events</span>
          <span class="metric-value">\${analytics.totalPerformanceEvents}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Anomalies Detected</span>
          <span class="metric-value">\${analytics.totalAnomalies}</span>
        </div>
        \${analytics.recommendations?.length > 0 ? \`
          <div style="margin-top: 1rem;">
            \${analytics.recommendations.map(rec =>
              \`<div class="recommendation">💡 \${rec}</div>\`
            ).join('')}
          </div>
        \` : ''}
      \`;
    }

    function updateInvestigationsPanel(investigations) {
      const panel = document.getElementById('investigations-panel');

      if (investigations.total === 0) {
        panel.innerHTML = '<p style="text-align: center; color: #94a3b8;">No investigations yet</p>';
        return;
      }

      panel.innerHTML = \`
        <div class="metric-row">
          <span class="metric-label">Total Investigations</span>
          <span class="metric-value">\${investigations.total}</span>
        </div>
        <div style="margin-top: 1rem;">
          <h4 style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.75rem;">Recent</h4>
          \${investigations.investigations.slice(0, 5).map(inv => \`
            <div class="metric-row">
              <span class="metric-label">\${inv.name}</span>
              <span class="metric-value" style="font-size: 0.75rem; color: #64748b;">\${inv.filename}</span>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    // Auto-refresh countdown
    function startCountdown() {
      countdown = 30;
      if (refreshInterval) clearInterval(refreshInterval);

      refreshInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;

        if (countdown <= 0) {
          fetchData();
          countdown = 30;
        }
      }, 1000);
    }

    // Knowledge Base Modal
    const modal = document.getElementById('knowledge-base-modal');
    const kbBtn = document.getElementById('knowledge-base-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const kbContent = document.getElementById('knowledge-base-content');

    kbBtn.addEventListener('click', async () => {
      modal.style.display = 'block';
      kbContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading knowledge base...</p></div>';

      try {
        const response = await fetch('/api/knowledge-base');
        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
          kbContent.innerHTML = data.documents.map((doc, index) => \`
            <div class="kb-document" style="margin-bottom: 1rem;">
              <div class="kb-header" onclick="toggleKbDoc(\${index})" style="background: #0f172a; padding: 1rem 1.5rem; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
                <h3 style="font-size: 1.125rem; color: #667eea; margin: 0;">\${doc.name}</h3>
                <span id="kb-toggle-\${index}" style="color: #94a3b8; font-size: 1.25rem;">▼</span>
              </div>
              <div id="kb-content-\${index}" class="kb-content" style="display: none; background: #0f172a; padding: 1.5rem; margin-top: 0.5rem; border-radius: 8px; border: 1px solid #334155; max-height: 500px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; color: #e4e4e7; font-family: 'Courier New', monospace; font-size: 0.875rem; line-height: 1.5;">\${doc.content}</pre>
              </div>
            </div>
          \`).join('');
        } else {
          kbContent.innerHTML = '<p style="text-align: center; color: #94a3b8;">No knowledge base documents found</p>';
        }
      } catch (error) {
        kbContent.innerHTML = \`<p style="text-align: center; color: #f87171;">Error loading knowledge base: \${error.message}</p>\`;
      }
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Trinity Docs Modal
    const trinityDocsModal = document.getElementById('trinity-docs-modal');
    const trinityDocsBtn = document.getElementById('trinity-docs-btn');
    const closeTrinityDocsBtn = document.getElementById('close-trinity-docs-btn');
    const trinityDocsContent = document.getElementById('trinity-docs-content');

    trinityDocsBtn.addEventListener('click', async () => {
      trinityDocsModal.style.display = 'block';
      trinityDocsContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading Trinity docs...</p></div>';

      try {
        const response = await fetch('/api/trinity-docs');
        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
          trinityDocsContent.innerHTML = data.documents.map((doc, index) => \`
            <div class="kb-document" style="margin-bottom: 1rem;">
              <div class="kb-header" onclick="toggleTrinityDoc(\${index})" style="background: #0f172a; padding: 1rem 1.5rem; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
                <div>
                  <h3 style="font-size: 1.125rem; color: #f093fb; margin: 0;">\${doc.name}</h3>
                  <p style="font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0 0;">\${doc.path}</p>
                </div>
                <span id="trinity-toggle-\${index}" style="color: #94a3b8; font-size: 1.25rem;">▼</span>
              </div>
              <div id="trinity-content-\${index}" class="kb-content" style="display: none; background: #0f172a; padding: 1.5rem; margin-top: 0.5rem; border-radius: 8px; border: 1px solid #334155; max-height: 500px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; color: #e4e4e7; font-family: 'Courier New', monospace; font-size: 0.875rem; line-height: 1.5;">\${doc.content}</pre>
              </div>
            </div>
          \`).join('');
        } else {
          trinityDocsContent.innerHTML = '<p style="text-align: center; color: #94a3b8;">No Trinity documentation found</p>';
        }
      } catch (error) {
        trinityDocsContent.innerHTML = \`<p style="text-align: center; color: #f87171;">Error loading Trinity docs: \${error.message}</p>\`;
      }
    });

    closeTrinityDocsBtn.addEventListener('click', () => {
      trinityDocsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    trinityDocsModal.addEventListener('click', (e) => {
      if (e.target === trinityDocsModal) {
        trinityDocsModal.style.display = 'none';
      }
    });

    // Toggle Trinity doc
    window.toggleTrinityDoc = function(index) {
      const content = document.getElementById(\`trinity-content-\${index}\`);
      const toggle = document.getElementById(\`trinity-toggle-\${index}\`);

      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▲';
      } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
      }
    };

    // Toggle knowledge base document
    window.toggleKbDoc = function(index) {
      const content = document.getElementById(\`kb-content-\${index}\`);
      const toggle = document.getElementById(\`kb-toggle-\${index}\`);

      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▲';
      } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
      }
    };

    // Analytics Reports Modal
    const analyticsModal = document.getElementById('analytics-reports-modal');
    const analyticsBtn = document.getElementById('analytics-reports-btn');
    const closeAnalyticsBtn = document.getElementById('close-analytics-btn');
    const analyticsContent = document.getElementById('analytics-reports-content');

    analyticsBtn.addEventListener('click', async () => {
      analyticsModal.style.display = 'block';
      analyticsContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading analytics reports...</p></div>';

      try {
        const response = await fetch('/api/analytics-reports');
        const data = await response.json();

        if (data.reports && data.reports.length > 0) {
          analyticsContent.innerHTML = data.reports.map((report, index) => \`
            <div class="kb-document" style="margin-bottom: 1rem;">
              <div class="kb-header" onclick="toggleAnalyticsReport(\${index})" style="background: #0f172a; padding: 1rem 1.5rem; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
                <div>
                  <h3 style="font-size: 1.125rem; color: #4facfe; margin: 0;">\${report.name}</h3>
                  <p style="font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0 0;">\${new Date(report.modified).toLocaleString()}</p>
                </div>
                <span id="analytics-toggle-\${index}" style="color: #94a3b8; font-size: 1.25rem;">▼</span>
              </div>
              <div id="analytics-content-\${index}" class="kb-content" style="display: none; background: #0f172a; padding: 1.5rem; margin-top: 0.5rem; border-radius: 8px; border: 1px solid #334155; max-height: 500px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; color: #e4e4e7; font-family: 'Courier New', monospace; font-size: 0.875rem; line-height: 1.5;">\${report.content}</pre>
              </div>
            </div>
          \`).join('');
        } else {
          analyticsContent.innerHTML = '<p style="text-align: center; color: #94a3b8;">No analytics reports found</p>';
        }
      } catch (error) {
        analyticsContent.innerHTML = \`<p style="text-align: center; color: #f87171;">Error loading analytics reports: \${error.message}</p>\`;
      }
    });

    closeAnalyticsBtn.addEventListener('click', () => {
      analyticsModal.style.display = 'none';
    });

    analyticsModal.addEventListener('click', (e) => {
      if (e.target === analyticsModal) {
        analyticsModal.style.display = 'none';
      }
    });

    window.toggleAnalyticsReport = function(index) {
      const content = document.getElementById(\`analytics-content-\${index}\`);
      const toggle = document.getElementById(\`analytics-toggle-\${index}\`);
      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▲';
      } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
      }
    };

    // Learning Exports Modal
    const learningModal = document.getElementById('learning-exports-modal');
    const learningBtn = document.getElementById('learning-exports-btn');
    const closeLearningBtn = document.getElementById('close-learning-btn');
    const learningContent = document.getElementById('learning-exports-content');

    learningBtn.addEventListener('click', async () => {
      learningModal.style.display = 'block';
      learningContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading learning exports...</p></div>';

      try {
        const response = await fetch('/api/learning-exports');
        const data = await response.json();

        if (data.exports && data.exports.length > 0) {
          learningContent.innerHTML = data.exports.map((exp, index) => \`
            <div class="kb-document" style="margin-bottom: 1rem;">
              <div class="kb-header" onclick="toggleLearningExport(\${index})" style="background: #0f172a; padding: 1rem 1.5rem; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
                <div>
                  <h3 style="font-size: 1.125rem; color: #43e97b; margin: 0;">\${exp.name}</h3>
                  <p style="font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0 0;">\${new Date(exp.modified).toLocaleString()}</p>
                </div>
                <span id="learning-toggle-\${index}" style="color: #94a3b8; font-size: 1.25rem;">▼</span>
              </div>
              <div id="learning-content-\${index}" class="kb-content" style="display: none; background: #0f172a; padding: 1.5rem; margin-top: 0.5rem; border-radius: 8px; border: 1px solid #334155; max-height: 500px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; color: #e4e4e7; font-family: 'Courier New', monospace; font-size: 0.875rem; line-height: 1.5;">\${exp.content}</pre>
              </div>
            </div>
          \`).join('');
        } else {
          learningContent.innerHTML = '<p style="text-align: center; color: #94a3b8;">No learning exports found</p>';
        }
      } catch (error) {
        learningContent.innerHTML = \`<p style="text-align: center; color: #f87171;">Error loading learning exports: \${error.message}</p>\`;
      }
    });

    closeLearningBtn.addEventListener('click', () => {
      learningModal.style.display = 'none';
    });

    learningModal.addEventListener('click', (e) => {
      if (e.target === learningModal) {
        learningModal.style.display = 'none';
      }
    });

    window.toggleLearningExport = function(index) {
      const content = document.getElementById(\`learning-content-\${index}\`);
      const toggle = document.getElementById(\`learning-toggle-\${index}\`);
      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▲';
      } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
      }
    };

    // Initial load
    fetchData();
    startCountdown();
  </script>
</body>
</html>`;
  }
}
