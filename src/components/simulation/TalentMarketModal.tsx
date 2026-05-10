'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { SIM_CARD_SURFACE, SIM_MODAL_DIALOG_BASE } from '@/lib/simDialogStyles';
import type { TalentAvatarKind, TalentCandidate } from '@/lib/talentMarket';
import {
  User,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Award,
  Briefcase,
  Heart,
  Zap,
  Palette,
  Microscope,
  Rocket,
  Handshake,
  Cog,
  type LucideIcon,
} from 'lucide-react';

const AVATAR_ICONS: Record<TalentAvatarKind, LucideIcon> = {
  leadership: Briefcase,
  creative: Palette,
  research: Microscope,
  growth: Rocket,
  partnerships: Handshake,
  operations: Cog,
};

function TalentAvatarIcon({
  kind,
  className,
  iconClassName,
}: {
  kind: TalentAvatarKind;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = AVATAR_ICONS[kind];
  return (
    <div
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700',
        className,
      )}
    >
      <Icon className={cn('size-5', iconClassName)} aria-hidden />
    </div>
  );
}

function experienceBadgeClass(experience: TalentCandidate['experience']) {
  switch (experience) {
    case 'junior':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50';
    case 'mid':
      return 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100';
    case 'senior':
      return 'border-slate-300 bg-white text-slate-900 hover:bg-white';
    case 'executive':
      return 'border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-50';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50';
  }
}

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
  availableBudget,
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

  const canAfford = (candidate: TalentCandidate) => {
    return availableBudget >= candidate.hiringCost;
  };

  const selectCandidate = (candidate: TalentCandidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(SIM_MODAL_DIALOG_BASE, 'max-w-6xl', '[&_.text-muted-foreground]:text-slate-600')}
      >
        <div className="min-h-0 shrink-0 border-b border-slate-200 px-6 pb-4 pt-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Briefcase className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <DialogTitle className="text-xl font-semibold tracking-tight text-slate-950">
                  Talent market — Q2 hiring
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600">
                  Add senior capacity where it compounds. Compare hiring cost to modeled revenue lift before you commit.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
          <div className="flex min-h-0 flex-col gap-4 px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Available candidates
              </h3>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 font-medium text-slate-800">
                <DollarSign className="mr-1 size-3" aria-hidden />
                Budget ${availableBudget.toLocaleString()}
              </Badge>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card
                    role="button"
                    tabIndex={0}
                    className={cn(
                      SIM_CARD_SURFACE,
                      'cursor-pointer gap-0 py-0 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
                      selectedCandidate?.id === candidate.id
                        ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white'
                        : 'hover:shadow-md',
                      !canAfford(candidate) && 'opacity-60',
                    )}
                    onClick={() => selectCandidate(candidate)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectCandidate(candidate);
                      }
                    }}
                  >
                    <CardHeader className="border-b border-slate-100 px-4 py-4 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <TalentAvatarIcon kind={candidate.avatarKind ?? 'leadership'} />
                          <div className="min-w-0">
                            <CardTitle className="text-base font-semibold text-slate-950">
                              {candidate.name}
                            </CardTitle>
                            <p className="mt-0.5 text-sm text-slate-600">{candidate.role}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn('shrink-0 capitalize', experienceBadgeClass(candidate.experience))}
                        >
                          {candidate.experience}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 py-4">
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-3.5 shrink-0 text-slate-500" aria-hidden />
                          <span>${candidate.hiringCost.toLocaleString()} hire</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="size-3.5 shrink-0 text-slate-500" aria-hidden />
                          <span className="text-emerald-700">+${candidate.impact.revenue.toLocaleString()}/yr</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>Revenue impact (vs $500k baseline)</span>
                          <span className="tabular-nums text-slate-900">
                            +{((candidate.impact.revenue / 500000) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min((candidate.impact.revenue / 500000) * 100, 100)}
                          className="h-2 bg-slate-200"
                          indicatorClassName="bg-slate-800"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="border border-dashed border-slate-200 bg-white text-xs text-slate-600"
                          >
                            +{candidate.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {!canAfford(candidate) && (
                        <p className="text-xs font-medium text-red-700">Insufficient budget for this hire.</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4 px-6 py-5">
            <AnimatePresence mode="wait">
              {showDetails && selectedCandidate ? (
                <motion.div
                  key={selectedCandidate.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Candidate profile
                    </h3>
                  </div>

                  <Card className={cn(SIM_CARD_SURFACE, 'gap-0 py-0')}>
                    <CardHeader className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-start gap-4">
                        <TalentAvatarIcon
                          kind={selectedCandidate.avatarKind ?? 'leadership'}
                          className="size-14 rounded-xl"
                          iconClassName="size-6"
                        />
                        <div className="min-w-0">
                          <CardTitle className="text-lg font-semibold text-slate-950">
                            {selectedCandidate.name}
                          </CardTitle>
                          <p className="mt-1 text-sm text-slate-600">{selectedCandidate.role}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              'mt-2 capitalize',
                              experienceBadgeClass(selectedCandidate.experience),
                            )}
                          >
                            {selectedCandidate.experience} level
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 px-4 py-4">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-slate-950">Background</h4>
                        <p className="text-sm leading-relaxed text-slate-600">{selectedCandidate.backstory}</p>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-slate-950">Working style</h4>
                        <p className="text-sm leading-relaxed text-slate-600">{selectedCandidate.personality}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-emerald-800">Strengths</h4>
                          <ul className="space-y-1.5 text-sm text-slate-700">
                            {selectedCandidate.strengths.map((strength) => (
                              <li key={strength} className="flex items-start gap-2">
                                <Star className="mt-0.5 size-3.5 shrink-0 text-emerald-700" aria-hidden />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-amber-900">Development areas</h4>
                          <ul className="space-y-1.5 text-sm text-slate-700">
                            {selectedCandidate.weaknesses.map((weakness) => (
                              <li key={weakness} className="flex items-start gap-2">
                                <Clock className="mt-0.5 size-3.5 shrink-0 text-amber-800" aria-hidden />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn(SIM_CARD_SURFACE, 'gap-0 py-0')}>
                    <CardHeader className="border-b border-slate-100 px-4 py-3">
                      <CardTitle className="text-base font-semibold text-slate-950">Expected impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="size-4 shrink-0 text-slate-500" aria-hidden />
                          <div>
                            <div className="font-semibold text-slate-950">
                              +${selectedCandidate.impact.revenue.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-600">Annual revenue (modeled)</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="size-4 shrink-0 text-slate-500" aria-hidden />
                          <div>
                            <div className="font-semibold text-slate-950">−{selectedCandidate.impact.efficiency}%</div>
                            <div className="text-xs text-slate-600">Time on repeated work</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="size-4 shrink-0 text-slate-500" aria-hidden />
                          <div>
                            <div className="font-semibold text-slate-950">+{selectedCandidate.impact.morale}</div>
                            <div className="text-xs text-slate-600">Team morale</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="size-4 shrink-0 text-slate-500" aria-hidden />
                          <div>
                            <div className="font-semibold text-slate-950">+{selectedCandidate.impact.brandEquity}</div>
                            <div className="text-xs text-slate-600">Brand equity</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-slate-100 pt-3 text-sm">
                        <div className="flex justify-between font-medium text-slate-950">
                          <span>Total first-year cash</span>
                          <span>
                            ${(selectedCandidate.hiringCost + selectedCandidate.cost).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Hiring cost</span>
                          <span>${selectedCandidate.hiringCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Annual salary</span>
                          <span>${selectedCandidate.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn(SIM_CARD_SURFACE, 'gap-0 py-0')}>
                    <CardHeader className="border-b border-slate-100 px-4 py-3">
                      <CardTitle className="text-base font-semibold text-slate-950">Skills & specialties</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 py-4">
                      <div className="space-y-4">
                        <div>
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Core skills
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="border border-slate-200 bg-slate-50 font-medium text-slate-800"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Specialties
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.specialties.map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="outline"
                                className="border-slate-300 bg-white font-medium text-slate-900"
                              >
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
                  className="flex min-h-[200px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center text-slate-600"
                >
                  <User className="mb-3 size-10 opacity-40" aria-hidden />
                  <p className="text-sm">Select a candidate on the left to review background, impact, and cost.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
          <Button type="button" variant="outline" className="border-slate-300 bg-white" onClick={onClose}>
            Skip hiring
          </Button>
          {selectedCandidate && (
            <Button
              type="button"
              onClick={handleHire}
              disabled={!canAfford(selectedCandidate)}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              Hire {selectedCandidate.name} — ${selectedCandidate.hiringCost.toLocaleString()}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
