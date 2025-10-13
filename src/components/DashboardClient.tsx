'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BrandPicker from '@/components/BrandPicker'
import SimulationTable from '@/components/SimulationTable'
import { useSimulations } from '@/hooks/useSimulations'
import { Play, BarChart3, Users, Target } from 'lucide-react'
import { HelpButton, TutorialOverlay } from '@/components/Tutorial'
import HelpPanel from '@/components/HelpPanel'
import { getTutorialForPhase } from '@/lib/tutorialData'

interface DashboardClientProps {
  userEmail: string
  userCreatedAt: string
  currentTheme: string
}

export default function DashboardClient({ userEmail, userCreatedAt, currentTheme }: DashboardClientProps) {
  const { simulations, loading, error, createSimulation } = useSimulations()
  const [isCreatingDemo, setIsCreatingDemo] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)

  const handleStartNewSimulation = async () => {
    // Create a new simulation with enhanced schema
    setIsCreatingDemo(true)
    try {
      await createSimulation({
        company_name: `My Company ${new Date().toLocaleDateString()}`,
        time_horizon: '1-year',
        industry: 'ecommerce',
        company_profile: 'startup',
        market_landscape: 'crowded',
        budget_brand_awareness: 33,
        budget_lead_generation: 33,
        budget_conversion_optimization: 34,
        total_budget: 500000,
        status: 'in_progress',
      })
    } catch (error) {
      console.error('Failed to create simulation:', error)
    } finally {
      setIsCreatingDemo(false)
    }
  }

  const dashboardTutorialSteps = getTutorialForPhase('dashboard')

  const totalRevenue = simulations.reduce((sum, sim) => sum + (sim.total_revenue || 0), 0)
  const totalProfit = simulations.reduce((sum, sim) => sum + (sim.total_profit || 0), 0)
  const avgMarketShare = simulations.length > 0 
    ? simulations.reduce((sum, sim) => sum + (sim.final_market_share || 0), 0) / simulations.length 
    : 0
  const avgSatisfaction = simulations.length > 0
    ? simulations.reduce((sum, sim) => sum + (sim.customer_satisfaction || 0), 0) / simulations.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Help Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userEmail}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <HelpButton onClick={() => setShowHelp(true)} />
          <Button
            onClick={() => setShowTutorial(true)}
            variant="outline"
            className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
          >
            Start Tutorial
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      {simulations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--accent)]">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {simulations.length} simulation{simulations.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <Target className="h-4 w-4 text-[var(--accent)]" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(totalProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalProfit >= 0 ? 'Profitable' : 'Loss'} overall
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Market Share</CardTitle>
              <Play className="h-4 w-4 text-[var(--accent)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--accent)]">
                {avgMarketShare.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Market penetration
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
              <Users className="h-4 w-4 text-[var(--accent)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--accent)]">
                {avgSatisfaction.toFixed(1)}/5.0
              </div>
              <p className="text-xs text-muted-foreground">
                Customer rating
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Simulation Table - Takes up 2 columns */}
        <div className="lg:col-span-2">
          {loading ? (
            <Card className="bg-[var(--card-bg)] border-[var(--border)]">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading simulations...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-[var(--card-bg)] border-[var(--border)]">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Error loading simulations: {error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SimulationTable
              simulations={simulations}
              onStartNewSimulation={handleStartNewSimulation}
            />
          )}
        </div>

        {/* Sidebar - Theme picker and profile info */}
        <div className="space-y-6">
          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--accent)]">Theme Customization</CardTitle>
              <CardDescription>
                Personalize your experience with custom brand themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrandPicker currentTheme={currentTheme} />
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--accent)]">Quick Actions</CardTitle>
              <CardDescription>
                Start a new simulation or explore features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleStartNewSimulation}
                disabled={isCreatingDemo}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                {isCreatingDemo ? 'Creating...' : 'Start Demo Simulation'}
              </Button>
              <Button variant="outline" className="w-full" disabled>
                View Analytics (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--accent)]">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Theme:</strong> {currentTheme}</p>
                <p><strong>Joined:</strong> {new Date(userCreatedAt).toLocaleDateString()}</p>
                <p><strong>Simulations:</strong> {simulations.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay
          steps={dashboardTutorialSteps}
          currentStep={tutorialStep}
          onNext={() => setTutorialStep(prev => prev + 1)}
          onPrevious={() => setTutorialStep(prev => prev - 1)}
          onClose={() => setShowTutorial(false)}
          onComplete={() => {
            setShowTutorial(false);
            setTutorialStep(0);
          }}
        />
      )}

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  )
}
