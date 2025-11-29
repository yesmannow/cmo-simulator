'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTerm, searchTerms, type GlossaryTerm } from '@/lib/glossary';
import { InlineDefinition } from '@/components/ui/DefinitionTooltip';

interface ContextualHelpProps {
  context: string; // Current page/section context
  termIds?: string[]; // Relevant terms for this context
  tips?: string[];
  className?: string;
}

export function ContextualHelp({ context, termIds = [], tips = [], className = '' }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    if (searchQuery) {
      setSearchResults(searchTerms(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const relevantTerms = termIds.map(id => getTerm(id)).filter((t): t is GlossaryTerm => t !== undefined);

  return (
    <>
      {/* Help Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`gap-2 ${className}`}
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </Button>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[400px] max-w-[90vw] bg-background border-l shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Contextual Help</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Context */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-1">Current Context:</p>
                  <p className="text-sm text-muted-foreground">{context}</p>
                </div>

                {/* Search */}
                <div>
                  <input
                    type="text"
                    placeholder="Search for terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {searchResults.slice(0, 5).map((term) => (
                        <Card key={term.id} className="p-3 cursor-pointer hover:bg-muted/50">
                          <p className="font-semibold text-sm">{term.term}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {term.simpleExplanation}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Relevant Terms */}
                {relevantTerms.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Key Terms for This Section
                    </h3>
                    <div className="space-y-2">
                      {relevantTerms.map((term) => (
                        <Card key={term.id} className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <InlineDefinition termId={term.id}>
                              <p className="font-semibold text-sm cursor-help">
                                {term.term}
                              </p>
                            </InlineDefinition>
                            <span className={`text-xs px-2 py-1 rounded ${
                              term.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              term.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {term.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {term.simpleExplanation}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {tips.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Tips for This Section
                    </h3>
                    <ul className="space-y-2">
                      {tips.map((tip, index) => (
                        <li key={index} className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

