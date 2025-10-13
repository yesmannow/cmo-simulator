'use client';

import { useState } from 'react';
import { Search, X, Lightbulb, BookOpen, HelpCircle, Award, TrendingUp, FileText, Star } from 'lucide-react';
import {
  allKnowledgeItems,
  categories,
  difficulties,
  getRelatedItems,
  type KnowledgeItem
} from '@/lib/knowledgeBase';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  faq: HelpCircle,
  strategy: TrendingUp,
  glossary: BookOpen,
  'case-study': FileText,
  tips: Lightbulb,
  'best-practices': Award
};

const categoryColors = {
  faq: 'bg-blue-100 text-blue-800',
  strategy: 'bg-purple-100 text-purple-800',
  glossary: 'bg-green-100 text-green-800',
  'case-study': 'bg-orange-100 text-orange-800',
  tips: 'bg-yellow-100 text-yellow-800',
  'best-practices': 'bg-pink-100 text-pink-800'
};

export default function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const filteredItems = allKnowledgeItems.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const groupedItems = selectedCategory === 'all'
    ? categories.reduce((acc, category) => {
        acc[category.id] = filteredItems.filter(item => item.category === category.id);
        return acc;
      }, {} as Record<string, KnowledgeItem[]>)
    : { [selectedCategory]: filteredItems };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Main Panel */}
      <div className="bg-white w-full max-w-6xl h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">CMO Simulator Knowledge Base</h2>
              <p className="text-gray-600">Master marketing strategy with comprehensive guides and expert insights</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2 ml-4">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedDifficulty === difficulty.id
                      ? difficulty.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!selectedItem ? (
            // Items List
            <div className="h-full overflow-y-auto p-6">
              {Object.entries(groupedItems).map(([categoryId, items]) => {
                if (items.length === 0) return null;

                const category = categories.find(c => c.id === categoryId);
                const Icon = categoryIcons[categoryId as keyof typeof categoryIcons] || HelpCircle;

                return (
                  <div key={categoryId} className="mb-8">
                    <div className="flex items-center mb-4">
                      <Icon className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category?.label || 'Other'}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">({items.length})</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {items.map(item => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {item.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                              categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
                            }`}>
                              {difficulties.find(d => d.id === item.difficulty)?.label}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {item.content}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No results found. Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          ) : (
            // Item Detail View
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  ← Back to Knowledge Base
                </button>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedItem.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          categoryColors[selectedItem.category as keyof typeof categoryColors]
                        }`}>
                          {categories.find(c => c.id === selectedItem.category)?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          difficulties.find(d => d.id === selectedItem.difficulty)?.color
                        }`}>
                          {difficulties.find(d => d.id === selectedItem.difficulty)?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">{selectedItem.content}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Related Items */}
                  {(() => {
                    const relatedItems = getRelatedItems(selectedItem.id);
                    if (relatedItems.length === 0) return null;

                    return (
                      <div className="border-t pt-6 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Related Content</h4>
                        <div className="space-y-3">
                          {relatedItems.map(item => (
                            <button
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{item.title}</h5>
                                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">{item.content}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                                  categoryColors[item.category as keyof typeof categoryColors]
                                }`}>
                                  {item.difficulty}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>💡 <strong>Pro Tip:</strong> Start with FAQ for quick answers</span>
              <span>📚 <strong>Strategy Guide:</strong> For advanced tactics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Master these concepts to become a marketing expert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
