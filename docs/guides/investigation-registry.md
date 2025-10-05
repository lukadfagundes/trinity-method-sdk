## Investigation Registry

The Trinity Method SDK includes a comprehensive registry system for tracking, querying, and analyzing investigation history.

## Overview

The investigation registry provides:

1. **Automatic Tracking** - All investigations are automatically registered
2. **Fast Search** - Query investigations in <100ms with indexed database
3. **Similarity Matching** - Find similar investigations based on type, codebase, and tags
4. **Knowledge Retention** - Learn from past investigations
5. **Team Collaboration** - Share investigation insights

## Quick Start

### View Investigation History

```bash
# View recent investigations
/trinity-history

# View statistics
/trinity-history --stats

# View specific investigation
/trinity-history --id INV-001
```

### Search Investigations

```bash
# Search by text
/trinity-history --search "authentication"

# Filter by type
/trinity-history --type security-audit

# Filter by tag
/trinity-history --tag "high-priority"

# Filter by status
/trinity-history --status completed

# Combine filters
/trinity-history --type security-audit --status completed --tag api
```

### Get Recommendations

```bash
# Recommend similar investigations
/trinity-history --recommend --type security-audit --codebase ./src

# Find similar to existing investigation
/trinity-history --similar INV-001
```

## Programmatic Usage

### Initialize Registry

```typescript
import {
  InvestigationRegistry,
  RegistryQueryAPI,
  RegistryDashboard,
} from '@trinity-method/sdk/registry';

// Initialize registry
const registry = new InvestigationRegistry('trinity/registry/investigations.db');
const queryAPI = new RegistryQueryAPI(registry);
const dashboard = new RegistryDashboard(registry, queryAPI);
```

### Add Investigation

```typescript
const investigation = registry.add({
  id: 'INV-001',
  name: 'Security Audit - Authentication Flow',
  type: 'security-audit',
  codebase: './src',
  startTime: new Date(),
  endTime: new Date(Date.now() + 234500),
  duration: 234500,
  status: 'completed',
  agents: ['TAN', 'INO', 'JUNO'],
  tokensUsed: 15234,
  qualityScore: 92.3,
  tags: ['high-priority', 'authentication'],
  metadata: {
    scope: ['src/auth/**'],
    severity: 'high',
  },
  findings: 8,
});
```

### Query Investigations

```typescript
// Simple queries
const securityAudits = registry.getByType('security-audit', 10);
const completed = registry.getByStatus('completed', 20);
const highPriority = registry.getByTag('high-priority');

// Advanced search
const result = await queryAPI.search({
  type: 'security-audit',
  minQualityScore: 85,
  dateRange: {
    start: new Date('2025-09-01'),
    end: new Date('2025-10-01'),
  },
  tags: ['authentication', 'api'],
  limit: 20,
  sortBy: 'qualityScore',
  sortOrder: 'desc',
});

console.log(`Found ${result.total} investigations`);
for (const record of result.records) {
  console.log(`- ${record.name} (Quality: ${record.qualityScore})`);
}
```

### Update Investigation

```typescript
registry.update('INV-001', {
  status: 'completed',
  endTime: new Date(),
  duration: 234500,
  qualityScore: 92.3,
  findings: 8,
});
```

### Find Similar Investigations

```typescript
const similar = await queryAPI.findSimilar('INV-001', 5);

for (const { record, similarity, reasons } of similar) {
  console.log(`${similarity}% Match - ${record.name}`);
  console.log(`Reasons: ${reasons.join(', ')}`);
}
```

### Get Recommendations

```typescript
const recommendations = await queryAPI.recommend(
  'security-audit', // type
  './src', // codebase
  ['authentication', 'api'], // tags
  5 // limit
);

for (const { record, similarity, reasons } of recommendations) {
  console.log(`${similarity}% Match - ${record.name}`);
  console.log(`Previous quality: ${record.qualityScore}/100`);
  console.log(`Reasons: ${reasons.join(', ')}`);
}
```

## Advanced Queries

### Full-Text Search

```typescript
// Search across name, type, codebase, tags
const result = await queryAPI.search({
  searchText: 'authentication security',
  limit: 10,
});
```

### Multi-Criteria Filtering

```typescript
const result = await queryAPI.search({
  type: ['security-audit', 'code-quality'],
  status: ['completed', 'partial'],
  minQualityScore: 80,
  dateRange: {
    start: new Date('2025-09-01'),
    end: new Date('2025-10-01'),
  },
  tags: ['high-priority'],
  agents: ['TAN', 'JUNO'],
  limit: 50,
  offset: 0,
  sortBy: 'qualityScore',
  sortOrder: 'desc',
});
```

### Pagination

```typescript
const PAGE_SIZE = 20;
let offset = 0;
let hasMore = true;

while (hasMore) {
  const result = await queryAPI.search({
    type: 'security-audit',
    limit: PAGE_SIZE,
    offset,
  });

  // Process results
  for (const record of result.records) {
    console.log(record.name);
  }

  hasMore = result.hasMore;
  offset += PAGE_SIZE;
}
```

## Statistics

### Get Overall Statistics

```typescript
const stats = registry.getStatistics();

console.log(`Total Investigations: ${stats.totalInvestigations}`);
console.log('\nBy Type:');
for (const [type, count] of Object.entries(stats.byType)) {
  console.log(`  ${type}: ${count}`);
}

console.log('\nBy Status:');
for (const [status, count] of Object.entries(stats.byStatus)) {
  console.log(`  ${status}: ${count}`);
}

console.log('\nAverages:');
console.log(`  Duration: ${stats.avgDuration}ms`);
console.log(`  Tokens: ${stats.avgTokensUsed}`);
console.log(`  Quality: ${stats.avgQualityScore}/100`);
```

### Display Statistics Dashboard

```typescript
dashboard.displayStatistics();
```

## Dashboard

### Display History

```typescript
// Default: 20 most recent investigations
await dashboard.displayHistory();

// With filters
await dashboard.displayHistory({
  type: 'security-audit',
  minQualityScore: 85,
  limit: 10,
});
```

### Display Investigation Details

```typescript
dashboard.displayDetails('INV-001');
```

### Display Similar Investigations

```typescript
await dashboard.displaySimilar('INV-001', 5);
```

### Display Recommendations

```typescript
await dashboard.displayRecommendations(
  'security-audit',
  './src',
  ['authentication'],
  5
);
```

## Similarity Algorithm

The similarity algorithm calculates a score (0-100) based on:

### Type Match (40 points)

Exact match on investigation type (e.g., both `security-audit`)

### Codebase Match (30 points)

Exact match on codebase path (e.g., both `./src`)

### Tag Overlap (30 points)

Proportional score based on common tags:

```
tagScore = (commonTags / max(targetTags, candidateTags)) * 30
```

### Example

```typescript
// Target: security-audit, ./src, tags: [auth, api]
// Candidate: security-audit, ./src, tags: [auth, database]

// Score calculation:
// - Type match: 40 points
// - Codebase match: 30 points
// - Tag overlap: 1 common tag (auth) / 3 unique tags * 30 = 10 points
// Total: 80 points (80% similarity)
```

## Performance

### Search Performance

The registry is optimized for fast search with:

- **Indexed columns**: type, codebase, status, start_time, quality_score
- **Full-text search**: SQLite FTS5 for text queries
- **Join tables**: Efficient tag and agent queries

### Benchmarks

Typical search performance (1,000 investigations):

- **By type**: <10ms
- **By tags**: <20ms
- **By date range**: <15ms
- **Full-text search**: <50ms
- **Complex multi-criteria**: <100ms

## Data Model

### InvestigationRecord

```typescript
interface InvestigationRecord {
  id: string; // Unique identifier
  name: string; // Investigation name
  type: string; // Type (security-audit, performance-review, etc.)
  codebase: string; // Codebase path
  startTime: Date; // Start timestamp
  endTime?: Date; // End timestamp (optional)
  duration?: number; // Duration in milliseconds (optional)
  status: InvestigationStatus; // Status (completed, failed, partial, running)
  agents: string[]; // AI agents used
  tokensUsed: number; // Total tokens consumed
  qualityScore?: number; // Quality score (0-100, optional)
  tags: string[]; // Custom tags
  metadata: Record<string, any>; // Additional metadata
  findings?: number; // Number of findings (optional)
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### RegistryQuery

```typescript
interface RegistryQuery {
  type?: string | string[]; // Filter by type(s)
  codebase?: string; // Filter by codebase
  dateRange?: { start: Date; end: Date }; // Date range filter
  tags?: string[]; // Filter by tags (AND logic)
  minQualityScore?: number; // Minimum quality score
  maxQualityScore?: number; // Maximum quality score
  status?: InvestigationStatus | InvestigationStatus[]; // Filter by status(es)
  searchText?: string; // Full-text search
  agents?: string[]; // Filter by agents
  limit?: number; // Result limit (default: 50)
  offset?: number; // Result offset (default: 0)
  sortBy?: 'startTime' | 'duration' | 'qualityScore' | 'tokensUsed'; // Sort field
  sortOrder?: 'asc' | 'desc'; // Sort order
}
```

## Database Schema

### Investigations Table

```sql
CREATE TABLE investigations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  codebase TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  duration INTEGER,
  status TEXT NOT NULL,
  agents TEXT NOT NULL, -- JSON array
  tokens_used INTEGER NOT NULL DEFAULT 0,
  quality_score REAL,
  tags TEXT, -- JSON array
  metadata TEXT, -- JSON object
  findings INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### Full-Text Search

```sql
CREATE VIRTUAL TABLE investigations_fts USING fts5(
  id, name, type, codebase, tags
);
```

### Tags and Agents

```sql
CREATE TABLE investigation_tags (
  investigation_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (investigation_id, tag)
);

CREATE TABLE investigation_agents (
  investigation_id TEXT NOT NULL,
  agent TEXT NOT NULL,
  PRIMARY KEY (investigation_id, agent)
);
```

## Integration with Learning System

The registry integrates with the learning system for:

### 1. Pattern Recognition

Past investigations inform future recommendations:

```typescript
// Automatically suggest similar past investigations
const recommendations = await queryAPI.recommend(
  newInvestigation.type,
  newInvestigation.codebase,
  newInvestigation.tags
);

if (recommendations.length > 0) {
  console.log('Similar past investigations found:');
  for (const { record, similarity } of recommendations) {
    console.log(`- ${record.name} (${similarity}% similar, quality: ${record.qualityScore})`);
  }
}
```

### 2. Quality Tracking

Monitor investigation quality over time:

```typescript
const stats = registry.getStatistics();
console.log(`Average quality score: ${stats.avgQualityScore}/100`);

// Track improvement
const recent = await queryAPI.search({
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date(),
  },
});

const avgRecentQuality =
  recent.records.reduce((sum, r) => sum + (r.qualityScore || 0), 0) /
  recent.records.length;

console.log(`Recent quality: ${avgRecentQuality}/100`);
console.log(`Improvement: ${avgRecentQuality - stats.avgQualityScore > 0 ? '+' : ''}${(avgRecentQuality - stats.avgQualityScore).toFixed(1)}`);
```

### 3. Agent Performance

Analyze agent effectiveness:

```typescript
const agentStats: Record<string, { count: number; avgQuality: number }> = {};

for (const agent of ['TAN', 'ZEN', 'INO', 'JUNO', 'AJ']) {
  const investigations = registry.getByAgent(agent);

  agentStats[agent] = {
    count: investigations.length,
    avgQuality:
      investigations.reduce((sum, inv) => sum + (inv.qualityScore || 0), 0) /
      investigations.length,
  };
}

console.log('Agent Performance:');
for (const [agent, stats] of Object.entries(agentStats)) {
  console.log(`${agent}: ${stats.count} investigations, avg quality ${stats.avgQuality.toFixed(1)}`);
}
```

## Best Practices

### 1. Consistent Naming

Use descriptive, consistent names:

```typescript
// Good
'Security Audit - Authentication Flow'
'Performance Review - Database Queries'
'Code Quality - Error Handling'

// Bad
'Investigation 1'
'test'
'audit'
```

### 2. Meaningful Tags

Apply relevant tags for better discovery:

```typescript
tags: [
  'high-priority', // Priority level
  'authentication', // Feature area
  'security', // Category
  'api', // Component
];
```

### 3. Complete Metadata

Include useful metadata:

```typescript
metadata: {
  scope: ['src/auth/**', 'src/api/**'],
  severity: 'high',
  assignee: 'team-security',
  jiraTicket: 'SEC-123',
  fixedIn: 'v2.1.0',
};
```

### 4. Quality Scores

Always provide quality scores for better recommendations:

```typescript
qualityScore: 92.3, // 0-100 scale
```

## Troubleshooting

### Slow Queries

**Problem:** Queries taking >100ms

**Solutions:**
- Ensure database indexes are created (check with `.schema` in SQLite)
- Reduce result limit (try `limit: 20` instead of `limit: 100`)
- Use specific filters instead of full-text search
- Rebuild FTS index if corrupted

### Missing Investigations

**Problem:** Investigation not appearing in registry

**Solutions:**
- Verify investigation was added: `registry.getById('INV-001')`
- Check database file exists and is writable
- Ensure no errors during `registry.add()`
- Verify filters aren't excluding the investigation

### Inaccurate Recommendations

**Problem:** Recommendations don't seem relevant

**Solutions:**
- Use more specific tags (increase tag overlap score)
- Ensure type is set correctly
- Provide codebase path for better matching
- Review similarity algorithm thresholds

## Export and Backup

### Export History

```typescript
const allInvestigations = registry.getAll();
const json = JSON.stringify(allInvestigations, null, 2);

fs.writeFileSync('investigations-backup.json', json);
```

### Import History

```typescript
const backup = JSON.parse(fs.readFileSync('investigations-backup.json', 'utf-8'));

for (const record of backup) {
  registry.add(record);
}
```

### Backup Database

```bash
# SQLite backup
cp trinity/registry/investigations.db trinity/registry/investigations-backup.db
```

## API Reference

See [API Documentation](../api-reference.md) for complete API details.

---

**Need Help?**

- [GitHub Issues](https://github.com/trinity-method/trinity-method-sdk/issues)
- [Documentation](https://docs.trinity-method.dev)
- [Community](https://discord.gg/trinity-method)
