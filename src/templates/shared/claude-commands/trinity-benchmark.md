---
description: Run performance benchmarks and detect regressions
---

Execute Trinity Method performance benchmarks to establish baselines and detect regressions.

**Benchmark Suite:**

1. **Speed Benchmarks**
   - Investigation planning performance
   - Template processing speed
   - File operation throughput
   - Agent response times

2. **Cache Benchmarks**
   - L1/L2/L3 cache read/write speed
   - Cache eviction performance
   - TTL cleanup efficiency

3. **Learning System Benchmarks**
   - Pattern matching speed
   - Pattern learning performance
   - Knowledge retrieval latency

4. **End-to-End Benchmarks**
   - Full investigation workflow
   - Analytics collection overhead
   - Real-world usage scenarios

**Process:**
1. Ask user which benchmark to run:
   - Quick (essential benchmarks only, ~1 min)
   - Standard (all core benchmarks, ~5 min)
   - Comprehensive (full suite with stress tests, ~10 min)

2. Run selected benchmarks using BenchmarkHarness

3. Compare results against baselines (stored in trinity/analytics/baselines/)

4. Report findings:
   - Performance metrics
   - Regression warnings (> 10% slower)
   - Improvements (> 10% faster)
   - Recommendations

**Output:**
- Benchmark results table
- Comparison to baseline
- Performance grade (A-F)
- Actionable recommendations
