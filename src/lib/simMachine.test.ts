import { createActor } from 'xstate';
import { simulationMachine } from './simMachine';

// Simple test to validate state machine transitions
export function testSimulationMachine() {
  const actor = createActor(simulationMachine);
  actor.start();

  console.log('Initial state:', actor.getSnapshot().value);
  
  // Test starting simulation
  actor.send({ type: 'START_SIMULATION', userId: 'test-user-123' });
  console.log('After START_SIMULATION:', actor.getSnapshot().value);
  
  // Test setting strategy
  actor.send({
    type: 'SET_STRATEGY',
    strategy: {
      targetAudience: 'Young professionals',
      brandPositioning: 'Premium quality',
      primaryChannels: ['digital', 'social'],
    }
  });
  console.log('Strategy set:', actor.getSnapshot().context.strategy);
  
  // Test completing strategy session
  actor.send({ type: 'COMPLETE_STRATEGY_SESSION' });
  console.log('After COMPLETE_STRATEGY_SESSION:', actor.getSnapshot().value);
  
  // Test adding a tactic to Q1
  actor.send({
    type: 'ADD_TACTIC',
    quarter: 'Q1',
    tactic: {
      id: 'tactic-1',
      name: 'Social Media Campaign',
      category: 'digital',
      cost: 50000,
      timeRequired: 40,
      expectedImpact: {
        revenue: 100000,
        marketShare: 2,
        customerSatisfaction: 5,
        brandAwareness: 10,
      }
    }
  });
  
  const context = actor.getSnapshot().context;
  console.log('Q1 tactics:', context.quarters.Q1.tactics);
  console.log('Remaining budget:', context.remainingBudget);
  
  // Test completing Q1
  actor.send({ type: 'COMPLETE_QUARTER', quarter: 'Q1' });
  console.log('After Q1 completion:', actor.getSnapshot().value);
  console.log('Q1 results:', actor.getSnapshot().context.quarters.Q1.results);
  console.log('Updated KPIs:', actor.getSnapshot().context.kpis);
  
  actor.stop();
  return true;
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testSimulationMachine();
}
