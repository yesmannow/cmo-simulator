import { createMachine, interpret } from 'xstate';
import { simulationMachine } from '@/lib/simMachine';
import { generateMockSimulationContext } from './mockData';

interface TestResult {
  path: string[];
  success: boolean;
  error?: string;
  finalState: string;
  context?: any;
  duration: number;
}

// Test all possible simulation paths
export class SimulationPathTester {
  private machine = simulationMachine;
  private testResults: TestResult[] = [];

  // Test all major simulation paths
  async testAllPaths(): Promise<TestResult[]> {
    this.testResults = [];

    // Test successful completion path
    await this.testPath('successful-completion', [
      'START_SIMULATION',
      'SET_STRATEGY',
      'START_Q1',
      'SELECT_TACTICS',
      'HANDLE_WILDCARD',
      'COMPLETE_Q1',
      'START_Q2',
      'HIRE_TALENT',
      'SELECT_TACTICS',
      'COMPLETE_Q2',
      'START_Q3',
      'SELECT_TACTICS',
      'HANDLE_WILDCARD',
      'COMPLETE_Q3',
      'START_Q4',
      'MAKE_BIG_BET',
      'SELECT_TACTICS',
      'COMPLETE_Q4',
      'COMPLETE_SIMULATION'
    ]);

    // Test early exit path
    await this.testPath('early-exit', [
      'START_SIMULATION',
      'SET_STRATEGY',
      'START_Q1',
      'EXIT_SIMULATION'
    ]);

    // Test budget constraint path
    await this.testPath('budget-exceeded', [
      'START_SIMULATION',
      'SET_STRATEGY',
      'START_Q1',
      'SELECT_TACTICS', // With tactics that exceed budget
      'COMPLETE_Q1'
    ]);

    // Test minimal completion path
    await this.testPath('minimal-completion', [
      'START_SIMULATION',
      'SET_STRATEGY',
      'START_Q1',
      'COMPLETE_Q1',
      'START_Q2',
      'COMPLETE_Q2',
      'START_Q3',
      'COMPLETE_Q3',
      'START_Q4',
      'COMPLETE_Q4',
      'COMPLETE_SIMULATION'
    ]);

    // Test wildcard-heavy path
    await this.testPath('wildcard-heavy', [
      'START_SIMULATION',
      'SET_STRATEGY',
      'START_Q1',
      'HANDLE_WILDCARD',
      'HANDLE_WILDCARD',
      'SELECT_TACTICS',
      'COMPLETE_Q1',
      'START_Q2',
      'HANDLE_WILDCARD',
      'COMPLETE_Q2',
      'START_Q3',
      'HANDLE_WILDCARD',
      'COMPLETE_Q3',
      'START_Q4',
      'HANDLE_WILDCARD',
      'COMPLETE_Q4',
      'COMPLETE_SIMULATION'
    ]);

    return this.testResults;
  }

  private async testPath(pathName: string, events: string[]): Promise<void> {
    const startTime = Date.now();
    let success = false;
    let error: string | undefined;
    let finalState = '';
    let context: any;

    try {
      const service = interpret(this.machine.withContext(generateMockSimulationContext()));
      service.start();

      for (const eventType of events) {
        const currentState = service.getSnapshot();
        
        // Generate appropriate event data based on event type
        const eventData = this.generateEventData(eventType, currentState.context);
        
        if (currentState.can({ type: eventType, ...eventData })) {
          service.send({ type: eventType, ...eventData });
        } else {
          throw new Error(`Cannot send event ${eventType} in state ${currentState.value}`);
        }
      }

      const finalSnapshot = service.getSnapshot();
      finalState = finalSnapshot.value as string;
      context = finalSnapshot.context;
      success = true;
      
      service.stop();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      success = false;
    }

    const duration = Date.now() - startTime;

    this.testResults.push({
      path: [pathName, ...events],
      success,
      error,
      finalState,
      context,
      duration
    });
  }

  private generateEventData(eventType: string, context: any): any {
    switch (eventType) {
      case 'SET_STRATEGY':
        return {
          strategy: {
            targetAudience: 'Young Professionals',
            brandPositioning: 'Premium Quality',
            primaryChannels: ['Digital Marketing', 'Social Media'],
            companyName: 'Test Company',
            industry: 'Technology',
            strategyType: 'Growth'
          },
          budget: 1000000
        };

      case 'SELECT_TACTICS':
        return {
          tactics: [
            {
              id: 'test-tactic',
              name: 'Test Tactic',
              cost: 50000,
              timeRequired: 20,
              expectedImpact: {
                revenue: 75000,
                marketShare: 2,
                customerSatisfaction: 5,
                brandAwareness: 8
              }
            }
          ]
        };

      case 'HANDLE_WILDCARD':
        return {
          choiceId: 'test-choice',
          wildcardId: 'test-wildcard'
        };

      case 'HIRE_TALENT':
        return {
          candidates: [
            {
              id: 'test-talent',
              name: 'Test Talent',
              role: 'Marketing Specialist',
              cost: 15000,
              impact: {
                revenue: 1.1,
                marketShare: 1.05,
                customerSatisfaction: 1.02,
                brandAwareness: 1.08
              }
            }
          ]
        };

      case 'MAKE_BIG_BET':
        return {
          bigBet: {
            id: 'test-big-bet',
            name: 'Test Big Bet',
            cost: 100000,
            risk: 'medium',
            potentialImpact: {
              revenue: { min: 50000, max: 200000 },
              marketShare: { min: 1, max: 5 }
            }
          }
        };

      default:
        return {};
    }
  }

  // Generate test report
  generateReport(): string {
    const totalTests = this.testResults.length;
    const successfulTests = this.testResults.filter(r => r.success).length;
    const failedTests = this.testResults.filter(r => !r.success);

    let report = `# Simulation Path Testing Report\n\n`;
    report += `**Total Tests:** ${totalTests}\n`;
    report += `**Successful:** ${successfulTests}\n`;
    report += `**Failed:** ${failedTests.length}\n`;
    report += `**Success Rate:** ${((successfulTests / totalTests) * 100).toFixed(1)}%\n\n`;

    if (failedTests.length > 0) {
      report += `## Failed Tests\n\n`;
      failedTests.forEach(test => {
        report += `### ${test.path[0]}\n`;
        report += `**Error:** ${test.error}\n`;
        report += `**Path:** ${test.path.slice(1).join(' → ')}\n`;
        report += `**Duration:** ${test.duration}ms\n\n`;
      });
    }

    report += `## Successful Tests\n\n`;
    this.testResults.filter(r => r.success).forEach(test => {
      report += `### ${test.path[0]}\n`;
      report += `**Final State:** ${test.finalState}\n`;
      report += `**Duration:** ${test.duration}ms\n`;
      report += `**Final Score:** ${test.context?.finalResults?.score || 'N/A'}\n\n`;
    });

    return report;
  }
}

// Performance testing utilities
export class SimulationPerformanceTester {
  async benchmarkSimulation(iterations: number = 100): Promise<PerformanceResult> {
    const results: number[] = [];
    const errors: string[] = [];

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        
        // Run a complete simulation
        const service = interpret(simulationMachine.withContext(generateMockSimulationContext()));
        service.start();
        
        // Simulate a typical user flow
        service.send({ type: 'START_SIMULATION' });
        service.send({ 
          type: 'SET_STRATEGY', 
          strategy: {
            targetAudience: 'Test Audience',
            brandPositioning: 'Test Position',
            primaryChannels: ['Digital Marketing']
          },
          budget: 1000000
        });
        
        // Complete all quarters
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
          service.send({ type: `START_${quarter}` });
          service.send({ type: `COMPLETE_${quarter}` });
        });
        
        service.send({ type: 'COMPLETE_SIMULATION' });
        service.stop();
        
        const endTime = performance.now();
        results.push(endTime - startTime);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return {
      iterations,
      successful: results.length,
      failed: errors.length,
      averageTime: results.reduce((a, b) => a + b, 0) / results.length,
      minTime: Math.min(...results),
      maxTime: Math.max(...results),
      errors: errors.slice(0, 5) // First 5 errors
    };
  }

  interface PerformanceResult {
    iterations: number;
    successful: number;
    failed: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    errors: string[];
  }
}

// Memory leak detection
export class SimulationMemoryTester {
  async detectMemoryLeaks(iterations: number = 50): Promise<MemoryTestResult> {
    const initialMemory = this.getMemoryUsage();
    const memorySnapshots: number[] = [];

    for (let i = 0; i < iterations; i++) {
      // Create and destroy simulation service
      const service = interpret(simulationMachine.withContext(generateMockSimulationContext()));
      service.start();
      
      // Run through simulation
      service.send({ type: 'START_SIMULATION' });
      service.send({ type: 'COMPLETE_SIMULATION' });
      service.stop();

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      memorySnapshots.push(this.getMemoryUsage());
    }

    const finalMemory = this.getMemoryUsage();
    const memoryGrowth = finalMemory - initialMemory;
    const averageGrowthPerIteration = memoryGrowth / iterations;

    return {
      initialMemory,
      finalMemory,
      memoryGrowth,
      averageGrowthPerIteration,
      iterations,
      snapshots: memorySnapshots,
      hasLeak: averageGrowthPerIteration > 1024 * 1024 // 1MB threshold
    };
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    // Browser fallback
    return (performance as any).memory?.usedJSHeapSize || 0;
  }

  interface MemoryTestResult {
    initialMemory: number;
    finalMemory: number;
    memoryGrowth: number;
    averageGrowthPerIteration: number;
    iterations: number;
    snapshots: number[];
    hasLeak: boolean;
  }
}
