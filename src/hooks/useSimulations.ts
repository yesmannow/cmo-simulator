'use client'

import { useState, useEffect } from 'react'
import { Simulation } from '@/types/simulation'

export function useSimulations() {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSimulations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/simulations')
      
      if (!response.ok) {
        throw new Error('Failed to fetch simulations')
      }
      
      const data = await response.json()
      setSimulations(data.simulations || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createSimulation = async (simulationData: Partial<Simulation>) => {
    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simulationData),
      })

      if (!response.ok) {
        throw new Error('Failed to create simulation')
      }

      const data = await response.json()
      setSimulations(prev => [data.simulation, ...prev])
      return data.simulation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    fetchSimulations()
  }, [])

  return {
    simulations,
    loading,
    error,
    refetch: fetchSimulations,
    createSimulation,
  }
}
