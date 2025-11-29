'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // For development/demo mode, automatically redirect to the simulator setup
  useEffect(() => {
    // Check if we're in demo mode (no Supabase configured)
    const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (isDemo || process.env.NODE_ENV === 'development') {
      // Short delay to show the page briefly, then redirect
      const timer = setTimeout(() => {
        router.push('/sim/setup');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const handleStartDemo = () => {
    router.push('/sim/setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">CMO Simulator</CardTitle>
          <CardDescription>
            Master marketing strategy through hands-on simulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Experience the challenges of being a Chief Marketing Officer. 
            Make strategic decisions, allocate budgets, and build your brand.
          </p>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleStartDemo}
          >
            Start Simulator
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            No account required. Jump right in and start learning!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
