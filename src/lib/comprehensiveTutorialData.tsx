/**
 * Comprehensive Tutorial Data
 * Extremely detailed, expert-level explanations for users with no marketing background
 * Assumes zero prior knowledge and explains everything step-by-step
 */

import { ReactNode } from 'react';

export interface ComprehensiveTutorialStep {
  id: string;
  title: string;
  content: ReactNode; // Can be string or JSX for rich content
  detailedExplanation?: string; // Extra detailed explanation
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
  keyTerms?: string[]; // Glossary term IDs to highlight
  tips?: string[];
  commonMistakes?: string[];
  expertInsight?: string;
}

export const comprehensiveTutorialSteps: Record<string, ComprehensiveTutorialStep[]> = {
  welcome: [
    {
      id: 'welcome-1',
      title: 'Welcome to CMO Simulator! 🎓',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Welcome! This is an interactive learning experience that teaches you real marketing strategy through hands-on practice.
            <strong> You don't need any marketing experience</strong> - we'll explain everything as we go.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">🎯 What You'll Learn:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>How to allocate a marketing budget effectively</li>
              <li>Which marketing tactics work best and why</li>
              <li>How to measure marketing success</li>
              <li>Strategic thinking for business growth</li>
            </ul>
          </div>
        </div>
      ),
      detailedExplanation: 'This simulator puts you in the role of a Chief Marketing Officer (CMO), the person responsible for all marketing decisions in a company. You\'ll make real decisions and see real consequences, learning by doing rather than just reading.',
      keyTerms: ['revenue', 'budget', 'marketing'],
      tips: [
        'Take your time - there\'s no rush',
        'Read all explanations carefully',
        'Don\'t worry about making mistakes - that\'s how you learn!',
      ],
      position: 'center',
    },
    {
      id: 'welcome-2',
      title: 'Your Mission: Manage a $2M Marketing Budget',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            You have <strong>$2,000,000</strong> to spend on marketing over 4 quarters (one year).
            Your goal is to maximize:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-semibold text-green-900 text-sm">💰 Revenue</p>
              <p className="text-xs text-green-700">Money from sales</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-semibold text-blue-900 text-sm">📊 Market Share</p>
              <p className="text-xs text-blue-700">Your % of the market</p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <p className="font-semibold text-pink-900 text-sm">😊 Customer Satisfaction</p>
              <p className="text-xs text-pink-700">How happy customers are</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-semibold text-purple-900 text-sm">🎯 Brand Awareness</p>
              <p className="text-xs text-purple-700">How many people know you</p>
            </div>
          </div>
        </div>
      ),
      detailedExplanation: 'Think of this like a business simulation game, but with real marketing principles. You\'ll make decisions each quarter (3 months) and see how they affect your business. The goal is to learn what works in marketing, not just to get a high score.',
      keyTerms: ['revenue', 'market-share', 'customer-satisfaction', 'brand-awareness', 'budget'],
      expertInsight: 'In real marketing, these four metrics are interconnected. High brand awareness helps with market share. Customer satisfaction drives repeat purchases (revenue). It\'s all connected!',
      position: 'center',
    },
    {
      id: 'welcome-3',
      title: 'How This Works: Learn by Doing',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            This isn't a lecture - it's <strong>experiential learning</strong>. Here's what to expect:
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold">Set Up Your Company</p>
                <p className="text-sm text-muted-foreground">Choose industry, company type, and initial strategy</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold">Make Quarterly Decisions</p>
                <p className="text-sm text-muted-foreground">Select marketing tactics, allocate budget, handle events</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold">See Results & Learn</p>
                <p className="text-sm text-muted-foreground">Review what worked, what didn't, and why</p>
              </div>
            </div>
          </div>
        </div>
      ),
      detailedExplanation: 'Each quarter, you\'ll choose marketing tactics (like running ads, creating content, hosting events). Each decision costs money and time, and produces different results. You\'ll see immediate feedback and learn what strategies work best.',
      tips: [
        'Hover over terms with question marks (?) to see definitions',
        'Read the explanations for each tactic before choosing',
        'Don\'t be afraid to experiment - you can always try again',
      ],
      position: 'center',
    },
  ],

  setup: [
    {
      id: 'setup-1',
      title: 'Step 1: Choose Your Industry',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            First, select your industry. This affects how marketing works for your business:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">🏥 Healthcare</p>
              <p className="text-muted-foreground">Long sales cycles, high trust required, regulatory considerations</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">⚖️ Legal Services</p>
              <p className="text-muted-foreground">Professional reputation critical, referral-based, relationship-focused</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">🛒 E-commerce</p>
              <p className="text-muted-foreground">Fast decisions, price-sensitive, digital-first</p>
            </div>
          </div>
        </div>
      ),
      detailedExplanation: 'Different industries have different customer behaviors. Healthcare customers research extensively and need trust. E-commerce customers make quick decisions based on price and reviews. Your industry choice affects which marketing tactics work best.',
      keyTerms: ['target-audience', 'positioning'],
      expertInsight: 'In real marketing, understanding your industry is crucial. Healthcare marketing focuses on trust and education. E-commerce focuses on conversion and convenience. Legal services focus on reputation and referrals.',
      target: '.industry-selection',
      position: 'right',
    },
    {
      id: 'setup-2',
      title: 'Step 2: Company Profile - Startup vs Enterprise',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Choose your company type. This affects your resources and constraints:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-semibold text-blue-900 mb-2">🚀 Startup</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Limited budget, must be efficient</li>
                <li>• Fast decisions, agile</li>
                <li>• Focus on growth</li>
                <li>• Higher risk tolerance</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-semibold text-purple-900 mb-2">🏢 Enterprise</p>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• Larger budget available</li>
                <li>• More established brand</li>
                <li>• Slower, more careful</li>
                <li>• Lower risk tolerance</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      detailedExplanation: 'Startups have less money but can move fast and take risks. Enterprises have more resources but move slower and are more cautious. Your choice affects how much budget you have and how quickly you can implement tactics.',
      keyTerms: ['budget', 'brand-equity'],
      commonMistakes: [
        'Startups: Don\'t try to compete with enterprise budgets - focus on efficiency',
        'Enterprises: Don\'t be too cautious - sometimes you need to take calculated risks',
      ],
      target: '.company-profile',
      position: 'right',
    },
    {
      id: 'setup-3',
      title: 'Step 3: Budget Allocation Strategy',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Distribute your $2M budget across three marketing areas. This is a <strong>critical strategic decision</strong>:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">🔵 Top of Funnel: Brand Awareness</p>
              <p className="text-sm text-blue-800 mb-2">
                Making people aware your company exists. Like putting up billboards or running TV ads.
              </p>
              <p className="text-xs text-blue-700">
                <strong>Best for:</strong> New companies, competitive markets, long-term growth
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">🟢 Middle of Funnel: Lead Generation</p>
              <p className="text-sm text-green-800 mb-2">
                Getting people interested and collecting their contact info. Like offering free guides in exchange for email.
              </p>
              <p className="text-xs text-green-700">
                <strong>Best for:</strong> Building your customer database, nurturing interest
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <p className="font-semibold text-purple-900 mb-2">🟣 Bottom of Funnel: Conversion</p>
              <p className="text-sm text-purple-800 mb-2">
                Turning interested people into paying customers. Like special offers, sales calls, demos.
              </p>
              <p className="text-xs text-purple-700">
                <strong>Best for:</strong> Immediate sales, maximizing revenue from existing interest
              </p>
            </div>
          </div>
        </div>
      ),
      detailedExplanation: 'This is called "funnel allocation" - the customer journey from "never heard of you" (top) to "buying customer" (bottom). Most companies need all three, but the balance matters. New companies need more awareness. Established companies focus more on conversion.',
      keyTerms: ['funnel', 'brand-awareness', 'leads', 'conversion-rate'],
      expertInsight: 'The 40-30-30 rule is common: 40% awareness, 30% lead gen, 30% conversion. But it depends on your situation. New companies might do 60-30-10. Established companies might do 20-30-50.',
      tips: [
        'Balance is key - don\'t put everything in one area',
        'If you\'re new, invest more in awareness',
        'If you have leads but low sales, invest more in conversion',
      ],
      target: '.budget-allocation',
      position: 'left',
    },
  ],

  strategy: [
    {
      id: 'strategy-1',
      title: 'Define Your Target Audience',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Your <strong>target audience</strong> is the specific group of people you want to reach.
            Instead of "everyone," you focus on people most likely to buy.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Example Target Audiences:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>B2B:</strong> "Small business owners, 30-50 years old, struggling with cash flow"</li>
              <li><strong>B2C:</strong> "Young professionals, 25-35, interested in fitness and wellness"</li>
              <li><strong>Healthcare:</strong> "Seniors, 65+, managing chronic conditions, tech-comfortable"</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Why this matters:</strong> Different audiences respond to different marketing.
            Seniors might prefer email and phone calls. Young professionals prefer social media and apps.
          </p>
        </div>
      ),
      detailedExplanation: 'Target audience definition includes demographics (age, location, income), psychographics (interests, values), and pain points (problems they need solved). The more specific you are, the better your marketing will work because you can speak directly to their needs.',
      keyTerms: ['target-audience', 'positioning', 'channels'],
      commonMistakes: [
        'Being too broad: "Everyone" is not a target audience',
        'Not considering where your audience spends time',
        'Ignoring pain points - what problems do they need solved?',
      ],
      target: '.target-audience',
      position: 'right',
    },
    {
      id: 'strategy-2',
      title: 'Brand Positioning: How Do You Want to Be Seen?',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            <strong>Positioning</strong> is how customers think about you compared to competitors.
            You can't be everything to everyone - choose your position:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">💎 Premium Quality</p>
              <p className="text-xs text-muted-foreground">"Best quality, higher price"</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">💰 Best Value</p>
              <p className="text-xs text-muted-foreground">"Great quality, fair price"</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">🚀 Innovation Leader</p>
              <p className="text-xs text-muted-foreground">"Cutting-edge technology"</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">❤️ Customer-Focused</p>
              <p className="text-xs text-muted-foreground">"Best service, customer-first"</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-900">
              <strong>Real Example:</strong> Tesla = Innovation Leader. Toyota = Best Value.
              Both sell cars, but positioned completely differently.
            </p>
          </div>
        </div>
      ),
      detailedExplanation: 'Positioning helps customers understand why they should choose you. If you position as "premium," you can charge more but must deliver exceptional quality. If you position as "value," you compete on price but need to be efficient. Your positioning affects which tactics work and how customers perceive you.',
      keyTerms: ['positioning', 'brand-equity', 'competition'],
      expertInsight: 'The best positioning is one you can actually deliver on. Don\'t claim "premium quality" if you can\'t deliver it. Don\'t claim "lowest price" if you can\'t compete on cost. Authenticity matters.',
      target: '.brand-positioning',
      position: 'right',
    },
  ],

  quarter: [
    {
      id: 'quarter-1',
      title: 'Understanding Quarterly Decision Making',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Each quarter (3 months), you'll make several important decisions:
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                1
              </div>
              <div>
                <p className="font-semibold">Select Marketing Tactics</p>
                <p className="text-sm text-muted-foreground">
                  Choose which marketing activities to run (ads, content, events, etc.)
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                2
              </div>
              <div>
                <p className="font-semibold">Allocate Budget & Time</p>
                <p className="text-sm text-muted-foreground">
                  Decide how much money and team time to spend on each tactic
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                3
              </div>
              <div>
                <p className="font-semibold">Handle Events</p>
                <p className="text-sm text-muted-foreground">
                  Respond to opportunities, crises, and market changes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                4
              </div>
              <div>
                <p className="font-semibold">Review Results</p>
                <p className="text-sm text-muted-foreground">
                  See how your decisions affected revenue, market share, and other metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      detailedExplanation: 'Quarterly planning is how real marketing works. You plan campaigns, execute them, measure results, and adjust. Each quarter builds on the previous one - success compounds over time.',
      keyTerms: ['tactics', 'budget', 'revenue', 'market-share'],
      tips: [
        'Read each tactic description carefully',
        'Consider how tactics work together',
        'Don\'t spread yourself too thin - focus on a few strong tactics',
      ],
      target: '.quarter-header',
      position: 'bottom',
    },
    {
      id: 'quarter-2',
      title: 'Understanding Marketing Tactics',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            <strong>Marketing tactics</strong> are specific actions you take. Each has different:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">💰 Cost</p>
              <p className="text-xs text-muted-foreground">How much money it requires</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">⏱️ Time</p>
              <p className="text-xs text-muted-foreground">How much team time needed</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">📈 Expected Impact</p>
              <p className="text-xs text-muted-foreground">What results you might see</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-semibold mb-1">🎯 Best For</p>
              <p className="text-xs text-muted-foreground">Which goals it helps achieve</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Example: Google Ads</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Cost:</strong> High - you pay per click</li>
              <li>• <strong>Time:</strong> Medium - needs ongoing management</li>
              <li>• <strong>Impact:</strong> Immediate traffic and leads</li>
              <li>• <strong>Best for:</strong> Quick results, lead generation</li>
            </ul>
          </div>
        </div>
      ),
      detailedExplanation: 'Different tactics work for different goals. Paid ads (Google, Facebook) give quick results but cost money every time. Content marketing (blogs, videos) takes time to build but compounds over time. Events create high engagement but are expensive. Choose tactics that match your goals and budget.',
      keyTerms: ['tactics', 'paid-ads', 'content-marketing', 'roi'],
      commonMistakes: [
        'Choosing tactics without considering your goals',
        'Not reading the expected impact',
        'Ignoring time requirements - you have limited team hours',
      ],
      target: '.tactic-selection',
      position: 'top',
    },
  ],
};

/**
 * Get tutorial steps for a specific phase
 */
export function getTutorialForPhase(phase: string): ComprehensiveTutorialStep[] {
  return comprehensiveTutorialSteps[phase] || [];
}

/**
 * Get all tutorial steps
 */
export function getAllTutorialSteps(): ComprehensiveTutorialStep[] {
  return Object.values(comprehensiveTutorialSteps).flat();
}

