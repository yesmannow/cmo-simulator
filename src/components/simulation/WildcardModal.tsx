'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, TrendingDown, Users, DollarSign, Clock } from 'lucide-react';
import { WildcardEvent } from '@/lib/simMachine';

interface WildcardModalProps {
  wildcard: WildcardEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onChoose: (choiceId: string) => void;
}

export function WildcardModal({ wildcard, isOpen, onClose, onChoose }: WildcardModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!wildcard) return null;

  const getTypeIcon = (type: WildcardEvent['type']) => {
    switch (type) {
      case 'crisis': return AlertTriangle;
      case 'opportunity': return Zap;
      case 'market_shift': return TrendingDown;
      case 'competitor_action': return Users;
      default: return AlertTriangle;
    }
  };

  const getTypeColor = (type: WildcardEvent['type']) => {
    switch (type) {
      case 'crisis': return 'text-red-600 bg-red-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'market_shift': return 'text-orange-600 bg-orange-100';
      case 'competitor_action': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleChoose = () => {
    if (selectedChoice) {
      onChoose(selectedChoice);
      setSelectedChoice(null);
      onClose();
    }
  };

  const TypeIcon = getTypeIcon(wildcard.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${getTypeColor(wildcard.type)}`}>
              <TypeIcon className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl">{wildcard.title}</DialogTitle>
              <Badge className={getTypeColor(wildcard.type).replace('text-', 'bg-').replace('bg-', 'text-')}>
                {wildcard.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {wildcard.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Choose Your Response:</h3>
          
          <div className="grid gap-4">
            {wildcard.choices.map((choice) => (
              <Card 
                key={choice.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedChoice === choice.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedChoice(choice.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>{choice.title}</span>
                    <div className="flex items-center gap-4 text-sm">
                      {choice.cost > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <DollarSign className="h-4 w-4" />
                          ${choice.cost.toLocaleString()}
                        </div>
                      )}
                      {choice.timeRequired > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-4 w-4" />
                          {choice.timeRequired}h
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{choice.description}</p>
                  
                  {/* Impact Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.revenue >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.revenue >= 0 ? '+' : ''}${choice.impact.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.profit >= 0 ? '+' : ''}${choice.impact.profit.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Profit</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.marketShare >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.marketShare >= 0 ? '+' : ''}{choice.impact.marketShare}%
                      </div>
                      <div className="text-xs text-muted-foreground">Market Share</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.customerSatisfaction >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.customerSatisfaction >= 0 ? '+' : ''}{choice.impact.customerSatisfaction}%
                      </div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.brandAwareness >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.brandAwareness >= 0 ? '+' : ''}{choice.impact.brandAwareness}%
                      </div>
                      <div className="text-xs text-muted-foreground">Awareness</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleChoose}
              disabled={!selectedChoice}
            >
              Confirm Choice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
