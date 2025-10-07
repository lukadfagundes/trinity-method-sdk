---
description: Display cache statistics and performance metrics
---

Display comprehensive statistics for the Trinity Method cache system.

**Cache Statistics Dashboard:**

1. **Tier Overview**
   - L1 (Memory): Entries, size, hit rate
   - L2 (Disk): Entries, size, hit rate
   - L3 (Archive): Entries, size, hit rate

2. **Performance Metrics**
   - Overall cache hit rate
   - Average lookup time per tier
   - Cache warming coverage
   - Memory efficiency ratio

3. **Top Cached Items**
   - Most frequently accessed keys
   - Largest cache entries
   - Oldest cache entries
   - Recently added entries

4. **Cache Health**
   - Eviction rate
   - Stale entry percentage
   - Cache fragmentation
   - Recommended optimizations

**Output Format:**
```
TRINITY CACHE STATISTICS
========================

L1 (Memory)    | Entries: 142  | Size: 12.4 MB | Hit Rate: 94.2%
L2 (Disk)      | Entries: 1,203| Size: 87.1 MB | Hit Rate: 78.5%
L3 (Archive)   | Entries: 5,421| Size: 234 MB  | Hit Rate: 45.3%

Overall Hit Rate: 81.7% ↑
Average Lookup: 2.3ms
Cache Efficiency: A-

Top 5 Keys:
  1. investigation-templates (1,203 hits)
  2. agent-context-aly (892 hits)
  ...
```

**Interactive Options:**
- View detailed stats for specific tier
- Export stats to JSON
- Generate cache optimization report
- Clear underutilized cache entries
