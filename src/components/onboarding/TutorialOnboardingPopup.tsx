'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Play, BookOpen, X, Sparkles } from 'lucide-react';
import { ComprehensiveTutorial } from '@/components/tutorial/ComprehensiveTutorial';
import { getTutorialForPhase } from '@/lib/comprehensiveTutorialData';

interface TutorialOnboardingPopupProps {
  isOpen: boolean;
  onStartTutorial: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export function TutorialOnboardingPopup({
  isOpen,
  onStartTutorial,
  onSkip,
  onClose,
}: TutorialOnboardingPopupProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const welcomeSteps = getTutorialForPhase('welcome');

  if (!isOpen) return null;

  const handleStartTutorial = () => {
    setShowTutorial(true);
    onStartTutorial();
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showTutorial && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
              onClick={onSkip}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed inset-0 z-[2001] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-2xl shadow-2xl border-2 border-primary/20 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full -ml-12 -mb-12 blur-2xl" />

                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-1">Welcome to CMO Simulator! 🎓</CardTitle>
                        <p className="text-muted-foreground">
                          Learn real marketing strategy through hands-on experience
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSkip}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-6">
                  {/* Main Message */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-base leading-relaxed mb-4">
                      <strong>New to marketing?</strong> No problem! We've built a comprehensive tutorial system
                      that explains everything step-by-step, assuming you have zero marketing experience.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can start playing immediately, or take 5 minutes to learn the fundamentals first.
                      The choice is yours!
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Tutorial Option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-primary/30 rounded-lg p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 hover:border-primary/50 transition-all cursor-pointer"
                      onClick={handleStartTutorial}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Take the Tutorial</h3>
                          <p className="text-sm text-muted-foreground">5-10 minutes</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Step-by-step guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Learn key marketing concepts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Understand how decisions affect results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Get expert tips and avoid common mistakes</span>
                        </li>
                      </ul>
                      <Button className="w-full" size="lg">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Tutorial
                      </Button>
                    </motion.div>

                    {/* Skip Option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-muted rounded-lg p-6 hover:border-primary/30 transition-all cursor-pointer"
                      onClick={onSkip}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Jump Right In</h3>
                          <p className="text-sm text-muted-foreground">Start playing now</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        You can always access the tutorial later by clicking the Help button (?)
                        in the top right corner of any page.
                      </p>
                      <Button variant="outline" className="w-full" size="lg" onClick={onSkip}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Playing
                      </Button>
                    </motion.div>
                  </div>

                  {/* Helpful Note */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900">
                      <strong>💡 Tip:</strong> Throughout the simulation, look for question mark icons (?)
                      next to terms. Click them to see definitions and explanations. You can also access
                      the full glossary and contextual help at any time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <ComprehensiveTutorial
          steps={welcomeSteps}
          isOpen={showTutorial}
          onClose={() => {
            setShowTutorial(false);
            onClose();
          }}
          onComplete={handleTutorialComplete}
          showProgress={true}
          skipable={true}
        />
      )}
    </>
  );
}

