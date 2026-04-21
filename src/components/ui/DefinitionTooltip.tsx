'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, BookOpen, X } from 'lucide-react';
import { getTerm, type GlossaryTerm } from '@/lib/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DefinitionTooltipProps {
  termId: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
  className?: string;
  variant?: 'simple' | 'detailed';
}

export function DefinitionTooltip({
  termId,
  children,
  position = 'top',
  showIcon = true,
  className = '',
  variant = 'simple',
}: DefinitionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState<GlossaryTerm | undefined>();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const termData = getTerm(termId);
    setTerm(termData);
  }, [termId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!term) {
    // Fallback if term not found
    return <span className={className}>{children}</span>;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1 border-r-gray-900',
  };

  if (variant === 'simple') {
    return (
      <div className={`relative inline-block ${className}`} ref={tooltipRef}>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-help inline-flex items-center gap-1"
        >
          {children}
          {showIcon && (
            <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`absolute ${positionClasses[position]} z-50 min-w-[250px] max-w-[350px]`}
            >
              <div className="bg-gray-900 text-white text-sm rounded-lg shadow-xl p-4">
                <div className="font-semibold mb-2 text-blue-300 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {term.term}
                </div>
                <div className="text-gray-200 mb-2 leading-relaxed">
                  {term.simpleExplanation}
                </div>
                <div className="text-xs text-gray-400 italic">
                  Example: {term.example}
                </div>
                <div
                  className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${arrowClasses[position]}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Detailed variant with full card
  return (
    <div className={`relative inline-block ${className}`} ref={tooltipRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-help inline-flex items-center gap-1"
      >
        {children}
        {showIcon && (
          <HelpCircle className="h-4 w-4 text-primary hover:text-primary/80 transition-colors" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Tooltip Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed ${positionClasses[position]} z-50 w-[400px] max-w-[90vw]`}
            >
              <Card className="shadow-2xl border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {term.term}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {term.category}
                        </Badge>
                        <Badge
                          variant={term.difficulty === 'beginner' ? 'default' : term.difficulty === 'intermediate' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {term.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Simple Explanation */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-primary">Simple Explanation</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {term.simpleExplanation}
                    </p>
                  </div>

                  {/* Full Definition */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Full Definition</h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {term.definition}
                    </p>
                  </div>

                  {/* Example */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Example</h4>
                    <p className="text-sm text-muted-foreground italic">
                      {term.example}
                    </p>
                  </div>

                  {/* Related Terms */}
                  {term.relatedTerms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Related Terms</h4>
                      <div className="flex flex-wrap gap-1">
                        {term.relatedTerms.map((relatedId) => {
                          const relatedTerm = getTerm(relatedId);
                          if (!relatedTerm) return null;
                          return (
                            <Badge
                              key={relatedId}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/10"
                              onClick={() => {
                                // Could navigate to term or open it
                                setTerm(relatedTerm);
                              }}
                            >
                              {relatedTerm.term}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Inline definition component - shows term with clickable definition
 */
export function InlineDefinition({ termId, children }: { termId: string; children?: React.ReactNode }) {
  const term = getTerm(termId);
  if (!term) return <span>{children || termId}</span>;

  return (
    <DefinitionTooltip termId={termId} variant="detailed" showIcon={true}>
      <span className="underline decoration-dotted decoration-primary/50 hover:decoration-primary cursor-help">
        {children || term.term}
      </span>
    </DefinitionTooltip>
  );
}
