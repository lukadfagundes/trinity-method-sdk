/**
 * Investigation Registry Types
 *
 * Type definitions for the investigation registry system.
 */

export type InvestigationStatus = 'completed' | 'failed' | 'partial' | 'running';

export interface InvestigationRecord {
  id: string;
  name: string;
  type: string;
  codebase: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: InvestigationStatus;
  agents: string[];
  tokensUsed: number;
  qualityScore?: number;
  tags: string[];
  metadata: Record<string, any>;
  findings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistryQuery {
  type?: string | string[];
  codebase?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  minQualityScore?: number;
  maxQualityScore?: number;
  status?: InvestigationStatus | InvestigationStatus[];
  searchText?: string;
  agents?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'startTime' | 'duration' | 'qualityScore' | 'tokensUsed';
  sortOrder?: 'asc' | 'desc';
}

export interface RegistryQueryResult {
  records: InvestigationRecord[];
  total: number;
  hasMore: boolean;
}

export interface SimilarityResult {
  record: InvestigationRecord;
  similarity: number;
  reasons: string[];
}

export interface RegistryStatistics {
  totalInvestigations: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  avgDuration: number;
  avgTokensUsed: number;
  avgQualityScore: number;
  dateRange: {
    earliest: Date;
    latest: Date;
  };
}
