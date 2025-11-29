'use client';

import { useState, useMemo } from 'react';
import { Search, X, BookOpen, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { glossary, getTermsByCategory, getTermsByDifficulty, searchTerms, type GlossaryTerm } from '@/lib/glossary';
import { DefinitionTooltip } from '@/components/ui/DefinitionTooltip';

interface GlossaryViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlossaryViewer({ isOpen, onClose }: GlossaryViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const filteredTerms = useMemo(() => {
    let terms = glossary;

    // Apply search
    if (searchQuery) {
      terms = searchTerms(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      terms = terms.filter(t => t.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      terms = terms.filter(t => t.difficulty === selectedDifficulty);
    }

    return terms;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const categories = ['all', 'strategy', 'metrics', 'tactics', 'finance', 'general'] as const;
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Marketing Glossary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive definitions for all marketing terms - written for beginners
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for terms (e.g., 'revenue', 'ROI', 'SEO')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs"
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm font-medium">Difficulty:</span>
              {difficulties.map(diff => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                  className="text-xs"
                >
                  {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden flex gap-4 p-6">
          {/* Terms List */}
          <div className="w-1/2 overflow-y-auto pr-4 space-y-3">
            <div className="text-sm text-muted-foreground mb-2">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
            </div>
            {filteredTerms.map(term => (
              <Card
                key={term.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTerm?.id === term.id ? 'border-primary border-2' : ''
                }`}
                onClick={() => setSelectedTerm(term)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base">{term.term}</h3>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {term.category}
                      </Badge>
                      <Badge
                        variant={
                          term.difficulty === 'beginner' ? 'default' :
                          term.difficulty === 'intermediate' ? 'secondary' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {term.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {term.simpleExplanation}
                  </p>
                </CardContent>
              </Card>
            ))}
            {filteredTerms.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No terms found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Term Detail */}
          <div className="w-1/2 overflow-y-auto border-l pl-4">
            {selectedTerm ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedTerm.term}</h2>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{selectedTerm.category}</Badge>
                    <Badge
                      variant={
                        selectedTerm.difficulty === 'beginner' ? 'default' :
                        selectedTerm.difficulty === 'intermediate' ? 'secondary' :
                        'outline'
                      }
                    >
                      {selectedTerm.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2 text-primary">Simple Explanation</h3>
                    <p className="text-sm leading-relaxed bg-blue-50 border border-blue-200 rounded-lg p-3">
                      {selectedTerm.simpleExplanation}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Full Definition</h3>
                    <p className="text-sm leading-relaxed">
                      {selectedTerm.definition}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Example</h3>
                    <p className="text-sm leading-relaxed italic bg-muted/50 rounded-lg p-3">
                      {selectedTerm.example}
                    </p>
                  </div>

                  {selectedTerm.relatedTerms.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Related Terms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerm.relatedTerms.map(relatedId => {
                          const relatedTerm = glossary.find(t => t.id === relatedId);
                          if (!relatedTerm) return null;
                          return (
                            <Button
                              key={relatedId}
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTerm(relatedTerm)}
                              className="text-xs"
                            >
                              {relatedTerm.term}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a term to see detailed information</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

