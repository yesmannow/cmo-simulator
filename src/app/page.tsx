import { redirect } from 'next/navigation'

export default function Home() {
  // Always redirect to simulator setup - no authentication required
  redirect('/sim/setup')
}
