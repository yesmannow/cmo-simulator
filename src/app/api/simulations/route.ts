import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rateLimit'
import { validateRequestBody, createSimulationSchema, validateBudgetAllocation } from '@/lib/validation/apiValidation'

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, {
    windowMs: 60000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  })

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
      { status: 429 }
    )
  }

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
      logger.error('Error fetching simulations', error)
      return NextResponse.json(
        { error: 'Failed to fetch simulations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ simulations })
  } catch (error) {
    logger.error('Unexpected error in GET simulations', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, {
    windowMs: 60000, // 1 minute
    maxRequests: 20, // 20 requests per minute (more restrictive for POST)
  })

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
      { status: 429 }
    )
  }

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

    // Parse and validate request body
    const body = await request.json()
    const validation = validateRequestBody(createSimulationSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error,
          details: validation.details?.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }

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
    } = validation.data

    // Validate budget allocation
    if (budget_brand_awareness !== undefined &&
        budget_lead_generation !== undefined &&
        budget_conversion_optimization !== undefined) {
      const budgetValidation = validateBudgetAllocation(
        budget_brand_awareness,
        budget_lead_generation,
        budget_conversion_optimization
      )

      if (!budgetValidation.valid) {
        return NextResponse.json(
          { error: budgetValidation.error },
          { status: 400 }
        )
      }
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
      logger.error('Error creating simulation', error)
      return NextResponse.json(
        { error: 'Failed to create simulation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ simulation }, { status: 201 })
  } catch (error) {
    logger.error('Unexpected error in GET simulations', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
