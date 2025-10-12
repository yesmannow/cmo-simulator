'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Star, 
  Award,
  Briefcase,
  Heart,
  Zap
} from 'lucide-react';
import { TalentCandidate } from '@/lib/talentMarket';

interface TalentMarketModalProps {
  candidates: TalentCandidate[];
  isOpen: boolean;
  onClose: () => void;
  onHire: (candidate: TalentCandidate) => void;
  availableBudget: number;
}

export function TalentMarketModal({ 
  candidates, 
  isOpen, 
  onClose, 
  onHire, 
  availableBudget 
}: TalentMarketModalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<TalentCandidate | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleHire = () => {
    if (selectedCandidate) {
      onHire(selectedCandidate);
      setSelectedCandidate(null);
      setShowDetails(false);
      onClose();
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'junior': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canAfford = (candidate: TalentCandidate) => {
    return availableBudget >= candidate.hiringCost;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Briefcase className="h-6 w-6" />
            Talent Market - Q2 Hiring Opportunity
          </DialogTitle>
          <p className="text-muted-foreground">
            Hire exceptional talent to boost your team&apos;s capabilities and performance.
          </p>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Candidate Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Candidates</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Budget: ${availableBudget.toLocaleString()}
              </Badge>
            </div>

            <div className="space-y-3">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCandidate?.id === candidate.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    } ${!canAfford(candidate) ? 'opacity-60' : ''}`}
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowDetails(true);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{candidate.avatar}</div>
                          <div>
                            <CardTitle className="text-base">{candidate.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{candidate.role}</p>
                          </div>
                        </div>
                        <Badge className={getExperienceColor(candidate.experience)}>
                          {candidate.experience}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span>${candidate.hiringCost.toLocaleString()} hiring</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-blue-600" />
                          <span>+${candidate.impact.revenue.toLocaleString()}/yr</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Revenue Impact</span>
                          <span>+{((candidate.impact.revenue / 500000) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress 
                          value={Math.min(((candidate.impact.revenue / 500000) * 100), 100)} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{candidate.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {!canAfford(candidate) && (
                        <div className="text-xs text-red-600 font-medium">
                          Insufficient budget
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Candidate Details */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {showDetails && selectedCandidate ? (
                <motion.div
                  key={selectedCandidate.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Candidate Profile</h3>
                    <Button
                      onClick={handleHire}
                      disabled={!canAfford(selectedCandidate)}
                      className="px-6"
                    >
                      Hire {selectedCandidate.name}
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{selectedCandidate.avatar}</div>
                        <div>
                          <CardTitle>{selectedCandidate.name}</CardTitle>
                          <p className="text-muted-foreground">{selectedCandidate.role}</p>
                          <Badge className={getExperienceColor(selectedCandidate.experience)}>
                            {selectedCandidate.experience} level
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Background</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedCandidate.backstory}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Personality</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedCandidate.personality}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            {selectedCandidate.strengths.map(strength => (
                              <li key={strength} className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-green-600" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-orange-600">Areas for Growth</h4>
                          <ul className="text-sm space-y-1">
                            {selectedCandidate.weaknesses.map(weakness => (
                              <li key={weakness} className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-orange-600" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Expected Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium">+${selectedCandidate.impact.revenue.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Annual Revenue</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">-{selectedCandidate.impact.efficiency}%</div>
                            <div className="text-xs text-muted-foreground">Time Reduction</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-pink-600" />
                          <div>
                            <div className="font-medium">+{selectedCandidate.impact.morale}</div>
                            <div className="text-xs text-muted-foreground">Team Morale</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-600" />
                          <div>
                            <div className="font-medium">+{selectedCandidate.impact.brandEquity}</div>
                            <div className="text-xs text-muted-foreground">Brand Equity</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Total Investment:</span>
                          <span className="font-medium">
                            ${(selectedCandidate.hiringCost + selectedCandidate.cost).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Hiring Cost:</span>
                          <span>${selectedCandidate.hiringCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Annual Salary:</span>
                          <span>${selectedCandidate.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Skills & Specialties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Core Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.skills.map(skill => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Specialties</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.specialties.map(specialty => (
                              <Badge key={specialty} className="bg-primary/10 text-primary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64 text-muted-foreground"
                >
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a candidate to view their profile</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Skip Hiring
          </Button>
          {selectedCandidate && (
            <Button
              onClick={handleHire}
              disabled={!canAfford(selectedCandidate)}
              className="px-6"
            >
              Hire {selectedCandidate.name} - ${selectedCandidate.hiringCost.toLocaleString()}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
