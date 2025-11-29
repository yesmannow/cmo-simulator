# Cloudflare Pages Environment Variables Setup

## Required Environment Variables

To fix the deployment errors, you need to set the following environment variables in your Cloudflare Pages dashboard:

### 1. Navigate to Environment Variables

1. Go to your Cloudflare Pages dashboard
2. Select your project: `cmo-simulator`
3. Go to **Settings** → **Environment Variables**
4. Click **Add variable** for each variable below

### 2. Add Required Variables

Add these two **required** environment variables:

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Type:** Plain text (or Secret if you prefer)
- **Value:** Your Supabase project URL
- **Example:** `https://xxxxxxxxxxxxx.supabase.co`
- **Environment:** Apply to all environments (Production, Preview, Branch)

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type:** Secret (recommended) or Plain text
- **Value:** Your Supabase anonymous/public key
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environment:** Apply to all environments (Production, Preview, Branch)

### 3. Optional Variables (if needed)

You can also add these optional variables if you're using these features:

- `NEXT_PUBLIC_AI_PROVIDER` - AI provider name (e.g., "openai")
- `NEXT_PUBLIC_OPENAI_API_KEY` - OpenAI API key (set as Secret)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key
- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Mixpanel token
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics measurement ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking

## How to Find Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## After Adding Variables

1. **Save** the environment variables
2. **Redeploy** your site:
   - Go to **Deployments** tab
   - Click the **...** menu on the latest deployment
   - Select **Retry deployment** or trigger a new deployment

## Verification

After deployment, check the build logs to ensure:
- ✅ No "Missing required environment variables" error
- ✅ Build completes successfully
- ✅ Site deploys without errors

## Troubleshooting

### Build Still Fails
- Double-check that variable names are **exactly** as shown (case-sensitive)
- Ensure variables are set for the correct environment (Production/Preview)
- Try redeploying after adding variables

### Runtime Errors
- Environment variables are available at runtime, not during build
- If you see runtime errors about missing variables, check that they're set in Cloudflare Pages dashboard
- Variables prefixed with `NEXT_PUBLIC_` are available in both server and client code

## Notes

- Environment variables are injected at **runtime**, not during build
- The build process has been updated to skip validation during build time
- Variables are available to your Next.js app once deployed
- Use **Secrets** for sensitive values like API keys

