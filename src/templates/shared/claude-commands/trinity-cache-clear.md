---
description: Clear Trinity cache system (L1, L2, L3)
---

Clear the Trinity Method cache system.

**Cache Tiers:**
- **L1 (Memory)** - In-memory cache for active session
- **L2 (Disk)** - Persistent cache for recent investigations
- **L3 (Archive)** - Long-term pattern cache

**Process:**

1. Ask user which cache to clear:
   - All tiers (complete clear)
   - L1 only (current session)
   - L2 only (recent investigations)
   - L3 only (archived patterns)
   - Specific keys (pattern match)

2. Display current cache stats before clearing:
   - Number of entries per tier
   - Total memory usage
   - Cache age (oldest entry)

3. Confirm action (this cannot be undone)

4. Clear selected cache using AdvancedCacheManager

5. Report results:
   - Entries cleared per tier
   - Memory freed
   - Cache files deleted (if applicable)

**Warning:**
Clearing cache will:
- Remove cached investigation data
- Reset performance baselines
- Require cache warming for optimal performance

**Recommended Use Cases:**
- Troubleshooting cache corruption
- Freeing disk space
- After major SDK updates
- Testing cache warming strategies
