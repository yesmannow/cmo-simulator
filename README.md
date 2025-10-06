# CMO Simulator

A Next.js 15 application with Supabase authentication, customizable brand themes, and marketing simulation capabilities.

## Features

### Phase 1: App Foundation & Auth ✅
- Next.js 15 with App Router
- Supabase cookie-based authentication with SSR sessions
- Tailwind CSS & shadcn/ui components
- Protected routes with middleware
- Login, signup, and dashboard pages

### Phase 2: Theme Picker & Brand Styling ✅
- Custom BrandPicker component with 5 brand themes:
  - **Aurora Tech**: Modern tech with vibrant gradients
  - **Heritage Serif**: Classic elegance with serif typography
  - **Clinic Clean**: Minimal medical-inspired design
  - **Forest Nature**: Earthy greens and natural tones
  - **Sunset Warm**: Warm oranges and golden hues
- CSS custom properties for dynamic theming
- Theme persistence to Supabase user profiles
- Real-time theme switching with data-theme attributes

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
3. This will create:
   - `profiles` table for user theme preferences
   - Row Level Security policies
   - Automatic profile creation trigger

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── login/             # Authentication login page
│   ├── signup/            # User registration page
│   ├── globals.css        # Global styles with theme variables
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── BrandPicker.tsx    # Theme selection component
│   └── LogoutButton.tsx   # Authentication logout
├── lib/
│   └── supabase/          # Supabase client configurations
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       └── middleware.ts  # Auth middleware
└── middleware.ts          # Next.js middleware for route protection
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Supabase Auth with SSR
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS with CSS custom properties
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Theme System

The application uses CSS custom properties for dynamic theming:

- `--bg`: Background color
- `--card-bg`: Card background color
- `--text`: Text color
- `--accent`: Accent/primary color
- `--accent-hover`: Accent hover state
- `--border`: Border color

Themes are applied via `data-theme` attributes on the HTML element and persisted to the user's Supabase profile.
