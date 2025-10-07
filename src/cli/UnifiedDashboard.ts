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
      const fs = await import('fs-extra');
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
      const fs = await import('fs-extra');
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
      const fs = await import('fs-extra');
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
      const fs = await import('fs-extra');
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
   * Handle health check API request
   */
  private async handleHealthCheck(req: Request, res: Response): Promise<void> {
    const fs = await import('fs-extra');

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
    <h1>🎯 Trinity Dashboard</h1>
    <p>Real-time monitoring for your Trinity Method deployment</p>
  </div>

  <div class="refresh-indicator">
    Auto-refresh: <span id="countdown">30</span>s
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
        const [health, cache, learning, analytics, investigations] = await Promise.all([
          fetch('/api/health').then(r => r.json()),
          fetch('/api/cache/stats').then(r => r.json()),
          fetch('/api/learning/metrics').then(r => r.json()),
          fetch('/api/analytics/summary').then(r => r.json()),
          fetch('/api/investigations/list').then(r => r.json())
        ]);

        updateDashboard({ health, cache, learning, analytics, investigations });
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
              <span class="badge badge-info">View</span>
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

    // Initial load
    fetchData();
    startCountdown();
  </script>
</body>
</html>`;
  }
}
