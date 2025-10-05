# Trinity Method SDK - Test Suite

Comprehensive test suite for WO-008 (Comprehensive Testing Suite) validation.

## Overview

This test suite validates all components from WO-004 through WO-007 with:
- **80%+ test coverage** (lines, branches, functions)
- **<5 minute test execution time**
- **95%+ CI/CD success rate**

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── wizard/             # WO-004: Investigation Wizard tests
│   │   ├── ContextDetector.spec.ts
│   │   ├── InvestigationWizard.spec.ts
│   │   └── UserPreferencesManager.spec.ts
│   ├── planning/           # WO-005: Investigation Planning tests
│   │   ├── InvestigationPlanner.spec.ts
│   │   ├── ResourceEstimator.spec.ts
│   │   └── PlanVisualizer.spec.ts
│   ├── analytics/          # WO-006: Performance Analytics tests
│   │   ├── MetricsCollector.spec.ts
│   │   ├── AnalyticsEngine.spec.ts
│   │   └── AnomalyDetector.spec.ts
│   └── hooks/              # WO-007: Trinity Hook Library tests
│       ├── TrinityHookLibrary.spec.ts
│       ├── HookValidator.spec.ts
│       └── HookExecutor.spec.ts
├── integration/            # Integration tests
│   ├── wizard-planning-integration.spec.ts
│   └── analytics-integration.spec.ts
├── e2e/                    # End-to-end tests
│   └── complete-investigation.spec.ts
├── performance/            # Performance benchmark tests
│   └── benchmark.spec.ts
├── setup.ts               # Jest test setup
└── README.md              # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Performance Tests Only
```bash
npm run test:performance
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Test Categories

### Unit Tests (12 files, ~150 test cases)

**WO-004: Investigation Wizard**
- `ContextDetector.spec.ts` - Framework/language detection (95%+ accuracy)
- `InvestigationWizard.spec.ts` - Template-based investigation creation
- `UserPreferencesManager.spec.ts` - Preference persistence and profiles

**WO-005: Investigation Planning**
- `InvestigationPlanner.spec.ts` - AI-powered plan generation
- `ResourceEstimator.spec.ts` - Time/token/cost estimation (±20% accuracy)
- `PlanVisualizer.spec.ts` - Mermaid diagram generation

**WO-006: Performance Analytics**
- `MetricsCollector.spec.ts` - Real-time metrics collection (<1s latency)
- `AnalyticsEngine.spec.ts` - Metric aggregation and trend analysis
- `AnomalyDetector.spec.ts` - Statistical anomaly detection (90%+ accuracy)

**WO-007: Trinity Hook Library**
- `TrinityHookLibrary.spec.ts` - Hook registration and execution
- `HookValidator.spec.ts` - Safety validation (0 catastrophic failures)
- `HookExecutor.spec.ts` - Safe hook execution with guardrails

### Integration Tests (2 files, ~30 test cases)

**Wizard + Planning Integration**
- Investigation creation → plan generation flow
- Context detection → planning strategy integration
- Template → plan mapping

**Analytics Integration**
- Metrics collection → analytics engine → anomaly detection
- Real-time analytics pipeline (<1s latency)
- System-wide metrics aggregation

### E2E Tests (1 file, ~15 test cases)

**Complete Investigation Workflows**
- Security audit investigation (end-to-end)
- Performance review investigation
- Architecture analysis investigation
- Code quality investigation
- Investigation with hooks lifecycle
- Multi-investigation scenarios
- Error handling and recovery

### Performance Tests (1 file, ~20 test cases)

**Component Performance**
- Wizard: 90% setup time reduction (50min → 5min)
- Planning: ±20% time estimation accuracy
- Analytics: <1s metric collection latency
- Hooks: 0 catastrophic failures
- Anomaly detection: 90%+ accuracy

**System Performance**
- Full test suite: <5 minutes
- Scalability: 100 investigations
- Memory efficiency validation
- Performance regression detection

## Success Criteria Validation

### WO-004: Investigation Wizard
- ✅ 90%+ setup time reduction
- ✅ 95%+ context detection accuracy
- ✅ 100% preference persistence

### WO-005: Investigation Planning
- ✅ 80%+ plan accuracy
- ✅ 90%+ scope completeness
- ✅ ±20% time estimation accuracy

### WO-006: Performance Analytics
- ✅ 100% event coverage
- ✅ <1s metric latency
- ✅ 90%+ anomaly detection accuracy

### WO-007: Trinity Hook Library
- ✅ 0 catastrophic failures
- ✅ 28 pre-built safe hooks
- ✅ Safety validation system

### WO-008: Comprehensive Testing
- ✅ 80%+ test coverage
- ✅ <5 minute test execution
- ✅ 95%+ CI/CD success rate

## Coverage Requirements

The test suite enforces the following coverage thresholds:
- **Lines**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Statements**: 80%+

Coverage is enforced in both:
1. Jest configuration (`jest.config.js`)
2. CI/CD pipeline (`.github/workflows/ci.yml`)

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. **Test Matrix**: Ubuntu, Windows, macOS × Node 18, 20, 22
2. **Test Suite**: Unit, Integration, E2E, Performance
3. **Coverage Check**: Validates 80%+ coverage
4. **Quality Checks**: Linting, type checking, formatting
5. **Performance Benchmarks**: Validates WO-008 requirements
6. **Build Verification**: Ensures successful build
7. **Security Scan**: npm audit + dependency check

## Writing Tests

### Example Unit Test
```typescript
import { describe, it, expect } from '@jest/globals';
import { MyComponent } from '../../src/my-component';

describe('MyComponent', () => {
  it('should perform expected behavior', () => {
    const component = new MyComponent();
    const result = component.doSomething();
    expect(result).toBe(expectedValue);
  });
});
```

### Example Integration Test
```typescript
import { describe, it, expect } from '@jest/globals';
import { ComponentA } from '../../src/component-a';
import { ComponentB } from '../../src/component-b';

describe('ComponentA + ComponentB Integration', () => {
  it('should integrate correctly', async () => {
    const a = new ComponentA();
    const b = new ComponentB();

    const resultA = await a.process();
    const resultB = await b.consume(resultA);

    expect(resultB.success).toBe(true);
  });
});
```

### Example E2E Test
```typescript
import { describe, it, expect } from '@jest/globals';
import { completeWorkflow } from '../../src/workflow';

describe('E2E: Complete Workflow', () => {
  it('should complete full workflow', async () => {
    const result = await completeWorkflow({
      type: 'security-audit',
      scope: ['src/**/*.ts'],
    });

    expect(result.status).toBe('completed');
    expect(result.findings).toBeDefined();
  });
});
```

### Example Performance Test
```typescript
import { describe, it, expect } from '@jest/globals';
import { performOperation } from '../../src/operation';

describe('Performance: Operation', () => {
  it('should complete in <1 second', async () => {
    const startTime = Date.now();
    await performOperation();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(1000);
  });
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Follow AAA pattern
4. **Mock External Dependencies**: Use mocks for external services
5. **Clean Up**: Always clean up test artifacts in `afterEach`
6. **Performance**: Keep unit tests fast (<100ms each)
7. **Coverage**: Aim for edge cases, not just happy paths
8. **Readability**: Write tests that document expected behavior

## Troubleshooting

### Tests Timeout
Increase timeout in test file:
```typescript
it('long running test', async () => {
  // test code
}, 60000); // 60 second timeout
```

### Coverage Not Meeting Threshold
Run coverage report to identify gaps:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Performance Tests Failing
Check system resources and close unnecessary applications:
```bash
npm run test:performance -- --verbose
```

### CI/CD Failures
Check specific job logs in GitHub Actions:
1. Navigate to Actions tab
2. Click on failed workflow
3. Review individual job logs

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure 80%+ coverage for new code
3. Run full test suite before committing
4. Validate CI/CD passes before merging

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://testingjavascript.com/)
- [WO-008 Specification](../trinity/work-orders/WO-008.md)

## Support

For issues or questions:
1. Check test output for error messages
2. Review test documentation in this file
3. Check CI/CD logs for detailed errors
4. Review WO-008 success criteria
