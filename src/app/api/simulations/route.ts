import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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
      .from('simulations')
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
      name,
      revenue,
      profit,
      market_share,
      customer_satisfaction,
      brand_awareness,
      duration_weeks,
      budget,
      target_market,
      status = 'completed',
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Simulation name is required' },
        { status: 400 }
      )
    }

    // Insert new simulation
    const { data: simulation, error } = await supabase
      .from('simulations')
      .insert({
        user_id: user.id,
        name,
        status,
        revenue: revenue || 0,
        profit: profit || 0,
        market_share: market_share || 0,
        customer_satisfaction: customer_satisfaction || 0,
        brand_awareness: brand_awareness || 0,
        duration_weeks: duration_weeks || 12,
        budget: budget || 0,
        target_market: target_market || '',
        completed_at: status === 'completed' ? new Date().toISOString() : null,
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
