import { Suspense } from 'react';
import { SimulationProvider } from '@/context/SimulationProvider';

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
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
    </SimulationProvider>
  );
}
