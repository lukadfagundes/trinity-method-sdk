# Mobile Apps Trinity Method Example

## Project Profile

### React Native Mobile App

- **Framework**: React Native 0.72+
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Styled Components
- **Backend**: REST API + GraphQL
- **Authentication**: OAuth2 + Biometric
- **Storage**: AsyncStorage + SQLite
- **Push Notifications**: Firebase Cloud Messaging
- **Testing**: Jest + React Native Testing Library + Detox
- **Deployment**: App Store + Google Play

## Trinity Method Deployment

### Deployment Command

```bash
trinity deploy --name="MyMobileApp"
```

Or use universal deployment:

```
Initialize Trinity Method for MyMobileApp React Native mobile application. Analyze the React Native project structure, identify navigation patterns and screen components, detect Redux state management and API integration, recognize native modules and platform-specific code, and generate Trinity Method documentation optimized for mobile app development.
```

## Generated Trinity Method Documents

### Core Documents
- `CLAUDE.md` - Claude Code configuration and project memory
- `TRINITY.md` - Trinity Method overview for mobile project

### Knowledge Base (trinity/knowledge-base/)
- `Trinity.md` - Main Trinity Method documentation
- `ARCHITECTURE.md` - Mobile app architecture analysis
- `To-do.md` - Current tasks and work orders
- `ISSUES.md` - Known issues database

### Mobile-Specific Patterns (trinity/patterns/)
- Navigation debugging patterns
- State management patterns
- API integration patterns
- Platform-specific debugging
- Performance optimization patterns
- Offline functionality patterns

## Framework-Specific Adaptations

### React Native Debugging Setup

**Trinity Debugging Configuration:**
```javascript
// trinity/patterns/react-native-debugging.md
// React Native debugging setup

// App.js
import { Platform } from 'react-native';

// Trinity debugging configuration
if (__DEV__) {
  // Enable Trinity debugging
  global.trinityDebug = true;

  // Console logging wrapper
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    originalLog('[TRINITY]', new Date().toISOString(), ...args);
  };

  console.warn = (...args) => {
    originalWarn('[TRINITY WARN]', new Date().toISOString(), ...args);
  };

  console.error = (...args) => {
    originalError('[TRINITY ERROR]', new Date().toISOString(), ...args);
  };

  // Navigation debugging
  global.navigationLogger = (routeName, params) => {
    console.log('[TRINITY NAVIGATION]', {
      route: routeName,
      params: params,
      timestamp: new Date().toISOString()
    });
  };

  // Performance monitoring
  global.measurePerformance = (componentName, operationType) => {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      console.log('[TRINITY PERFORMANCE]', {
        component: componentName,
        operation: operationType,
        duration: `${duration}ms`
      });

      if (duration > 16) { // > 1 frame at 60fps
        console.warn('[TRINITY PERFORMANCE WARNING]', {
          component: componentName,
          operation: operationType,
          duration: `${duration}ms`,
          threshold: '16ms (60fps)'
        });
      }
    };
  };
}
```

### Navigation Debugging Pattern

**Navigation Logger:**
```javascript
// trinity/patterns/navigation-debugging.md
// React Navigation debugging

import { NavigationContainer } from '@react-navigation/native';
import { useRef } from 'react';

function App() {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        console.log('[TRINITY NAV]', {
          event: 'Navigation Ready',
          initialRoute: routeNameRef.current
        });
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        const currentParams = navigationRef.current.getCurrentRoute().params;

        if (previousRouteName !== currentRouteName) {
          console.log('[TRINITY NAV]', {
            event: 'Screen Change',
            from: previousRouteName,
            to: currentRouteName,
            params: currentParams,
            timestamp: new Date().toISOString()
          });

          // Track screen view analytics
          // Analytics.logScreenView({ screen_name: currentRouteName });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      {/* Your navigation stack */}
    </NavigationContainer>
  );
}

export default App;
```

### State Management Debugging

**Redux Debugging Pattern:**
```javascript
// trinity/patterns/redux-debugging.md
// Redux state debugging

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import apiReducer from './features/api/apiSlice';

// Trinity Redux logger middleware
const trinityLogger = (store) => (next) => (action) => {
  console.log('[TRINITY REDUX]', {
    action: action.type,
    payload: action.payload,
    timestamp: new Date().toISOString(),
    prevState: store.getState()
  });

  const result = next(action);

  console.log('[TRINITY REDUX]', {
    action: action.type,
    nextState: store.getState()
  });

  return result;
};

// Trinity performance monitor for async thunks
const performanceMonitor = (store) => (next) => (action) => {
  if (action.type.endsWith('/pending')) {
    const startTime = Date.now();
    const baseType = action.type.replace('/pending', '');

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const currentAction = state.lastAction;

      if (currentAction?.type === `${baseType}/fulfilled` ||
          currentAction?.type === `${baseType}/rejected`) {
        const duration = Date.now() - startTime;

        console.log('[TRINITY REDUX ASYNC]', {
          thunk: baseType,
          status: currentAction.type.split('/').pop(),
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });

        unsubscribe();
      }
    });
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    api: apiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(__DEV__ ? [trinityLogger, performanceMonitor] : [])
});
```

### API Integration Debugging

**API Call Monitoring:**
```javascript
// trinity/patterns/api-debugging.md
// API integration debugging

import axios from 'axios';

// Create Trinity-monitored API client
const createTrinityAPI = (baseURL) => {
  const api = axios.create({
    baseURL,
    timeout: 10000,
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const requestId = Date.now().toString();
      config.metadata = { startTime: Date.now(), requestId };

      console.log('[TRINITY API REQUEST]', {
        requestId,
        method: config.method.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
        headers: config.headers,
        timestamp: new Date().toISOString()
      });

      return config;
    },
    (error) => {
      console.error('[TRINITY API REQUEST ERROR]', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      const duration = Date.now() - response.config.metadata.startTime;

      console.log('[TRINITY API RESPONSE]', {
        requestId: response.config.metadata.requestId,
        status: response.status,
        duration: `${duration}ms`,
        dataSize: JSON.stringify(response.data).length,
        timestamp: new Date().toISOString()
      });

      // Performance warning
      if (duration > 1000) {
        console.warn('[TRINITY API SLOW]', {
          url: response.config.url,
          duration: `${duration}ms`,
          threshold: '1000ms'
        });
      }

      return response;
    },
    (error) => {
      const duration = error.config?.metadata
        ? Date.now() - error.config.metadata.startTime
        : 0;

      console.error('[TRINITY API ERROR]', {
        requestId: error.config?.metadata?.requestId,
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });

      // Network-specific errors
      if (error.message === 'Network Error') {
        console.error('[TRINITY NETWORK ERROR]', {
          message: 'Device appears to be offline',
          url: error.config?.url
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default createTrinityAPI;
```

### Component Performance Debugging

**Performance Monitoring Hook:**
```javascript
// trinity/patterns/component-performance.md
// Component performance monitoring

import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

export const useTrinityPerformance = (componentName) => {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;

    console.log('[TRINITY COMPONENT]', {
      component: componentName,
      event: 'Render',
      renderCount: renderCount.current,
      timeSinceMount: `${Date.now() - mountTime.current}ms`
    });

    // Warn on excessive re-renders
    if (renderCount.current > 10) {
      console.warn('[TRINITY PERFORMANCE]', {
        component: componentName,
        warning: 'Excessive re-renders detected',
        count: renderCount.current
      });
    }

    // Measure interaction delay
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      const interactionDelay = Date.now() - mountTime.current;
      console.log('[TRINITY INTERACTION]', {
        component: componentName,
        interactionDelay: `${interactionDelay}ms`
      });

      if (interactionDelay > 100) {
        console.warn('[TRINITY INTERACTION SLOW]', {
          component: componentName,
          delay: `${interactionDelay}ms`,
          threshold: '100ms'
        });
      }
    });

    return () => {
      interactionPromise.cancel();
    };
  });

  // Track mount/unmount
  useEffect(() => {
    console.log('[TRINITY LIFECYCLE]', {
      component: componentName,
      event: 'Mount',
      timestamp: new Date().toISOString()
    });

    return () => {
      console.log('[TRINITY LIFECYCLE]', {
        component: componentName,
        event: 'Unmount',
        lifetime: `${Date.now() - mountTime.current}ms`,
        totalRenders: renderCount.current
      });
    };
  }, []);
};

// Usage in component
function MyScreen() {
  useTrinityPerformance('MyScreen');

  return (
    <View>
      {/* Component content */}
    </View>
  );
}
```

### Offline Support Debugging

**Network State Monitoring:**
```javascript
// trinity/patterns/offline-debugging.md
// Offline functionality debugging

import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useTrinityNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('[TRINITY NETWORK]', {
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
        details: state.details,
        timestamp: new Date().toISOString()
      });

      setIsConnected(state.isConnected);
      setConnectionType(state.type);

      // Warn on poor connection
      if (state.type === 'cellular' && state.details?.cellularGeneration === '2g') {
        console.warn('[TRINITY NETWORK SLOW]', {
          message: '2G connection detected',
          recommendation: 'Reduce API calls and data transfer'
        });
      }

      // Connection state changes
      if (state.isConnected !== isConnected) {
        console.log('[TRINITY NETWORK STATE]', {
          event: state.isConnected ? 'Came Online' : 'Went Offline',
          previousState: isConnected,
          newState: state.isConnected
        });
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  return { isConnected, connectionType };
};
```

## Investigation Templates

### Mobile Feature Investigation

```markdown
# Mobile Feature Investigation: [Feature Name]

## Platform Considerations

### iOS-Specific
- [ ] iOS version support (iOS 13+?)
- [ ] App Store guidelines compliance
- [ ] iOS permissions required
- [ ] iOS-specific UI patterns

### Android-Specific
- [ ] Android version support (API 23+?)
- [ ] Google Play guidelines compliance
- [ ] Android permissions required
- [ ] Material Design compliance

## Performance Analysis

### Metrics to Investigate
- [ ] App launch time (<2s target)
- [ ] Screen transition time (<300ms)
- [ ] API response handling
- [ ] Memory usage
- [ ] Battery impact

### Edge Cases
- [ ] Slow network (2G/3G)
- [ ] No network (offline mode)
- [ ] Background/foreground transitions
- [ ] Low memory devices
- [ ] Different screen sizes
- [ ] Device orientation changes

## Native Module Requirements

### Required Permissions
- [ ] Camera
- [ ] Photo library
- [ ] Location
- [ ] Push notifications
- [ ] Biometric authentication

### Third-Party Dependencies
- [ ] React Native version compatibility
- [ ] Native module requirements
- [ ] iOS CocoaPods setup
- [ ] Android Gradle configuration

## Testing Strategy
- [ ] Unit tests (Jest)
- [ ] Component tests (React Native Testing Library)
- [ ] E2E tests (Detox)
- [ ] Manual testing on physical devices
- [ ] iOS TestFlight beta
- [ ] Android internal testing track
```

### Performance Investigation Template

```markdown
# Mobile Performance Investigation

## Current Performance Metrics

### App Launch
- Cold start: [Xms]
- Warm start: [Xms]
- Target: <2000ms cold, <1000ms warm

### Navigation
- Screen transition: [Xms]
- Target: <300ms

### API Calls
- Average response handling: [Xms]
- Target: <500ms

### Memory
- Average usage: [XMB]
- Peak usage: [XMB]
- Target: <150MB average

## Bottleneck Analysis

### JavaScript Thread
- [ ] Excessive re-renders
- [ ] Heavy computations
- [ ] Large state updates

### Native Thread
- [ ] Image loading
- [ ] Animation performance
- [ ] Native module calls

### Bridge Communication
- [ ] Frequent JS-Native calls
- [ ] Large data transfers

## Optimization Opportunities
1. [Specific optimization]
2. [Specific optimization]
3. [Specific optimization]
```

## Performance Baselines

### Mobile Performance Targets

```javascript
const mobilePerformanceTargets = {
  // App lifecycle
  lifecycle: {
    coldLaunch: '<2000ms',
    warmLaunch: '<1000ms',
    screenTransition: '<300ms'
  },

  // Runtime performance
  runtime: {
    jsFrameRate: '60fps (16.67ms per frame)',
    uiFrameRate: '60fps (16.67ms per frame)',
    memoryUsage: '<150MB average',
    apiResponseTime: '<500ms'
  },

  // User interaction
  interaction: {
    touchResponse: '<100ms',
    scrollPerformance: '60fps',
    animationFrameRate: '60fps'
  },

  // Network
  network: {
    apiTimeout: '10s',
    offlineGraceful: 'Required',
    cacheStrategy: 'Implemented'
  },

  // Resource usage
  resources: {
    batteryImpact: 'Low',
    dataUsage: '<50MB per day',
    storageUsage: '<100MB'
  }
};
```

## Testing Strategies

### React Native Testing Example

```javascript
// __tests__/screens/HomeScreen.test.js
// Trinity Method mobile testing

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import HomeScreen from '../../screens/HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    console.log('[TRINITY TEST] Starting HomeScreen test');
  });

  it('should render correctly', () => {
    console.log('[TRINITY TEST] Testing render');

    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('Welcome')).toBeTruthy();
    expect(getByTestId('home-screen')).toBeTruthy();

    console.log('[TRINITY TEST] Render test passed');
  });

  it('should handle button press', async () => {
    console.log('[TRINITY TEST] Testing button interaction');

    const { getByTestId } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    const button = getByTestId('action-button');
    fireEvent.press(button);

    await waitFor(() => {
      console.log('[TRINITY TEST] Button press handled');
      expect(getByTestId('success-message')).toBeTruthy();
    });
  });

  it('should handle API errors gracefully', async () => {
    console.log('[TRINITY TEST] Testing error handling');
    // Test implementation
  });
});
```

### Detox E2E Testing

```javascript
// e2e/homeScreen.e2e.js
// Trinity Method E2E testing

describe('Home Screen E2E', () => {
  beforeAll(async () => {
    console.log('[TRINITY E2E] Starting E2E test suite');
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display home screen after launch', async () => {
    console.log('[TRINITY E2E] Testing app launch');

    await expect(element(by.id('home-screen'))).toBeVisible();
    console.log('[TRINITY E2E] Home screen visible');
  });

  it('should navigate to profile on button tap', async () => {
    console.log('[TRINITY E2E] Testing navigation');

    await element(by.id('profile-button')).tap();
    await expect(element(by.id('profile-screen'))).toBeVisible();

    console.log('[TRINITY E2E] Navigation successful');
  });

  it('should handle offline mode', async () => {
    console.log('[TRINITY E2E] Testing offline functionality');

    await device.setURLBlacklist(['.*']);
    await element(by.id('refresh-button')).tap();
    await expect(element(by.text('Offline Mode'))).toBeVisible();

    console.log('[TRINITY E2E] Offline mode handled correctly');
  });
});
```

## Crisis Recovery Procedures

### Mobile-Specific Emergency Scenarios

```markdown
## 1. App Crash on Launch

**Symptoms:**
- App crashes immediately on open
- White screen of death
- Blank screen

**Immediate Actions:**
1. Check crash logs (Xcode/Android Studio)
2. Review recent changes
3. Test on different devices/OS versions
4. Rollback if in production

**Investigation:**
- Check native module initialization
- Review AsyncStorage/SQLite access
- Verify API endpoint availability
- Check for JavaScript errors

## 2. Memory Leak

**Symptoms:**
- App slows down over time
- Crashes after extended use
- High memory warnings

**Immediate Actions:**
1. Use React DevTools Profiler
2. Check for event listener leaks
3. Review component cleanup
4. Monitor memory in Xcode Instruments

## 3. Performance Degradation

**Symptoms:**
- Slow screen transitions
- Janky scrolling
- Dropped frames

**Immediate Actions:**
1. Enable performance monitor: `__DEV__ && require('react-native').unstable_enableLogBox()`
2. Check for synchronous  operations on JS thread
3. Profile with Flipper
4. Reduce bridge traffic

## 4. Network Failures

**Symptoms:**
- API calls failing
- Timeout errors
- Offline functionality broken

**Immediate Actions:**
1. Test network connectivity
2. Check API endpoint status
3. Verify offline cache
4. Review retry logic
```

## Platform-Specific Notes

### iOS Deployment Considerations

```markdown
## iOS-Specific Trinity Patterns

### Build Configuration
- Xcode project structure
- CocoaPods dependencies
- Info.plist configurations
- Code signing and provisioning

### Performance Optimization
- Use Hermes engine
- Enable RAM bundles
- Optimize images for iOS
- Use native driver for animations

### Testing
- TestFlight beta distribution
- Device-specific testing (iPhone SE to Pro Max)
- iOS version compatibility (iOS 13+)
```

### Android Deployment Considerations

```markdown
## Android-Specific Trinity Patterns

### Build Configuration
- Gradle configuration
- ProGuard/R8 optimization
- Build variants
- Signing configurations

### Performance Optimization
- Enable Hermes
- Use Android App Bundle
- Optimize images for Android
- Configure memory limits

### Testing
- Internal testing track
- Device fragmentation testing
- Android version compatibility (API 23+)
```

## Deployment Notes

This mobile apps example demonstrates Trinity Method patterns for:
- React Native debugging setup
- Navigation monitoring
- State management debugging
- API integration monitoring
- Component performance tracking
- Offline functionality
- Platform-specific considerations
- Mobile testing strategies
- E2E testing with Detox
- Crisis recovery for mobile issues

Use `/trinity-init` after deployment to activate all agents and begin mobile development with full Trinity Method support.
