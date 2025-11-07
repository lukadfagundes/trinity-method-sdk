---
description: Display learning system status and comprehensive metrics dashboard
---

# Trinity Learning System Status

**Purpose:** Monitor and analyze Trinity's learning system performance with simple status view or comprehensive metrics dashboard.

## Overview

Trinity learns from every investigation, building institutional knowledge that accelerates future work. The learning system provides two views:

1. **Simple Status** - Quick overview (default)
2. **Metrics Dashboard** - Comprehensive analytics with 5 detailed sections (NEW)

## Simple Status

Quick view of learning system health and configuration:

```bash
trinity learning-status
```

### What It Shows

- **System Status:** Active or Disabled
- **Learning Rate:** Current learning rate (0.0-1.0)
- **Feature Flags:** Enabled learning features
  - Pattern Detection
  - Self Improvement
  - Knowledge Sharing
- **Pattern Library:** Total patterns and agents with data
- **Quick Stats:** High-level metrics

### Example Output

```
🧠 Trinity Learning System Status

📊 Learning System:
   Status: Active
   Learning Rate: 0.1

⚙️  Features:
   Pattern Detection: ✓
   Self Improvement: ✓
   Knowledge Sharing: ✓

📚 Learned Patterns:
   Total Patterns: 47
   High Confidence (≥0.8): 32 (68.1%)
   Agents with Data: 8

💡 Use `trinity learning-status --dashboard` for detailed metrics
```

## Metrics Dashboard (NEW)

Comprehensive learning analytics with health scoring, visual metrics, and actionable recommendations.

```bash
trinity learning-status --dashboard
```

### Dashboard Sections

The dashboard provides 5 comprehensive sections:

#### 1. System Health Overview

Health scoring (0-100) based on multiple factors:

**Scoring Components:**
- **Pattern Library Size** (max 20 points) - Larger library = more knowledge
- **High Confidence Patterns** (max 25 points) - Patterns with ≥0.8 confidence
- **Match Success Rate** (max 25 points) - Percentage of successful pattern applications
- **Average Confidence** (max 20 points) - Overall pattern quality
- **Pattern Discovery Rate** (max 10 points) - Patterns per investigation

**Health Levels:**
- 🌟 **Excellent** (≥80): System performing optimally
- ✅ **Good** (60-79): System healthy, minor improvements possible
- ⚠️  **Fair** (40-59): System functional, improvements recommended
- 🔴 **Poor** (<40): System needs attention

**Example:**
```
📊 System Health Overview

  🌟 Status: EXCELLENT
  🎯 Health Score: ████████████████████ 87/100

  📈 Total Investigations: 156
  🧠 Total Patterns: 47
  ⚡ Time Savings: 234 min (18.2% faster investigations)
```

#### 2. Pattern Library Metrics

Detailed breakdown of pattern library:

- **Total Patterns:** Across all 12 agents
- **High Confidence Patterns:** Patterns with ≥0.8 confidence (proven effective)
- **Recent Patterns:** Discovered in last 30 days
- **Discovery Rate:** Average patterns learned per investigation
- **Pattern Categories:** Visual breakdown with counts

**Example:**
```
🧠 Pattern Library Metrics

  Total Patterns: 47
  High Confidence (≥0.8): 32 (68.1%)
  Recent (30 days): 12
  Discovery Rate: 0.30 patterns/investigation

  Pattern Categories:
    code-smell           ████████████████ 16
    best-practice        ████████████ 12
    architectural        ████████ 8
    performance          █████ 6
    security             ███ 5
```

#### 3. Performance Metrics

Time savings and pattern effectiveness:

- **Pattern Matches:** Total times patterns were matched and used
- **Match Success Rate:** Percentage of successful pattern applications
- **Average Confidence:** Mean confidence across all patterns (0.0-1.0)
- **Average Investigation Time:** Mean duration of investigations
- **Time Savings Calculation:** Estimated time saved through pattern reuse

**Time Savings Formula:**
```
Time Savings = Successful Matches × Avg Investigation Time × 0.15
```

Assumes 15% faster investigations when patterns match successfully.

**Example:**
```
⚡ Performance Metrics

  Pattern Matches: 89 times
  Match Success Rate: 82.0%
  Average Confidence: 75.3%
  Avg Investigation Time: 45 min

  💰 Estimated Time Savings:
     234 minutes saved through pattern reuse
     18.2% faster investigations with patterns
     ~4 hours of developer time saved
```

#### 4. Agent Performance Breakdown

Per-agent metrics with color-coded success rates:

- **Patterns Learned:** Number of patterns per agent
- **Investigations Completed:** Total investigations by agent
- **Success Rate:** Percentage of successful investigations
- **Average Duration:** Mean time per investigation

**Color Coding:**
- 🟢 Green (≥80%): Excellent performance
- 🟡 Yellow (60-79%): Good performance
- 🔴 Red (<60%): Needs improvement

**Example:**
```
🤖 Agent Performance

  Agent   Patterns   Investigations   Success Rate   Avg Duration
  ──────────────────────────────────────────────────────────────
  MON     12         45               85.5% 🟢      32min
  ROR     8          34               82.3% 🟢      56min
  KIL     15         52               79.8% 🟡      67min
  BAS     0          52               100.0% 🟢     12min
  DRA     6          28               92.8% 🟢      28min
```

#### 5. Recommendations

Actionable suggestions based on metrics analysis:

**Recommendation Types:**
- **Small Library (<20 patterns):** "Complete more investigations to build pattern library"
- **Low High-Confidence (<50%):** "Focus on validating patterns through repeated use"
- **Low Success Rate (<70%):** "Review pattern matching criteria and refine patterns"
- **Outdated Patterns (>6 months):** "Run new investigations to refresh library"
- **Limited History (<10 investigations):** "Complete more investigations to improve learning"

**Example:**
```
💡 Recommendations

  1. Pattern library is healthy. Continue current investigation pace.
  2. High confidence patterns are strong (68.1%). Excellent validation!
  3. Consider adding more security-related patterns (only 5 currently).
  4. MON agent shows excellent pattern utilization (85.5% success rate).
```

## Usage Options

```bash
# Simple status (default)
trinity learning-status

# Comprehensive dashboard
trinity learning-status --dashboard

# Detailed pattern information
trinity learning-status --verbose

# Dashboard with detailed patterns
trinity learning-status --dashboard --verbose

# Export metrics to JSON
trinity learning-status --export
```

## Understanding Metrics

### Pattern Confidence (0.0-1.0)

Confidence is calculated from four weighted components:

**Formula:**
```
Confidence = (Occurrence × 0.3) + (Success Rate × 0.4) + (Recency × 0.2) + (Context Match × 0.1)
```

**Components:**
1. **Occurrence Count** (weight 0.3) - More occurrences = higher confidence
2. **Success Rate** (weight 0.4) - Higher success = higher confidence
3. **Recency** (weight 0.2) - More recent = higher confidence
4. **Context Match** (weight 0.1) - Better match = higher confidence

**Example Calculation:**
```
Pattern: "React useEffect missing dependencies"

Occurrences: 8 investigations → 0.8
Success Rate: 7/8 = 87.5% → 0.875
Recency: Last 2 weeks → 0.95
Context Match: 4/5 indicators → 0.8

Final Confidence = (0.8 × 0.3) + (0.875 × 0.4) + (0.95 × 0.2) + (0.8 × 0.1)
                 = 0.24 + 0.35 + 0.19 + 0.08
                 = 0.86 (86% confidence)
```

### Pattern Lifecycle

Patterns progress through 5 lifecycle stages based on confidence:

1. **Discovery** (confidence <0.5)
   - New pattern, needs validation
   - Appears in recommendations with caution
   - Requires more evidence

2. **Validation** (0.5-0.7)
   - Pattern being tested
   - Some evidence supporting effectiveness
   - Moderate confidence in recommendations

3. **Established** (0.7-0.9)
   - Pattern proven effective
   - Strong evidence of success
   - High confidence in recommendations

4. **Authoritative** (≥0.9)
   - Pattern consistently successful
   - Extensive validation
   - Maximum confidence, automatic application

5. **Deprecated** (unused 6+ months)
   - Pattern no longer relevant
   - Removed from active recommendations
   - Archived for historical reference

### Time Savings Calculation

**Formula:**
```
Time Savings = Successful Matches × Avg Investigation Time × Speed Factor

Where Speed Factor = 0.15 (15% faster with patterns)
```

**Example:**
```
89 successful pattern matches
× 45 minutes average investigation time
× 0.15 (15% speed improvement)
= 600.75 minutes
= ~10 hours saved
```

**Assumptions:**
- Pattern matches accelerate investigations by ~15%
- Based on historical data from teams using Trinity
- Conservative estimate (actual savings often higher)

## Learning System Architecture

Trinity uses a 3-layer learning architecture:

### Layer 1: Pattern Recognition (Automatic)
**Purpose:** Extract and store patterns from completed investigations

**What it does:**
- Automatically analyzes completed investigations
- Extracts patterns (code structures, solution approaches, common issues)
- Stores in `.trinity/learning/[agent-name].json`
- Creates structured pattern data with metadata

**See:** `src/learning/LearningDataStore.ts`

### Layer 2: Pattern Matching (Investigation-Time)
**Purpose:** Match current work against historical patterns

**What it does:**
- Analyzes current investigation context
- Searches learning store for relevant patterns
- Surfaces matches with confidence scores
- Recommends proven solutions from past investigations

**See:** `src/learning/StrategySelectionEngine.ts`

### Layer 3: Reinforcement Learning (Continuous)
**Purpose:** Improve pattern quality through feedback

**What it does:**
- Measures investigation outcomes (success/failure, duration)
- Updates pattern confidence scores
- Success increases confidence (+0.1)
- Failure decreases confidence (-0.15)
- Self-optimizes over time

**See:** `src/learning/PerformanceTracker.ts`

## Best Practices

### For Developers

1. **Monitor Regularly:** Check dashboard weekly to track improvement
2. **Complete Investigations:** Thorough investigations create better patterns
3. **Validate Patterns:** Review pattern suggestions before applying
4. **Update Confidence:** Mark patterns as successful or failed
5. **Review Recommendations:** Act on suggestions to optimize learning

### For Teams

1. **Share Learning Data:** Enable knowledge sharing across team members
2. **Review Stats in Meetings:** Discuss `trinity learning-status --stats` weekly
3. **Celebrate Improvements:** Track time savings and efficiency gains
4. **Identify Gaps:** Low pattern counts in areas suggest knowledge gaps
5. **Cross-Training:** Agents with low success rates need guidance

### For Organizations

1. **Measure ROI:** Track time savings and productivity improvements
2. **Share Across Projects:** Export and import patterns between teams
3. **Build Learning Culture:** Encourage investigation completion and pattern creation
4. **Monitor Trends:** Track pattern growth and effectiveness over time
5. **Invest in Quality:** High-quality investigations create high-quality patterns

## Related Commands

- `/trinity-knowledge-preservation` - Learn about learning system philosophy
- `/trinity-learning-export` - Export learned patterns
- `/trinity-orchestrate` - Use learned patterns in workflows
- `/trinity-crisis` - Crisis patterns improve recovery speed

## Source Files

- `src/cli/commands/learning-status.ts` - CLI command implementation
- `src/learning/LearningMetricsDashboard.ts` - Dashboard logic (559 lines)
- `src/learning/LearningDataStore.ts` - Layer 1: Pattern storage
- `src/learning/StrategySelectionEngine.ts` - Layer 2: Pattern matching
- `src/learning/PerformanceTracker.ts` - Layer 3: Reinforcement learning

## What would you like to see?

Choose an option:
- **Simple status:** `trinity learning-status`
- **Full dashboard:** `trinity learning-status --dashboard`
- **Pattern details:** `trinity learning-status --verbose`
- **Export metrics:** `trinity learning-status --export`

The learning system continuously improves Trinity's effectiveness through every investigation you complete.