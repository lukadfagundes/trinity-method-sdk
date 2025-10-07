/**
 * Trinity Method SDK - Main Entry Point
 * Complete export of all V2 SDK components
 */

// ========================================
// AGENTS (V2 TypeScript Implementations)
// ========================================
export { SelfImprovingAgent, LearningError } from './agents/SelfImprovingAgent';
export { TANAgent } from './agents/TAN';
export { ZENAgent } from './agents/ZEN';
export { INOAgent } from './agents/INO';
export { JUNOAgent } from './agents/JUNO';
export { EINAgent } from './agents/EIN';
export { AJAgent } from './agents/AJ';
export { ALYAgent } from './agents/ALY';

// ========================================
// CACHE SYSTEM
// ========================================
export { L1Cache } from './cache/L1Cache';
export { L2Cache } from './cache/L2Cache';
export { L3Cache } from './cache/L3Cache';
export { CacheKeyGenerator } from './cache/CacheKeyGenerator';
export { AdvancedCacheManager } from './cache/AdvancedCacheManager';
export { SimilarityDetector } from './cache/SimilarityDetector';

// ========================================
// COORDINATION
// ========================================
export { TaskPoolManager } from './coordination/TaskPoolManager';
export { DependencyResolver } from './coordination/DependencyResolver';
export { AgentMatcher } from './coordination/AgentMatcher';
export { TaskStatusTracker } from './coordination/TaskStatusTracker';

// ========================================
// LEARNING SYSTEM
// ========================================
export { KnowledgeSharingBus } from './learning/KnowledgeSharingBus';
export { LearningDataStore } from './learning/LearningDataStore';
export { PerformanceTracker } from './learning/PerformanceTracker';
export { StrategySelectionEngine } from './learning/StrategySelectionEngine';

// ========================================
// PLANNING
// ========================================
export { InvestigationPlanner } from './planning/InvestigationPlanner';
export { PlanVisualizer } from './planning/PlanVisualizer';
export { ResourceEstimator } from './planning/ResourceEstimator';

// ========================================
// WIZARD SYSTEM
// ========================================
export { ContextDetector } from './wizard/ContextDetector';
export { InvestigationWizard } from './wizard/InvestigationWizard';
export { UserPreferencesManager } from './wizard/UserPreferencesManager';
export { InvestigationTemplate } from './wizard/templates/InvestigationTemplate';
export { SecurityAuditTemplate } from './wizard/templates/SecurityAuditTemplate';
export { PerformanceReviewTemplate } from './wizard/templates/PerformanceReviewTemplate';
export { ArchitectureAnalysisTemplate } from './wizard/templates/ArchitectureAnalysisTemplate';
export { CodeQualityTemplate } from './wizard/templates/CodeQualityTemplate';
export { CustomInvestigationTemplate } from './wizard/templates/CustomInvestigationTemplate';

// ========================================
// REGISTRY
// ========================================
export { InvestigationRegistry } from './registry/InvestigationRegistry';
export { RegistryDashboard } from './registry/RegistryDashboard';
export { RegistryQueryAPI } from './registry/RegistryQueryAPI';

// ========================================
// HOOKS SYSTEM
// ========================================
export { HookExecutor } from './hooks/HookExecutor';
export { HookValidator } from './hooks/HookValidator';
export { TrinityHookLibrary } from './hooks/TrinityHookLibrary';

// ========================================
// CONFIGURATION
// ========================================
export { ConfigurationManager } from './config/ConfigurationManager';
export { ConfigValidator } from './config/ConfigValidator';
export { ConfigWatcher } from './config/ConfigWatcher';

// ========================================
// ANALYTICS
// ========================================
export { MetricsCollector } from './analytics/MetricsCollector';
export { AnalyticsEngine } from './analytics/AnalyticsEngine';
export { AnomalyDetector } from './analytics/AnomalyDetector';

// ========================================
// BENCHMARKING
// ========================================
export { BenchmarkHarness } from './benchmarks/BenchmarkHarness';
export { BenchmarkReporter } from './benchmarks/BenchmarkReporter';
export { CacheBenchmark } from './benchmarks/CacheBenchmark';
export { LearningBenchmark } from './benchmarks/LearningBenchmark';
export { SpeedBenchmark } from './benchmarks/SpeedBenchmark';
export { TokenBenchmark } from './benchmarks/TokenBenchmark';

// ========================================
// UTILITIES
// ========================================
export { Logger } from './utils/Logger';

// ========================================
// CLI DASHBOARDS
// ========================================
export { CacheStatsDashboard } from './cli/CacheStatsDashboard';
export { LearningMetricsDashboard } from './cli/LearningMetricsDashboard';

// ========================================
// SHARED TYPES
// ========================================
export * from './shared/types';
