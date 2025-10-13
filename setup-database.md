# Database Setup Instructions

## ⚠️ IMPORTANT: Run This First!

The error you're seeing (`Could not find the table 'public.profiles'`) means the database schema hasn't been set up yet.

## Step 1: Run the Enhanced Schema

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to the **SQL Editor** (left sidebar)
4. Copy the **entire contents** of `supabase-schema-enhanced.sql`
5. Paste and **run the SQL script**
6. Wait for it to complete (should show "Success" message)

## Step 2: Verify Tables Created

Check that these tables exist in **Table Editor**:
- ✅ `profiles` (for theme settings)
- ✅ `simulations_enhanced`
- ✅ `quarterly_results`
- ✅ `decision_points`
- ✅ `wildcard_events`
- ✅ `tactics_used`
- ✅ `talent_hires`
- ✅ `big_bets`
- ✅ `ab_test_results`

## Step 3: Check Views

Verify these views were created:
- `leaderboard_view`
- `industry_averages`
- `user_statistics`

## Step 4: Test the Application

After running the schema, restart your development server and test:
1. Sign up/Login
2. Try creating a new simulation
3. Check that the theme picker works

## Troubleshooting

If you get errors about missing tables:
1. Make sure you ran the complete `supabase-schema-enhanced.sql` file
2. Check that your Supabase project URL and keys are correct in `.env.local`
3. Verify that Row Level Security policies are active

## Quick Test Query

Run this in Supabase SQL Editor to test:
```sql
SELECT COUNT(*) FROM simulations_enhanced;
```

If this returns a count (even 0), the table exists and is working.
