## Benchmarking System

The Trinity Method SDK includes a comprehensive benchmarking system to validate performance claims with empirical data.

## Overview

The benchmarking system measures:

1. **Token Usage** - Validates token savings from caching
2. **Cache Performance** - Measures L1/L2/L3 hit rates and lookup times
3. **Investigation Speed** - Compares sequential vs coordinated execution
4. **Learning Effectiveness** - Tracks performance improvements over time

## Quick Start

### Run All Benchmarks

```bash
npm run benchmark
```

### Run Specific Benchmark

```bash
# Token usage benchmark
npm run benchmark -- --type token

# Cache performance benchmark
npm run benchmark -- --type cache

# Investigation speed benchmark
npm run benchmark -- --type speed

# Learning effectiveness benchmark
npm run benchmark -- --type learning
```

### Custom Configuration

```bash
# Run with more iterations for higher accuracy
npm run benchmark -- --iterations 20 --warmup 5

# Generate HTML visualization
npm run benchmark -- --visualize

# Custom output directory
npm run benchmark -- --output ./my-benchmarks
```

## Benchmarks

### 1. Token Usage Benchmark

**Purpose:** Validate token savings from caching

**What It Measures:**
- Baseline token usage (no cache)
- Optimized token usage (with cache)
- Percent token reduction

**Scenarios:**
- Security Investigation: 50 queries, 40% repeat rate
- Code Analysis: 100 queries, 30% repeat rate
- Pattern Recognition: 75 queries, 50% repeat rate

**Success Criteria:**
- ≥60% token reduction
- ≤5% variance across runs

**Example Output:**
```
📊 Token Usage Benchmark
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Results:
  Baseline:   168750 tokens (±1523)
  Optimized:  64125 tokens (±892)
  Reduction:  104625 tokens (62.0%)

✅ PASSED
```

### 2. Cache Performance Benchmark

**Purpose:** Measure multi-tier cache effectiveness

**What It Measures:**
- L1 cache hit rate (in-memory, fastest)
- L2 cache hit rate (file-based, fast)
- L3 cache hit rate (database, moderate)
- Average lookup time

**Simulation:**
- 1,000 queries
- 30% repeat rate
- L1 size: 100, L2 size: 1,000, L3 size: 10,000

**Success Criteria:**
- L1 hit rate ≥80%
- L2 hit rate ≥60%
- L3 hit rate ≥40%
- Avg lookup time <5ms
- ≤5% variance across runs

**Example Output:**
```
💾 Cache Performance Benchmark
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Results:
  L1 Hit Rate: 84.3% (±2.1%)
  L2 Hit Rate: 68.7% (±1.8%)
  L3 Hit Rate: 45.2% (±2.3%)
  Avg Lookup:  2.34ms (±0.18ms)

✅ PASSED
```

### 3. Investigation Speed Benchmark

**Purpose:** Validate speedup from coordinated multi-agent execution

**What It Measures:**
- Sequential execution time (baseline)
- Parallel execution time (coordinated agents)
- Speedup factor

**Scenarios:**
- Security Investigation: 20 tasks, 80% parallelizable
- Code Analysis: 30 tasks, 80% parallelizable
- Performance Audit: 25 tasks, 80% parallelizable

**Success Criteria:**
- ≥2.0x speedup
- ≤5% variance across runs

**Example Output:**
```
⚡ Investigation Speed Benchmark
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Results:
  Sequential: 3245ms (±132ms)
  Parallel:   1423ms (±67ms)
  Speedup:    2.28x (56.2% faster)

✅ PASSED
```

### 4. Learning Effectiveness Benchmark

**Purpose:** Measure performance improvements from learning system

**What It Measures:**
- Speed improvement (baseline vs experienced)
- Accuracy improvement
- Token efficiency improvement

**Scenarios:**
- Baseline: First 10 investigations (no learning)
- Optimized: After 100 investigations (with learning)

**Success Criteria:**
- ≥20% speed improvement
- +5% minimum accuracy improvement
- ≥15% token efficiency improvement
- ≤5% variance across runs

**Example Output:**
```
🧠 Learning Effectiveness Benchmark
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Results:
  Speed:
    Baseline:  2000ms
    Optimized: 1534ms (23.3% faster)
  Accuracy:
    Baseline:  75.0%
    Optimized: 87.2% (+12.2%)
  Token Efficiency:
    Baseline:  1500 tokens/task
    Optimized: 1143 tokens/task (23.8% reduction)

✅ PASSED
```

## Reports

Benchmarks generate three types of reports:

### 1. JSON Report

Machine-readable format for programmatic analysis.

**Location:** `trinity/benchmarks/[benchmark-name]-[timestamp].json`

**Structure:**
```json
{
  "name": "Token Usage",
  "description": "Measure token savings with caching",
  "timestamp": "2025-10-05T14:30:00.000Z",
  "duration": 2341,
  "benchmarks": [
    {
      "name": "Token Usage",
      "passed": true,
      "metrics": {
        "baselineAvg": 168750,
        "optimizedAvg": 64125,
        "percentReduction": 62.0
      }
    }
  ],
  "summary": {
    "total": 1,
    "passed": 1,
    "failed": 0
  }
}
```

### 2. Markdown Report

Human-readable format with detailed analysis.

**Location:** `trinity/benchmarks/[benchmark-name]-[timestamp].md`

**Includes:**
- Summary statistics
- Key metrics table
- Individual benchmark results
- Pass/fail status
- Metadata

### 3. HTML Visualization (Optional)

Interactive charts and visualizations.

**Location:** `trinity/benchmarks/[benchmark-name]-[timestamp].html`

**Features:**
- Summary cards
- Bar charts for metrics
- Responsive design
- Powered by Chart.js

**Generate:**
```bash
npm run benchmark -- --visualize
```

## Programmatic Usage

### Running Benchmarks in Code

```typescript
import {
  BenchmarkHarness,
  BenchmarkReporter,
  TokenBenchmark,
  CacheBenchmark,
} from '@trinity-method/sdk/benchmarks';

async function runCustomBenchmark() {
  const harness = new BenchmarkHarness();
  const reporter = new BenchmarkReporter('my-benchmarks');

  // Register benchmarks
  harness.register(
    new TokenBenchmark({
      name: 'Custom Token Test',
      description: 'My custom token benchmark',
      iterations: 20,
    })
  );

  // Run suite
  const suite = await harness.runAll('My Benchmark Suite');

  // Generate reports
  await reporter.generateReports(suite);
}
```

### Custom Scenarios

```typescript
import { TokenBenchmark } from '@trinity-method/sdk/benchmarks';

const benchmark = new TokenBenchmark(
  {
    name: 'API Investigation',
    description: 'Token usage for API security audit',
    iterations: 15,
  },
  [
    {
      name: 'API Endpoint Analysis',
      queryCount: 200,
      repeatRate: 0.5,
      avgTokensPerQuery: 1800,
    },
  ]
);

const result = await benchmark.run();
console.log(result);
```

### Comparing Benchmarks

```typescript
import { BenchmarkHarness, BenchmarkReporter } from '@trinity-method/sdk/benchmarks';
import { readFileSync } from 'fs';

// Load baseline
const baseline = JSON.parse(
  readFileSync('benchmarks/baseline.json', 'utf-8')
);

// Run current benchmark
const harness = new BenchmarkHarness();
// ... register and run benchmarks
const current = await harness.runAll();

// Compare
const reporter = new BenchmarkReporter();
const comparison = harness.compare(baseline.benchmarks[0], current.benchmarks[0]);

// Generate comparison report
reporter.generateComparisonMarkdown(comparison, 'benchmarks/comparison.md');

if (comparison.summary.regressions > 0) {
  console.error(`⚠️  ${comparison.summary.regressions} regression(s) detected!`);
  process.exit(1);
}
```

## CI/CD Integration

### GitHub Actions

Add to `.github/workflows/benchmarks.yml`:

```yaml
name: Benchmarks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  benchmark:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run benchmarks
        run: npm run benchmark -- --output benchmarks

      - name: Upload benchmark results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: benchmarks/

      - name: Check for regressions
        run: |
          # Compare with baseline (implement comparison logic)
          # Fail if regressions detected
```

### Regression Detection

```bash
# Save baseline
npm run benchmark -- --output benchmarks/baseline

# Run comparison on each release
npm run benchmark -- --output benchmarks/current

# Compare (custom script)
node scripts/compare-benchmarks.js \
  benchmarks/baseline/latest.json \
  benchmarks/current/latest.json
```

## Best Practices

### 1. Consistent Environment

Run benchmarks in a consistent environment:
- Same hardware (or use CI runners)
- Minimal background processes
- Controlled network conditions
- Fresh Node.js process

### 2. Sufficient Iterations

Use enough iterations for statistical significance:
- Default: 10 iterations
- High accuracy: 20-50 iterations
- Quick validation: 5 iterations

### 3. Warmup Runs

Include warmup runs to stabilize JIT compilation:
- Default: 2 warmup runs
- V8 optimization: 5+ warmup runs

### 4. Variance Monitoring

Monitor variance across runs:
- Target: ≤5% standard deviation
- High variance indicates unstable environment
- Increase iterations if variance is high

### 5. Baseline Tracking

Maintain baseline benchmarks:
- Save baseline for each major version
- Compare new releases against baseline
- Track performance trends over time

### 6. Regression Thresholds

Define acceptable regression thresholds:
- Critical metrics: 0% regression (fail CI)
- Important metrics: ≤5% regression (warning)
- Nice-to-have: ≤10% regression (monitor)

## Troubleshooting

### High Variance

**Problem:** Standard deviation >5% of mean

**Solutions:**
- Close background applications
- Increase iterations (20-50)
- Use dedicated benchmark hardware
- Run benchmarks during low-activity hours

### Benchmark Failures

**Problem:** Benchmarks fail validation criteria

**Solutions:**
- Review implementation for performance issues
- Adjust success criteria if overly aggressive
- Investigate environmental factors
- Check for resource constraints (memory, CPU)

### Inconsistent Results

**Problem:** Results vary significantly between runs

**Solutions:**
- Increase warmup runs (5-10)
- Run on dedicated hardware
- Disable CPU frequency scaling
- Use process isolation

## Advanced Usage

### Custom Benchmarks

Extend the `Benchmark` base class:

```typescript
import { Benchmark, BenchmarkConfig, BenchmarkResult } from '@trinity-method/sdk/benchmarks';

export class CustomBenchmark extends Benchmark {
  constructor(config: BenchmarkConfig) {
    super(config);
  }

  async run(): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const iterations = this.config.iterations || 10;

    // Warmup
    for (let i = 0; i < (this.config.warmupRuns || 2); i++) {
      await this.myCustomLogic();
    }

    // Measure
    const results: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const { duration } = await this.measure('task', () => this.myCustomLogic());
      results.push(duration);
    }

    // Calculate statistics
    const stats = this.calculateStatistics(results);

    return {
      name: this.config.name,
      description: this.config.description,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      iterations,
      metrics: {
        avgDuration: stats.avg,
        stdDev: stats.stdDev,
      },
      passed: stats.stdDev / stats.avg <= 0.05,
    };
  }

  private async myCustomLogic(): Promise<void> {
    // Your custom benchmark logic
  }
}
```

### Profiling Integration

Combine with profiling tools:

```typescript
// Enable Node.js profiler
node --prof src/benchmarks/runner.ts --type token

// Process profiler output
node --prof-process isolate-*.log > profile.txt
```

### Memory Profiling

Track memory usage:

```typescript
import { memoryUsage } from 'process';

const before = memoryUsage();
await benchmark.run();
const after = memoryUsage();

const memoryDelta = {
  heapUsed: (after.heapUsed - before.heapUsed) / 1024 / 1024,
  external: (after.external - before.external) / 1024 / 1024,
};

console.log(`Memory: ${memoryDelta.heapUsed.toFixed(2)} MB`);
```

## API Reference

See [API Documentation](./api-reference.md) for complete API details.

---

**Need Help?**

- [GitHub Issues](https://github.com/trinity-method/trinity-method-sdk/issues)
- [Documentation](https://docs.trinity-method.dev)
- [Community](https://discord.gg/trinity-method)
