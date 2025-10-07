---
description: View performance analytics and investigation metrics
---

Display the Trinity Method analytics dashboard with comprehensive performance metrics.

**Data Sources:**
- AnalyticsEngine (src/analytics/AnalyticsEngine.ts)
- MetricsCollector (src/analytics/MetricsCollector.ts)
- AnomalyDetector (src/analytics/AnomalyDetector.ts)

**Dashboard Sections:**

1. **Performance Metrics**
   - Average investigation duration
   - Success rate trends
   - Agent performance comparison
   - Time-to-resolution metrics

2. **Cache Performance**
   - Hit/miss rates per tier (L1, L2, L3)
   - Memory usage and efficiency
   - Cache warming effectiveness

3. **Anomaly Detection**
   - Performance degradations
   - Unusual patterns or spikes
   - Error rate anomalies
   - Recommended actions

4. **Learning System Stats**
   - Patterns learned over time
   - Pattern application success rate
   - Knowledge base growth

**Output Format:**
- ASCII tables with metrics
- Trend indicators (↑ ↓ →)
- Color-coded status (use markdown)
- Key insights and recommendations

**Interactive Options:**
Ask user if they want to:
- Export metrics to JSON/CSV (saves to `trinity/metrics/analytics/`)
- View detailed breakdown of specific metric
- Clear anomaly alerts
- Generate performance report (saves to `trinity/metrics/analytics/reports/`)
