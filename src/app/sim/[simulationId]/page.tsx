'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SimulationState } from '@/lib/simulationEngine';

export default function SimulationPage() {
  const router = useRouter();
  const params = useParams();
  const simulationId = params.simulationId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSimulation = async () => {
      try {
        const supabase = createClient();

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch the specific simulation
        const { data: simulation, error } = await supabase
          .from('simulations_enhanced')
          .select('*')
          .eq('id', simulationId)
          .eq('user_id', user.id)
          .single();

        if (error || !simulation) {
          setError('Simulation not found');
          setLoading(false);
          return;
        }

        // Create simulation state from database data
        const simulationState: SimulationState = {
          config: {
            companyName: simulation.company_name,
            timeHorizon: simulation.time_horizon,
            industry: simulation.industry,
            companyProfile: simulation.company_profile,
            marketLandscape: simulation.market_landscape,
            totalBudget: simulation.total_budget,
            budgetAllocation: {
              brandAwareness: simulation.budget_brand_awareness,
              leadGeneration: simulation.budget_lead_generation,
              conversionOptimization: simulation.budget_conversion_optimization,
            },
          },
          currentQuarter: simulation.current_quarter as any,
          status: simulation.status as any,
          simulationId: simulation.id,
          totalBudget: simulation.total_budget,
          budgetRemaining: simulation.total_budget - (simulation.budget_spent || 0),
          totalRevenue: simulation.total_revenue || 0,
          totalProfit: simulation.total_profit || 0,
          brandEquity: simulation.brand_equity || 50,
          teamMorale: simulation.team_morale || 75,
          currentMarketShare: simulation.final_market_share || 5,
          competitorSpend: 0, // Will be calculated
          marketSaturation: 0.3,
          quarterlyResults: [],
          seoInvestments: [],
          wildcardEvents: [],
          decisions: [],
        };

        // Save to localStorage for the simulation engine
        localStorage.setItem('cmo-sim-state', JSON.stringify(simulationState));

        // Route to appropriate phase
        switch (simulation.current_quarter) {
          case 'setup':
            router.push('/sim/setup');
            break;
          case 'strategy':
            router.push('/sim/strategy');
            break;
          case 'Q1':
            router.push('/sim/q1');
            break;
          case 'Q2':
            router.push('/sim/q2');
            break;
          case 'Q3':
            router.push('/sim/q3');
            break;
          case 'Q4':
            router.push('/sim/q4');
            break;
          case 'completed':
            router.push(`/sim/debrief/${simulation.id}`);
            break;
          default:
            router.push('/sim/strategy');
        }
      } catch (error) {
        console.error('Error loading simulation:', error);
        setError('Failed to load simulation');
        setLoading(false);
      }
    };

    if (simulationId) {
      loadSimulation();
    }
  }, [simulationId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading simulation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Simulation Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
