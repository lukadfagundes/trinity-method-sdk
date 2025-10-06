/**
 * Metrics Collector - Investigation Event Tracking
 *
 * Collects comprehensive metrics from all investigation events:
 * - Investigation performance (duration, tasks, errors)
 * - Token usage (input, output, total, cost)
 * - Agent utilization (tasks, duration, success rate)
 * - Cache performance (hit rate, time savings)
 * - Learning effectiveness (improvement trends)
 *
 * Features:
 * - Real-time event tracking (<1s latency)
 * - Time-series data storage
 * - 100% event coverage
 * - Agent instrumentation
 * - Efficient aggregation
 *
 * Success Criteria:
 * - 100% event coverage
 * - <1s metric latency
 * - Integration with all agents
 *
 * @module analytics/MetricsCollector
 * @version 1.0.0
 */

import * as fs from 'fs/promises';
import * as path from 'path';

import { AgentType } from '@shared/types';

/**
 * Investigation metrics
 */
export interface InvestigationMetrics {
  /** Investigation ID */
  investigationId: string;

  /** Start timestamp */
  startTime: Date;

  /** End timestamp */
  endTime?: Date;

  /** Duration in milliseconds */
  duration: number;

  /** Tokens used */
  tokensUsed: number;

  /** Input tokens */
  inputTokens: number;

  /** Output tokens */
  outputTokens: number;

  /** Estimated cost (USD) */
  cost: number;

  /** Agent utilization */
  agentUtilization: Map<string, AgentMetrics>;

  /** Tasks completed */
  tasksCompleted: number;

  /** Tasks failed */
  tasksFailed: number;

  /** Error rate (0-1) */
  errorRate: number;

  /** Cache hit rate (0-1) */
  cacheHitRate: number;

  /** Quality score (0-100) */
  qualityScore: number;

  /** Investigation type */
  type?: string;

  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Agent-specific metrics
 */
export interface AgentMetrics {
  /** Agent ID */
  agentId: string;

  /** Agent type */
  agentType: AgentType;

  /** Tasks assigned */
  tasksAssigned: number;

  /** Tasks completed */
  tasksCompleted: number;

  /** Average task duration (ms) */
  averageTaskDuration: number;

  /** Tokens used */
  tokensUsed: number;

  /** Input tokens */
  inputTokens: number;

  /** Output tokens */
  outputTokens: number;

  /** Error count */
  errorCount: number;

  /** Success rate (0-1) */
  successRate: number;

  /** Utilization (0-1) */
  utilization: number;

  /** Total active time (ms) */
  activeTime: number;
}

/**
 * Metric event
 */
export interface MetricEvent {
  /** Event ID */
  id: string;

  /** Timestamp */
  timestamp: Date;

  /** Event type */
  type: MetricEventType;

  /** Investigation ID */
  investigationId: string;

  /** Agent ID (if applicable) */
  agentId?: string;

  /** Agent type (if applicable) */
  agentType?: AgentType;

  /** Event data */
  data: Record<string, any>;

  /** Duration (ms) - for timed events */
  duration?: number;
}

/**
 * Metric event types
 */
export type MetricEventType =
  | 'investigation-start'
  | 'investigation-end'
  | 'investigation-error'
  | 'task-start'
  | 'task-complete'
  | 'task-error'
  | 'agent-start'
  | 'agent-complete'
  | 'agent-error'
  | 'token-usage'
  | 'cache-hit'
  | 'cache-miss'
  | 'learning-update'
  | 'quality-assessment'
  | 'phase-start'
  | 'phase-complete';

/**
 * Time-series metric data point
 */
export interface MetricDataPoint {
  /** Timestamp */
  timestamp: Date;

  /** Metric name */
  metric: string;

  /** Metric value */
  value: number;

  /** Labels for grouping */
  labels: Record<string, string>;
}

/**
 * Metrics collector with real-time tracking
 */
export class MetricsCollector {
  private events: MetricEvent[] = [];
  private investigations: Map<string, InvestigationMetrics> = new Map();
  private timeSeriesData: MetricDataPoint[] = [];
  private storageDir: string;
  private autoSaveEnabled: boolean = true;
  private saveThreshold: number = 100; // Save every 100 events

  constructor(storageDir: string = './trinity/analytics') {
    this.storageDir = storageDir;
  }

  /**
   * Record a metric event
   * @param event - Metric event
   */
  async recordEvent(event: Omit<MetricEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: MetricEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.events.push(fullEvent);

    // Update investigation metrics in real-time
    this.updateInvestigationMetrics(fullEvent);

    // Add to time series
    this.addToTimeSeries(fullEvent);

    // Auto-save if threshold reached
    if (this.autoSaveEnabled && this.events.length % this.saveThreshold === 0) {
      await this.save();
    }
  }

  /**
   * Start tracking an investigation
   * @param investigationId - Investigation ID
   * @param type - Investigation type
   */
  async startInvestigation(investigationId: string, type?: string): Promise<void> {
    const metrics: InvestigationMetrics = {
      investigationId,
      startTime: new Date(),
      duration: 0,
      tokensUsed: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
      agentUtilization: new Map(),
      tasksCompleted: 0,
      tasksFailed: 0,
      errorRate: 0,
      cacheHitRate: 0,
      qualityScore: 0,
      type,
    };

    this.investigations.set(investigationId, metrics);

    await this.recordEvent({
      type: 'investigation-start',
      investigationId,
      data: { type },
    });
  }

  /**
   * End tracking an investigation
   * @param investigationId - Investigation ID
   * @param qualityScore - Quality score (0-100)
   */
  async endInvestigation(investigationId: string, qualityScore?: number): Promise<void> {
    const metrics = this.investigations.get(investigationId);

    if (!metrics) {
      throw new Error(`Investigation ${investigationId} not being tracked`);
    }

    metrics.endTime = new Date();
    metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();

    if (qualityScore !== undefined) {
      metrics.qualityScore = qualityScore;
    }

    // Calculate error rate
    const totalTasks = metrics.tasksCompleted + metrics.tasksFailed;
    metrics.errorRate = totalTasks > 0 ? metrics.tasksFailed / totalTasks : 0;

    await this.recordEvent({
      type: 'investigation-end',
      investigationId,
      data: {
        duration: metrics.duration,
        qualityScore: metrics.qualityScore,
      },
      duration: metrics.duration,
    });
  }

  /**
   * Record task start
   * @param investigationId - Investigation ID
   * @param taskId - Task ID
   * @param agentId - Agent ID
   * @param agentType - Agent type
   */
  async recordTaskStart(
    investigationId: string,
    taskId: string,
    agentId: string,
    agentType: AgentType
  ): Promise<void> {
    const metrics = this.getOrCreateInvestigationMetrics(investigationId);
    const agentMetrics = this.getOrCreateAgentMetrics(metrics, agentId, agentType);

    agentMetrics.tasksAssigned++;

    await this.recordEvent({
      type: 'task-start',
      investigationId,
      agentId,
      agentType,
      data: { taskId },
    });
  }

  /**
   * Record task completion
   * @param investigationId - Investigation ID
   * @param taskId - Task ID
   * @param agentId - Agent ID
   * @param duration - Task duration (ms)
   * @param tokensUsed - Tokens used
   */
  async recordTaskComplete(
    investigationId: string,
    taskId: string,
    agentId: string,
    duration: number,
    tokensUsed?: { input: number; output: number }
  ): Promise<void> {
    const metrics = this.getOrCreateInvestigationMetrics(investigationId);
    const agentMetrics = this.getAgentMetrics(metrics, agentId);

    if (agentMetrics) {
      agentMetrics.tasksCompleted++;
      agentMetrics.activeTime += duration;

      // Update average task duration
      agentMetrics.averageTaskDuration =
        agentMetrics.activeTime / agentMetrics.tasksCompleted;

      // Update success rate
      agentMetrics.successRate = agentMetrics.tasksCompleted / agentMetrics.tasksAssigned;

      // Update tokens
      if (tokensUsed) {
        agentMetrics.inputTokens += tokensUsed.input;
        agentMetrics.outputTokens += tokensUsed.output;
        agentMetrics.tokensUsed += tokensUsed.input + tokensUsed.output;

        metrics.inputTokens += tokensUsed.input;
        metrics.outputTokens += tokensUsed.output;
        metrics.tokensUsed += tokensUsed.input + tokensUsed.output;

        // Calculate cost (Claude Sonnet pricing)
        const inputCost = (tokensUsed.input * 3) / 1_000_000;
        const outputCost = (tokensUsed.output * 15) / 1_000_000;
        metrics.cost += inputCost + outputCost;
      }
    }

    metrics.tasksCompleted++;

    await this.recordEvent({
      type: 'task-complete',
      investigationId,
      agentId,
      data: { taskId, tokensUsed },
      duration,
    });
  }

  /**
   * Record task error
   * @param investigationId - Investigation ID
   * @param taskId - Task ID
   * @param agentId - Agent ID
   * @param error - Error message
   */
  async recordTaskError(
    investigationId: string,
    taskId: string,
    agentId: string,
    error: string
  ): Promise<void> {
    const metrics = this.getOrCreateInvestigationMetrics(investigationId);
    const agentMetrics = this.getAgentMetrics(metrics, agentId);

    if (agentMetrics) {
      agentMetrics.errorCount++;
      agentMetrics.successRate = agentMetrics.tasksCompleted / agentMetrics.tasksAssigned;
    }

    metrics.tasksFailed++;

    await this.recordEvent({
      type: 'task-error',
      investigationId,
      agentId,
      data: { taskId, error },
    });
  }

  /**
   * Record token usage
   * @param investigationId - Investigation ID
   * @param agentId - Agent ID
   * @param inputTokens - Input tokens
   * @param outputTokens - Output tokens
   */
  async recordTokenUsage(
    investigationId: string,
    agentId: string,
    inputTokens: number,
    outputTokens: number
  ): Promise<void> {
    await this.recordEvent({
      type: 'token-usage',
      investigationId,
      agentId,
      data: { inputTokens, outputTokens },
    });
  }

  /**
   * Record cache hit
   * @param investigationId - Investigation ID
   * @param cacheKey - Cache key
   */
  async recordCacheHit(investigationId: string, cacheKey: string): Promise<void> {
    const metrics = this.getOrCreateInvestigationMetrics(investigationId);

    // Update cache hit rate (simplified - would use proper statistics)
    const totalCacheEvents = this.events.filter(
      (e) =>
        e.investigationId === investigationId && (e.type === 'cache-hit' || e.type === 'cache-miss')
    ).length;

    const cacheHits = this.events.filter(
      (e) => e.investigationId === investigationId && e.type === 'cache-hit'
    ).length;

    metrics.cacheHitRate = totalCacheEvents > 0 ? (cacheHits + 1) / (totalCacheEvents + 1) : 1;

    await this.recordEvent({
      type: 'cache-hit',
      investigationId,
      data: { cacheKey },
    });
  }

  /**
   * Record cache miss
   * @param investigationId - Investigation ID
   * @param cacheKey - Cache key
   */
  async recordCacheMiss(investigationId: string, cacheKey: string): Promise<void> {
    const metrics = this.getOrCreateInvestigationMetrics(investigationId);

    const totalCacheEvents = this.events.filter(
      (e) =>
        e.investigationId === investigationId && (e.type === 'cache-hit' || e.type === 'cache-miss')
    ).length;

    const cacheHits = this.events.filter(
      (e) => e.investigationId === investigationId && e.type === 'cache-hit'
    ).length;

    metrics.cacheHitRate = totalCacheEvents > 0 ? cacheHits / (totalCacheEvents + 1) : 0;

    await this.recordEvent({
      type: 'cache-miss',
      investigationId,
      data: { cacheKey },
    });
  }

  /**
   * Get metrics for an investigation
   * @param investigationId - Investigation ID
   * @returns Investigation metrics
   */
  getInvestigationMetrics(investigationId: string): InvestigationMetrics | undefined {
    return this.investigations.get(investigationId);
  }

  /**
   * Get all investigation metrics
   * @returns All investigation metrics
   */
  getAllInvestigationMetrics(): InvestigationMetrics[] {
    return Array.from(this.investigations.values());
  }

  /**
   * Get all events
   * @returns All metric events
   */
  getAllEvents(): MetricEvent[] {
    return [...this.events];
  }

  /**
   * Get events for investigation
   * @param investigationId - Investigation ID
   * @returns Events for investigation
   */
  getInvestigationEvents(investigationId: string): MetricEvent[] {
    return this.events.filter((e) => e.investigationId === investigationId);
  }

  /**
   * Get time series data
   * @param metric - Metric name (optional)
   * @param startTime - Start time filter (optional)
   * @param endTime - End time filter (optional)
   * @returns Time series data points
   */
  getTimeSeriesData(metric?: string, startTime?: Date, endTime?: Date): MetricDataPoint[] {
    let data = [...this.timeSeriesData];

    if (metric) {
      data = data.filter((d) => d.metric === metric);
    }

    if (startTime) {
      data = data.filter((d) => d.timestamp >= startTime);
    }

    if (endTime) {
      data = data.filter((d) => d.timestamp <= endTime);
    }

    return data;
  }

  /**
   * Save metrics to disk
   */
  async save(): Promise<void> {
    await fs.mkdir(this.storageDir, { recursive: true });

    // Save events
    const eventsPath = path.join(this.storageDir, 'events.json');
    await fs.writeFile(eventsPath, JSON.stringify(this.serializeEvents(), null, 2));

    // Save investigation metrics
    const metricsPath = path.join(this.storageDir, 'investigations.json');
    await fs.writeFile(metricsPath, JSON.stringify(this.serializeInvestigations(), null, 2));

    // Save time series
    const timeSeriesPath = path.join(this.storageDir, 'timeseries.json');
    await fs.writeFile(timeSeriesPath, JSON.stringify(this.timeSeriesData, null, 2));
  }

  /**
   * Load metrics from disk
   */
  async load(): Promise<void> {
    try {
      // Load events
      const eventsPath = path.join(this.storageDir, 'events.json');
      const eventsData = await fs.readFile(eventsPath, 'utf-8');
      this.events = this.deserializeEvents(JSON.parse(eventsData) as MetricEvent[]);

      // Load investigation metrics
      const metricsPath = path.join(this.storageDir, 'investigations.json');
      const metricsData = await fs.readFile(metricsPath, 'utf-8');
      this.investigations = this.deserializeInvestigations(JSON.parse(metricsData) as InvestigationMetrics[]);

      // Load time series
      const timeSeriesPath = path.join(this.storageDir, 'timeseries.json');
      const timeSeriesData = await fs.readFile(timeSeriesPath, 'utf-8');
      this.timeSeriesData = JSON.parse(timeSeriesData) as MetricDataPoint[];
    } catch (error) {
      // Files don't exist yet - that's okay
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.events = [];
    this.investigations.clear();
    this.timeSeriesData = [];
  }

  /**
   * Update investigation metrics from event
   */
  private updateInvestigationMetrics(_event: MetricEvent): void {
    // Real-time metric updates handled in specific record methods
  }

  /**
   * Add event to time series
   */
  private addToTimeSeries(event: MetricEvent): void {
    // Extract numeric values from event data
    for (const [key, value] of Object.entries(event.data)) {
      if (typeof value === 'number') {
        this.timeSeriesData.push({
          timestamp: event.timestamp,
          metric: `${event.type}.${key}`,
          value,
          labels: {
            investigationId: event.investigationId,
            agentId: event.agentId || 'system',
            eventType: event.type,
          },
        });
      }
    }

    // Add duration if present
    if (event.duration !== undefined) {
      this.timeSeriesData.push({
        timestamp: event.timestamp,
        metric: `${event.type}.duration`,
        value: event.duration,
        labels: {
          investigationId: event.investigationId,
          agentId: event.agentId || 'system',
          eventType: event.type,
        },
      });
    }
  }

  /**
   * Get or create investigation metrics
   */
  private getOrCreateInvestigationMetrics(investigationId: string): InvestigationMetrics {
    let metrics = this.investigations.get(investigationId);

    if (!metrics) {
      metrics = {
        investigationId,
        startTime: new Date(),
        duration: 0,
        tokensUsed: 0,
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
        agentUtilization: new Map(),
        tasksCompleted: 0,
        tasksFailed: 0,
        errorRate: 0,
        cacheHitRate: 0,
        qualityScore: 0,
      };
      this.investigations.set(investigationId, metrics);
    }

    return metrics;
  }

  /**
   * Get or create agent metrics
   */
  private getOrCreateAgentMetrics(
    investigationMetrics: InvestigationMetrics,
    agentId: string,
    agentType: AgentType
  ): AgentMetrics {
    let agentMetrics = investigationMetrics.agentUtilization.get(agentId);

    if (!agentMetrics) {
      agentMetrics = {
        agentId,
        agentType,
        tasksAssigned: 0,
        tasksCompleted: 0,
        averageTaskDuration: 0,
        tokensUsed: 0,
        inputTokens: 0,
        outputTokens: 0,
        errorCount: 0,
        successRate: 0,
        utilization: 0,
        activeTime: 0,
      };
      investigationMetrics.agentUtilization.set(agentId, agentMetrics);
    }

    return agentMetrics;
  }

  /**
   * Get agent metrics
   */
  private getAgentMetrics(
    investigationMetrics: InvestigationMetrics,
    agentId: string
  ): AgentMetrics | undefined {
    return investigationMetrics.agentUtilization.get(agentId);
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Serialize events for JSON storage
   */
  private serializeEvents(): Array<Omit<MetricEvent, 'timestamp'> & { timestamp: string }> {
    return this.events.map((e) => ({
      ...e,
      timestamp: e.timestamp.toISOString(),
    }));
  }

  /**
   * Deserialize events from JSON
   */
  private deserializeEvents(data: MetricEvent[]): MetricEvent[] {
    return data.map((e) => ({
      ...e,
      timestamp: new Date((e as unknown as { timestamp: string }).timestamp),
    }));
  }

  /**
   * Serialize investigations for JSON storage
   */
  private serializeInvestigations(): Array<Omit<InvestigationMetrics, 'startTime' | 'endTime' | 'agentUtilization'> & {
    startTime: string;
    endTime?: string;
    agentUtilization: Record<string, AgentMetrics>;
  }> {
    return Array.from(this.investigations.values()).map((inv) => ({
      ...inv,
      startTime: inv.startTime.toISOString(),
      endTime: inv.endTime?.toISOString(),
      agentUtilization: Object.fromEntries(inv.agentUtilization),
    }));
  }

  /**
   * Deserialize investigations from JSON
   */
  private deserializeInvestigations(data: InvestigationMetrics[]): Map<string, InvestigationMetrics> {
    const map = new Map<string, InvestigationMetrics>();

    for (const inv of data) {
      const serialized = inv as unknown as {
        investigationId: string;
        startTime: string;
        endTime?: string;
        agentUtilization: Record<string, AgentMetrics>;
      };

      map.set(serialized.investigationId, {
        ...inv,
        startTime: new Date(serialized.startTime),
        endTime: serialized.endTime ? new Date(serialized.endTime) : undefined,
        agentUtilization: new Map(Object.entries(serialized.agentUtilization)),
      });
    }

    return map;
  }
}
