'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, TrendingUp, Target, Zap } from 'lucide-react';

export interface ABTest {
  id: string;
  industry: 'healthcare' | 'legal' | 'ecommerce';
  context: string;
  adA: {
    id: 'A';
    headline: string;
    body: string;
    cta: string;
    approach: string;
  };
  adB: {
    id: 'B';
    headline: string;
    body: string;
    cta: string;
    approach: string;
  };
  correctAnswer: 'A' | 'B';
  explanation: string;
  educationalInsight: string;
  impactOnCampaign: {
    winner: {
      cpaReduction: number; // % reduction in cost per acquisition
      conversionBoost: number; // % increase in conversions
    };
    loser: {
      cpaIncrease: number;
      conversionPenalty: number;
    };
  };
}

const AB_TESTS: Record<string, ABTest[]> = {
  healthcare: [
    {
      id: 'healthcare-1',
      industry: 'healthcare',
      context: 'You\'re launching a Facebook ad campaign for a new telehealth service targeting busy professionals.',
      adA: {
        id: 'A',
        headline: 'Advanced Telemedicine Platform',
        body: 'Our HIPAA-compliant platform uses cutting-edge technology for remote consultations.',
        cta: 'Learn More',
        approach: 'Feature-focused'
      },
      adB: {
        id: 'B',
        headline: 'See a Doctor from Your Couch',
        body: 'Skip the waiting room. Get diagnosed and treated in 15 minutes, from anywhere.',
        cta: 'Book Now',
        approach: 'Benefit-focused'
      },
      correctAnswer: 'B',
      explanation: 'Ad B wins because it focuses on the customer\'s pain point (waiting rooms, time) and the benefit (convenience, speed) rather than technical features.',
      educationalInsight: 'Customers don\'t buy features, they buy outcomes. "HIPAA-compliant" is important but not emotionally compelling. "See a doctor from your couch" paints a picture of the desired outcome.',
      impactOnCampaign: {
        winner: { cpaReduction: 25, conversionBoost: 35 },
        loser: { cpaIncrease: 15, conversionPenalty: 20 }
      }
    },
    {
      id: 'healthcare-2',
      industry: 'healthcare',
      context: 'Google Search ad for a dental practice targeting people searching "emergency dentist near me".',
      adA: {
        id: 'A',
        headline: 'Emergency Dental Care - Same Day',
        body: 'Severe tooth pain? We can see you today. Open 7 days. Call now.',
        cta: 'Call Now',
        approach: 'Urgency-focused'
      },
      adB: {
        id: 'B',
        headline: 'Award-Winning Dental Practice',
        body: 'Serving the community for 20 years. State-of-the-art equipment.',
        cta: 'Schedule Appointment',
        approach: 'Credibility-focused'
      },
      correctAnswer: 'A',
      explanation: 'Ad A matches the searcher\'s urgent intent. Someone searching "emergency dentist" needs immediate help, not a history lesson.',
      educationalInsight: 'Match your message to search intent. Emergency searches require urgent, action-oriented messaging. Credibility matters, but not in the first touchpoint for emergency needs.',
      impactOnCampaign: {
        winner: { cpaReduction: 30, conversionBoost: 45 },
        loser: { cpaIncrease: 20, conversionPenalty: 30 }
      }
    }
  ],
  
  legal: [
    {
      id: 'legal-1',
      industry: 'legal',
      context: 'LinkedIn ad campaign for a business law firm targeting small business owners.',
      adA: {
        id: 'A',
        headline: 'Protect Your Business',
        body: 'One lawsuit could destroy everything you\'ve built. Our business attorneys have your back.',
        cta: 'Free Consultation',
        approach: 'Fear-based'
      },
      adB: {
        id: 'B',
        headline: 'Grow Your Business with Confidence',
        body: 'Smart legal strategy turns risk into opportunity. Let\'s build your success together.',
        cta: 'Free Consultation',
        approach: 'Aspiration-based'
      },
      correctAnswer: 'B',
      explanation: 'Ad B wins because small business owners are aspirational. While fear can work, positioning legal services as a growth enabler (not just risk mitigation) resonates better with entrepreneurs.',
      educationalInsight: 'Know your audience\'s mindset. Entrepreneurs are optimistic by nature. Framing legal services as a growth tool rather than defensive necessity aligns with their worldview.',
      impactOnCampaign: {
        winner: { cpaReduction: 20, conversionBoost: 28 },
        loser: { cpaIncrease: 10, conversionPenalty: 15 }
      }
    },
    {
      id: 'legal-2',
      industry: 'legal',
      context: 'Google Search ad for personal injury law firm, targeting "car accident lawyer".',
      adA: {
        id: 'A',
        headline: 'Car Accident? Get What You Deserve',
        body: 'We\'ve won $50M+ for clients. No fee unless we win. Call 24/7.',
        cta: 'Call Now',
        approach: 'Results-focused'
      },
      adB: {
        id: 'B',
        headline: 'Experienced Car Accident Attorneys',
        body: 'Harvard-educated lawyers with 25 years of experience in personal injury law.',
        cta: 'Contact Us',
        approach: 'Credentials-focused'
      },
      correctAnswer: 'A',
      explanation: 'Ad A wins because it addresses the searcher\'s immediate concern (getting compensation) and removes risk (no fee unless we win). Credentials matter less than results in personal injury.',
      educationalInsight: 'In high-stakes, emotional decisions like choosing a personal injury lawyer, prospects want proof of results and risk removal, not just credentials.',
      impactOnCampaign: {
        winner: { cpaReduction: 35, conversionBoost: 40 },
        loser: { cpaIncrease: 18, conversionPenalty: 25 }
      }
    }
  ],
  
  ecommerce: [
    {
      id: 'ecommerce-1',
      industry: 'ecommerce',
      context: 'Instagram ad for a sustainable fashion brand targeting eco-conscious millennials.',
      adA: {
        id: 'A',
        headline: 'Organic Cotton. Carbon Neutral Shipping.',
        body: 'Every purchase plants 3 trees. Certified B-Corp. Shop sustainable fashion.',
        cta: 'Shop Now',
        approach: 'Values-focused'
      },
      adB: {
        id: 'B',
        headline: 'Look Good. Feel Good.',
        body: 'Stylish clothes that happen to be sustainable. Free returns. 20% off first order.',
        cta: 'Get 20% Off',
        approach: 'Style + incentive-focused'
      },
      correctAnswer: 'B',
      explanation: 'Ad B wins because even eco-conscious shoppers prioritize style and value. Sustainability is a tiebreaker, not the primary purchase driver for most consumers.',
      educationalInsight: 'Don\'t assume values-based messaging always wins with values-driven audiences. People still want the core product benefit (style, quality) first, with values as a bonus.',
      impactOnCampaign: {
        winner: { cpaReduction: 22, conversionBoost: 32 },
        loser: { cpaIncrease: 12, conversionPenalty: 18 }
      }
    },
    {
      id: 'ecommerce-2',
      industry: 'ecommerce',
      context: 'Facebook ad for a premium coffee subscription service.',
      adA: {
        id: 'A',
        headline: 'Single-Origin, Small-Batch Coffee',
        body: 'Ethically sourced beans from award-winning roasters. Delivered monthly.',
        cta: 'Subscribe',
        approach: 'Quality-focused'
      },
      adB: {
        id: 'B',
        headline: 'Never Run Out of Great Coffee',
        body: 'Wake up to freshly roasted beans at your door. Skip, pause, or cancel anytime.',
        cta: 'Start Free Trial',
        approach: 'Convenience-focused'
      },
      correctAnswer: 'B',
      explanation: 'Ad B wins because it emphasizes the subscription benefit (never running out) and removes friction (free trial, easy cancellation). Coffee quality is assumed.',
      educationalInsight: 'For subscription products, convenience and flexibility often outweigh product features. Address the subscription objection (commitment fear) directly.',
      impactOnCampaign: {
        winner: { cpaReduction: 28, conversionBoost: 38 },
        loser: { cpaIncrease: 15, conversionPenalty: 22 }
      }
    },
    {
      id: 'ecommerce-3',
      industry: 'ecommerce',
      context: 'Google Shopping ad for wireless headphones during holiday season.',
      adA: {
        id: 'A',
        headline: 'Premium Wireless Headphones - $199',
        body: '40hr battery. Active noise cancellation. Premium sound.',
        cta: 'Buy Now',
        approach: 'Feature-focused'
      },
      adB: {
        id: 'B',
        headline: 'Wireless Headphones - $199 (Was $299)',
        body: 'Save $100. Free gift wrapping. Arrives before Dec 25.',
        cta: 'Order Now',
        approach: 'Urgency + value-focused'
      },
      correctAnswer: 'B',
      explanation: 'Ad B wins during holiday season by emphasizing the discount, gift-readiness, and delivery guarantee. Features matter less when buying gifts under time pressure.',
      educationalInsight: 'Context matters. The same product needs different messaging in different seasons. Holiday shoppers prioritize deals, gifting convenience, and delivery timing.',
      impactOnCampaign: {
        winner: { cpaReduction: 32, conversionBoost: 42 },
        loser: { cpaIncrease: 16, conversionPenalty: 24 }
      }
    }
  ]
};

interface ABTestMiniGameProps {
  industry: 'healthcare' | 'legal' | 'ecommerce';
  onComplete: (result: { selectedCorrectly: boolean; impact: ABTest['impactOnCampaign']['winner'] | ABTest['impactOnCampaign']['loser'] }) => void;
}

export default function ABTestMiniGame({ industry, onComplete }: ABTestMiniGameProps) {
  const [selectedAd, setSelectedAd] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Select random test for the industry
  const tests = AB_TESTS[industry];
  const [currentTest] = useState(() => tests[Math.floor(Math.random() * tests.length)]);
  
  const handleSelect = (choice: 'A' | 'B') => {
    setSelectedAd(choice);
  };
  
  const handleSubmit = () => {
    setShowResult(true);
  };
  
  const handleContinue = () => {
    const isCorrect = selectedAd === currentTest.correctAnswer;
    const impact = isCorrect ? currentTest.impactOnCampaign.winner : currentTest.impactOnCampaign.loser;
    onComplete({ selectedCorrectly: isCorrect, impact });
  };
  
  const isCorrect = selectedAd === currentTest.correctAnswer;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">A/B Test Challenge</span>
        </div>
        <h2 className="text-2xl font-bold">Choose the Winning Ad</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {currentTest.context}
        </p>
      </div>

      {/* Ad Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ad A */}
        <motion.div
          whileHover={!showResult ? { scale: 1.02 } : {}}
          whileTap={!showResult ? { scale: 0.98 } : {}}
        >
          <Card
            className={`cursor-pointer transition-all h-full ${
              selectedAd === 'A' 
                ? 'border-2 border-primary shadow-lg' 
                : 'border hover:border-primary/50'
            } ${
              showResult && currentTest.correctAnswer === 'A'
                ? 'border-2 border-green-500 bg-green-500/5'
                : showResult && selectedAd === 'A'
                ? 'border-2 border-red-500 bg-red-500/5'
                : ''
            }`}
            onClick={() => !showResult && handleSelect('A')}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">Ad A</Badge>
                {showResult && currentTest.correctAnswer === 'A' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {showResult && selectedAd === 'A' && currentTest.correctAnswer !== 'A' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <CardTitle className="text-xl">{currentTest.adA.headline}</CardTitle>
              <CardDescription className="text-base">{currentTest.adA.body}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="secondary">
                {currentTest.adA.cta}
              </Button>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Approach</p>
                <p className="text-sm font-medium">{currentTest.adA.approach}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ad B */}
        <motion.div
          whileHover={!showResult ? { scale: 1.02 } : {}}
          whileTap={!showResult ? { scale: 0.98 } : {}}
        >
          <Card
            className={`cursor-pointer transition-all h-full ${
              selectedAd === 'B' 
                ? 'border-2 border-primary shadow-lg' 
                : 'border hover:border-primary/50'
            } ${
              showResult && currentTest.correctAnswer === 'B'
                ? 'border-2 border-green-500 bg-green-500/5'
                : showResult && selectedAd === 'B'
                ? 'border-2 border-red-500 bg-red-500/5'
                : ''
            }`}
            onClick={() => !showResult && handleSelect('B')}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">Ad B</Badge>
                {showResult && currentTest.correctAnswer === 'B' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {showResult && selectedAd === 'B' && currentTest.correctAnswer !== 'B' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <CardTitle className="text-xl">{currentTest.adB.headline}</CardTitle>
              <CardDescription className="text-base">{currentTest.adB.body}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="secondary">
                {currentTest.adB.cta}
              </Button>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Approach</p>
                <p className="text-sm font-medium">{currentTest.adB.approach}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Result & Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className={`border-2 ${isCorrect ? 'border-green-500 bg-green-500/5' : 'border-orange-500 bg-orange-500/5'}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                      <div>
                        <CardTitle className="text-green-700 dark:text-green-400">Correct! 🎉</CardTitle>
                        <CardDescription>You chose the winning ad</CardDescription>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8 text-orange-500" />
                      <div>
                        <CardTitle className="text-orange-700 dark:text-orange-400">Not Quite</CardTitle>
                        <CardDescription>Ad {currentTest.correctAnswer} would have performed better</CardDescription>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Explanation */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Why This Matters
                  </h4>
                  <p className="text-sm text-muted-foreground">{currentTest.explanation}</p>
                </div>

                {/* Educational Insight */}
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Marketing Principle
                  </h4>
                  <p className="text-sm">{currentTest.educationalInsight}</p>
                </div>

                {/* Impact on Campaign */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10' : 'bg-muted'}`}>
                    <p className="text-xs text-muted-foreground mb-1">Your Campaign Impact</p>
                    {isCorrect ? (
                      <>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ↓ {currentTest.impactOnCampaign.winner.cpaReduction}% Cost Per Acquisition
                        </p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ↑ {currentTest.impactOnCampaign.winner.conversionBoost}% Conversions
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          ↑ {currentTest.impactOnCampaign.loser.cpaIncrease}% Cost Per Acquisition
                        </p>
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          ↓ {currentTest.impactOnCampaign.loser.conversionPenalty}% Conversions
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">What You Learned</p>
                    <p className="text-sm">
                      {isCorrect 
                        ? 'Strong creative testing skills will save you thousands in wasted ad spend!'
                        : 'Every marketer makes mistakes. The key is testing and learning quickly.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <div className="flex justify-center">
        {!showResult ? (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedAd}
            className="px-8"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleContinue}
            className="px-8"
          >
            Continue to Campaign
          </Button>
        )}
      </div>
    </div>
  );
}
