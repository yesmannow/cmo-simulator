# Quick Fixes Guide

This document provides step-by-step instructions for fixing the most critical issues identified in the audit.

## 🔴 Critical Fixes (Do These First)

### 1. Fix TypeScript Build Configuration

**File:** `next.config.ts`

**Current:**
```typescript
typescript: {
  ignoreBuildErrors: true, // ❌ BAD
}
```

**Fixed:**
```typescript
typescript: {
  ignoreBuildErrors: false, // ✅ GOOD
}
```

### 2. Fix ESLint Configuration

**File:** `eslint.config.mjs`

**Current:**
```javascript
const eslintConfig = [
  {
    ignores: ["**/*"], // ❌ BAD - ignores everything
  },
];
```

**Fixed:**
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

**Also update:** `next.config.ts`
```typescript
eslint: {
  ignoreDuringBuilds: false, // ✅ GOOD
}
```

### 3. Create .env.example File

**File:** `.env.example` (create new file)

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Insights (Optional)
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_AI_MODEL=gpt-4-turbo-preview

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_key_here
NEXT_PUBLIC_MIXPANEL_TOKEN=your_token_here
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_id_here

# Error Tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
```

### 4. Add Environment Variable Validation

**File:** `src/lib/env.ts` (create new file)

```typescript
/**
 * Environment variable validation
 * Throws error on app startup if required vars are missing
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

export function validateEnv() {
  const missing: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }
}

// Validate on module load (only in Node.js environment)
if (typeof window === 'undefined') {
  validateEnv();
}
```

**Then import in:** `src/app/layout.tsx`
```typescript
import '@/lib/env'; // Add this at the top
```

### 5. Fix Supabase Server Client

**File:** `src/lib/supabase/server.ts`

**Current:**
```typescript
return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // ...
);
```

**Fixed:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

return createServerClient(supabaseUrl, supabaseKey, {
  // ... rest of config
});
```

## 🟠 High Priority Fixes

### 6. Create Logger Utility

**File:** `src/lib/logger.ts` (create new file)

```typescript
/**
 * Centralized logging utility
 * Replaces console.log/error/warn throughout the application
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  log(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[LOG] ${message}`, context || '');
    }
    // In production, send to logging service
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(`[ERROR] ${message}`, error, context || '');
    // In production, send to error tracking service (Sentry, etc.)
  }

  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    // In production, send to logging service
  }

  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }
}

export const logger = new Logger();
```

**Usage:** Replace all `console.log` with `logger.log`, etc.

### 7. Add Constants File

**File:** `src/lib/constants.ts` (create new file)

```typescript
/**
 * Application constants
 * Centralizes magic numbers and configuration values
 */

// Default Values
export const DEFAULT_INDUSTRY = 'healthcare' as const;
export const DEFAULT_THEME = 'aurora-tech' as const;

// Scoring Constants
export const SEO_COMPOUNDING_RATE = 0.15; // 15% per quarter
export const BRAND_EQUITY_DECAY = 0.05; // 5% per quarter
export const MARKET_SHARE_INERTIA = 0.3; // 30% of previous share

// Budget Constants
export const BUDGET_ALLOCATION_MIN = 0;
export const BUDGET_ALLOCATION_MAX = 100;
export const BUDGET_ALLOCATION_TOTAL = 100;

// Time Constants
export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
export const TIME_HORIZONS = ['1-year', '3-year', '5-year'] as const;

// Industries
export const INDUSTRIES = ['healthcare', 'legal', 'ecommerce'] as const;

// Company Profiles
export const COMPANY_PROFILES = ['startup', 'enterprise'] as const;

// Market Landscapes
export const MARKET_LANDSCAPES = ['disruptor', 'crowded', 'frontier'] as const;
```

### 8. Fix Store Type

**File:** `src/lib/store.ts`

**Find:**
```typescript
plannedPromotions: any[]; // TODO: define Promotion type
```

**Replace with:**
```typescript
interface Promotion {
  id: string;
  name: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}

plannedPromotions: Promotion[];
```

## 🟡 Medium Priority Fixes

### 9. Add Health Check Endpoint

**File:** `src/app/api/health/route.ts` (create new file)

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check database connection
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      return NextResponse.json(
        { status: 'unhealthy', error: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
```

### 10. Add LICENSE File

**File:** `LICENSE` (create new file)

```
MIT License

Copyright (c) 2025 CMO Simulator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Implementation Order

1. ✅ Fix TypeScript config (5 min)
2. ✅ Fix ESLint config (10 min)
3. ✅ Create .env.example (5 min)
4. ✅ Add env validation (15 min)
5. ✅ Fix Supabase client (5 min)
6. ✅ Create logger utility (20 min)
7. ✅ Create constants file (30 min)
8. ✅ Fix store type (10 min)
9. ✅ Add health check (15 min)
10. ✅ Add LICENSE (5 min)

**Total Time:** ~2 hours for critical and high-priority fixes

## Testing After Fixes

1. Run `npm run build` - should complete without errors
2. Run `npm run lint` - should show actual linting errors (fix them)
3. Run `npm run typecheck` - should show type errors (fix them)
4. Test app startup - should validate env vars
5. Test health endpoint - `/api/health` should return healthy status

