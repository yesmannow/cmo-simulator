'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Brain, 
  Target, 
  TrendingUp,
  BarChart3,
  Zap,
  Star,
  ArrowRight,
  Play,
  Download,
  Users,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function CoefficientLanding() {
  const [activeTheme, setActiveTheme] = useState('aurora-tech');

  const themes = [
    {
      id: 'aurora-tech',
      name: 'Aurora Tech',
      description: 'Futuristic & Analytical',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'clinic-clean',
      name: 'Clinic Clean',
      description: 'Medical & Professional',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'heritage-serif',
      name: 'Heritage Serif',
      description: 'Luxe & Traditional',
      gradient: 'from-amber-500 to-blue-400'
    }
  ];

  const features = [
    {
      icon: Calculator,
      title: 'Marketing Mix Modeling',
      description: 'Real MMM algorithms with adstock effects, saturation curves, and cross-channel synergy',
      color: 'text-blue-500'
    },
    {
      icon: Brain,
      title: 'Multi-Touch Attribution',
      description: 'Advanced attribution modeling that reveals the true impact of each touchpoint',
      color: 'text-purple-500'
    },
    {
      icon: Target,
      title: 'Strategic Decision Making',
      description: 'Navigate complex trade-offs between growth, efficiency, and brand building',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Watch your coefficients update in real-time as you make strategic decisions',
      color: 'text-orange-500'
    }
  ];

  const coefficients = [
    { name: 'Adstock Decay', value: '0.73', description: 'Carryover effect of advertising spend' },
    { name: 'Saturation Point', value: '2.4M', description: 'Maximum efficient spend threshold' },
    { name: 'Hill Curve Shape', value: '1.8', description: 'Diminishing returns coefficient' },
    { name: 'Cross-Channel Synergy', value: '1.15x', description: 'Multiplier for channel interactions' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Star className="h-3 w-3 mr-1" />
                The Science of Growth
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-bold coefficient-text-gradient">
                Coefficient
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Master the mathematical foundations of marketing growth through 
                immersive simulation and real-world MMM algorithms.
              </p>
              
              <div className="flex justify-center space-x-4 pt-6">
                <Button size="lg" className="text-lg px-8 py-4 h-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Start Simulation
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <Download className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Analytical Environment</h2>
          <p className="text-muted-foreground">Experience Coefficient in different professional contexts</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  activeTheme === theme.id 
                    ? 'border-primary shadow-lg' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setActiveTheme(theme.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.gradient}`} />
                    <span>{theme.name}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The Mathematical Engine</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every decision has a quantifiable impact—a coefficient. 
            Coefficient teaches you to optimize these mathematical drivers of growth.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Coefficients Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Real-Time Coefficients</h2>
          <p className="text-xl text-muted-foreground">
            Watch the mathematical drivers update as you make strategic decisions
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {coefficients.map((coeff, index) => (
            <motion.div
              key={coeff.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="coefficient-value text-3xl font-bold mb-2">
                    {coeff.value}
                  </div>
                  <h3 className="font-semibold mb-2">{coeff.name}</h3>
                  <p className="text-sm text-muted-foreground">{coeff.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 py-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
          <h2 className="text-4xl font-bold">Ready to Master the Science of Growth?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of marketing professionals who have discovered the mathematical 
            foundations of strategic decision-making.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="text-lg px-8 py-4 h-auto">
              <Play className="h-5 w-5 mr-2" />
              Start Free Simulation
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
              <Users className="h-5 w-5 mr-2" />
              Join Community
            </Button>
          </div>
          
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>10,000+ professionals trained</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span>Industry recognized</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>15-30 min sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
