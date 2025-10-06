/**
 * Anomaly Detector - Performance Anomaly Detection
 *
 * Detects performance anomalies using statistical analysis:
 * - Duration anomalies (unusually slow investigations)
 * - Token usage spikes
 * - Error rate increases
 * - Quality degradation
 * - Cache performance issues
 *
 * Uses z-score and IQR methods for outlier detection.
 *
 * @module analytics/AnomalyDetector
 * @version 1.0.0
 */

import { AnalyticsEngine } from './AnalyticsEngine';
import { InvestigationMetrics } from './MetricsCollector';

/**
 * Anomaly
 */
export interface Anomaly {
  /** Anomaly ID */
  id: string;

  /** Anomaly type */
  type: 'performance' | 'error-rate' | 'token-usage' | 'quality' | 'cache';

  /** Severity */
  severity: 'low' | 'medium' | 'high' | 'critical';

  /** Description */
  description: string;

  /** Detected at */
  detectedAt: Date;

  /** Investigation ID */
  investigationId?: string;

  /** Metric name */
  metric: string;

  /** Expected value */
  expectedValue: number;

  /** Actual value */
  actualValue: number;

  /** Confidence (0-1) */
  confidence: number;

  /** Z-score */
  zScore?: number;
}

/**
 * Detection config
 */
export interface DetectionConfig {
  /** Z-score threshold for outliers */
  zScoreThreshold?: number;

  /** IQR multiplier */
  iqrMultiplier?: number;

  /** Minimum samples for detection */
  minSamples?: number;

  /** Enable specific detection types */
  enabledTypes?: Array<Anomaly['type']>;
}

/**
 * Anomaly detector with statistical analysis
 */
export class AnomalyDetector {
  private engine: AnalyticsEngine;
  private config: Required<DetectionConfig>;
  private detectedAnomalies: Anomaly[] = [];

  constructor(engine: AnalyticsEngine, config: DetectionConfig = {}) {
    this.engine = engine;
    this.config = {
      zScoreThreshold: config.zScoreThreshold || 3.0,
      iqrMultiplier: config.iqrMultiplier || 1.5,
      minSamples: config.minSamples || 10,
      enabledTypes: config.enabledTypes || ['performance', 'error-rate', 'token-usage', 'quality', 'cache'],
    };
  }

  /**
   * Detect anomalies in investigation
   * @param investigation - Investigation metrics
   * @returns Detected anomalies
   */
  detectAnomalies(investigation: InvestigationMetrics): Anomaly[] {
    const systemMetrics = this.engine.getSystemMetrics();
    const anomalies: Anomaly[] = [];

    // Need minimum samples
    if (systemMetrics.totalInvestigations < this.config.minSamples) {
      return [];
    }

    // Performance anomalies
    if (this.isTypeEnabled('performance')) {
      const perfAnomaly = this.detectPerformanceAnomaly(investigation, systemMetrics);
      if (perfAnomaly) anomalies.push(perfAnomaly);
    }

    // Token usage anomalies
    if (this.isTypeEnabled('token-usage')) {
      const tokenAnomaly = this.detectTokenAnomaly(investigation, systemMetrics);
      if (tokenAnomaly) anomalies.push(tokenAnomaly);
    }

    // Error rate anomalies
    if (this.isTypeEnabled('error-rate')) {
      const errorAnomaly = this.detectErrorAnomaly(investigation, systemMetrics);
      if (errorAnomaly) anomalies.push(errorAnomaly);
    }

    // Quality anomalies
    if (this.isTypeEnabled('quality')) {
      const qualityAnomaly = this.detectQualityAnomaly(investigation, systemMetrics);
      if (qualityAnomaly) anomalies.push(qualityAnomaly);
    }

    // Cache anomalies
    if (this.isTypeEnabled('cache')) {
      const cacheAnomaly = this.detectCacheAnomaly(investigation, systemMetrics);
      if (cacheAnomaly) anomalies.push(cacheAnomaly);
    }

    // Store detected anomalies
    this.detectedAnomalies.push(...anomalies);

    return anomalies;
  }

  /**
   * Get all detected anomalies
   */
  getAllAnomalies(): Anomaly[] {
    return [...this.detectedAnomalies];
  }

  /**
   * Get anomalies by severity
   */
  getAnomaliesBySeverity(severity: Anomaly['severity']): Anomaly[] {
    return this.detectedAnomalies.filter((a) => a.severity === severity);
  }

  /**
   * Clear anomalies
   */
  clearAnomalies(): void {
    this.detectedAnomalies = [];
  }

  /**
   * Detect performance anomaly
   */
  private detectPerformanceAnomaly(
    inv: InvestigationMetrics,
    systemMetrics: any
  ): Anomaly | null {
    const avgDuration = systemMetrics.averageDuration;
    const zScore = this.calculateZScore(inv.duration, avgDuration, avgDuration * 0.3);

    if (Math.abs(zScore) > this.config.zScoreThreshold) {
      const severity = this.calculateSeverity(zScore);

      return {
        id: this.generateAnomalyId(),
        type: 'performance',
        severity,
        description: `Investigation duration ${inv.duration > avgDuration ? 'significantly longer' : 'significantly shorter'} than average`,
        detectedAt: new Date(),
        investigationId: inv.investigationId,
        metric: 'duration',
        expectedValue: avgDuration,
        actualValue: inv.duration,
        confidence: this.calculateConfidence(zScore),
        zScore,
      };
    }

    return null;
  }

  /**
   * Detect token usage anomaly
   */
  private detectTokenAnomaly(
    inv: InvestigationMetrics,
    systemMetrics: any
  ): Anomaly | null {
    const avgTokens = systemMetrics.averageTokensPerInvestigation;
    const zScore = this.calculateZScore(inv.tokensUsed, avgTokens, avgTokens * 0.4);

    if (zScore > this.config.zScoreThreshold) {
      return {
        id: this.generateAnomalyId(),
        type: 'token-usage',
        severity: this.calculateSeverity(zScore),
        description: 'Token usage significantly higher than average',
        detectedAt: new Date(),
        investigationId: inv.investigationId,
        metric: 'tokensUsed',
        expectedValue: avgTokens,
        actualValue: inv.tokensUsed,
        confidence: this.calculateConfidence(zScore),
        zScore,
      };
    }

    return null;
  }

  /**
   * Detect error rate anomaly
   */
  private detectErrorAnomaly(
    inv: InvestigationMetrics,
    systemMetrics: any
  ): Anomaly | null {
    const avgErrorRate = systemMetrics.averageErrorRate;

    if (inv.errorRate > avgErrorRate * 2 && inv.errorRate > 0.1) {
      return {
        id: this.generateAnomalyId(),
        type: 'error-rate',
        severity: inv.errorRate > 0.3 ? 'critical' : 'high',
        description: `Error rate (${(inv.errorRate * 100).toFixed(1)}%) significantly higher than average`,
        detectedAt: new Date(),
        investigationId: inv.investigationId,
        metric: 'errorRate',
        expectedValue: avgErrorRate,
        actualValue: inv.errorRate,
        confidence: 0.9,
      };
    }

    return null;
  }

  /**
   * Detect quality anomaly
   */
  private detectQualityAnomaly(
    inv: InvestigationMetrics,
    systemMetrics: any
  ): Anomaly | null {
    const avgQuality = systemMetrics.averageQualityScore;
    const zScore = this.calculateZScore(inv.qualityScore, avgQuality, avgQuality * 0.2);

    if (zScore < -this.config.zScoreThreshold) {
      return {
        id: this.generateAnomalyId(),
        type: 'quality',
        severity: inv.qualityScore < 40 ? 'critical' : 'high',
        description: 'Quality score significantly lower than average',
        detectedAt: new Date(),
        investigationId: inv.investigationId,
        metric: 'qualityScore',
        expectedValue: avgQuality,
        actualValue: inv.qualityScore,
        confidence: this.calculateConfidence(zScore),
        zScore,
      };
    }

    return null;
  }

  /**
   * Detect cache performance anomaly
   */
  private detectCacheAnomaly(
    inv: InvestigationMetrics,
    systemMetrics: any
  ): Anomaly | null {
    const avgCacheHitRate = systemMetrics.averageCacheHitRate;

    if (inv.cacheHitRate < avgCacheHitRate * 0.5 && avgCacheHitRate > 0.3) {
      return {
        id: this.generateAnomalyId(),
        type: 'cache',
        severity: 'medium',
        description: 'Cache hit rate significantly lower than average',
        detectedAt: new Date(),
        investigationId: inv.investigationId,
        metric: 'cacheHitRate',
        expectedValue: avgCacheHitRate,
        actualValue: inv.cacheHitRate,
        confidence: 0.85,
      };
    }

    return null;
  }

  /**
   * Calculate z-score
   */
  private calculateZScore(value: number, mean: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  }

  /**
   * Calculate severity from z-score
   */
  private calculateSeverity(zScore: number): Anomaly['severity'] {
    const absZ = Math.abs(zScore);

    if (absZ > 4.5) return 'critical';
    if (absZ > 4.0) return 'high';
    if (absZ > 3.5) return 'medium';
    return 'low';
  }

  /**
   * Calculate confidence from z-score
   */
  private calculateConfidence(zScore: number): number {
    const absZ = Math.abs(zScore);
    return Math.min(0.99, absZ / 5);
  }

  /**
   * Check if detection type is enabled
   */
  private isTypeEnabled(type: Anomaly['type']): boolean {
    return this.config.enabledTypes.includes(type);
  }

  /**
   * Generate anomaly ID
   */
  private generateAnomalyId(): string {
    return `anom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
