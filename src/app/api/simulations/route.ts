import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch simulations for the user
    const { data: simulations, error } = await supabase
      .from('simulations_enhanced')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching simulations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch simulations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ simulations })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      company_name,
      time_horizon = '1-year',
      industry = 'ecommerce',
      company_profile = 'startup',
      market_landscape = 'crowded',
      budget_brand_awareness = 33,
      budget_lead_generation = 33,
      budget_conversion_optimization = 34,
      total_budget = 500000,
      status = 'in_progress',
    } = body

    // Validate required fields
    if (!company_name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    // Insert new simulation
    const { data: simulation, error } = await supabase
      .from('simulations_enhanced')
      .insert({
        user_id: user.id,
        company_name,
        time_horizon,
        industry,
        company_profile,
        market_landscape,
        budget_brand_awareness,
        budget_lead_generation,
        budget_conversion_optimization,
        total_budget,
        status,
        current_quarter: 'Q1',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating simulation:', error)
      return NextResponse.json(
        { error: 'Failed to create simulation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ simulation }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
