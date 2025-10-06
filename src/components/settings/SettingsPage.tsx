'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Palette,
  Accessibility,
  HelpCircle,
  Download
} from 'lucide-react';
import { useOnboardingTour } from '@/components/onboarding/OnboardingTour';

interface SettingsPageProps {
  onStartTour: () => void;
}

export function SettingsPage({ onStartTour }: SettingsPageProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showHints, setShowHints] = useState(true);

  const { hasCompletedTour, resetTour } = useOnboardingTour();

  const handleResetTour = () => {
    resetTour();
    onStartTour();
  };

  const handleExportData = () => {
    // Export user preferences and simulation data
    const settings = {
      soundEnabled,
      animationsEnabled,
      reducedMotion,
      highContrast,
      autoSave,
      showHints,
      tourCompleted: hasCompletedTour,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cmo-simulator-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings & Preferences</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize your CMO Simulator experience with accessibility options, preferences, and learning tools.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Learning & Tour Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Learning & Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Onboarding Tour</div>
                  <div className="text-sm text-muted-foreground">
                    {hasCompletedTour ? 'Completed' : 'Not started'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasCompletedTour && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Completed
                    </Badge>
                  )}
                  <Button
                    onClick={handleResetTour}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {hasCompletedTour ? 'Replay Tour' : 'Start Tour'}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Show Hints</div>
                  <div className="text-sm text-muted-foreground">
                    Display helpful tips during simulation
                  </div>
                </div>
                <Switch
                  checked={showHints}
                  onCheckedChange={setShowHints}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-Save Progress</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically save your simulation progress
                  </div>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Reduced Motion</div>
                  <div className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </div>
                </div>
                <Switch
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">High Contrast</div>
                  <div className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </div>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sound Effects</div>
                  <div className="text-sm text-muted-foreground">
                    Enable audio feedback and notifications
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Visual Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Animations</div>
                  <div className="text-sm text-muted-foreground">
                    Enable smooth transitions and effects
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {animationsEnabled ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Theme Preview</div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-primary" />
                  <div className="w-8 h-8 rounded bg-secondary" />
                  <div className="w-8 h-8 rounded bg-muted" />
                  <div className="w-8 h-8 rounded bg-accent" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Settings & Data
              </Button>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">
                  Privacy Notice
                </div>
                <div className="text-xs text-blue-700">
                  All simulation data is stored locally in your browser. No personal information is transmitted to external servers.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleResetTour}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Guided Tour
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
