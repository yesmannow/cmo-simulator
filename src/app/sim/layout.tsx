import { Suspense } from 'react';
import Link from 'next/link';

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Simple navigation header */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/sim/setup" className="font-bold text-lg flex items-center gap-2">
            🎮 CMO Simulator
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/progress" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              🏆 Progress
            </Link>
            <Link 
              href="/engine-demo" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Engine Demo
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
