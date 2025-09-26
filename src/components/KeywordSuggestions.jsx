import React, { useState } from 'react';
import { Hash, TrendingUp, Search, Plus } from 'lucide-react';

const KeywordSuggestions = () => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy keyword data with search volume and difficulty
  const keywords = [
    { term: 'digital marketing', volume: 'High', difficulty: 'Medium', trend: 'up' },
    { term: 'SEO optimization', volume: 'High', difficulty: 'High', trend: 'up' },
    { term: 'content strategy', volume: 'Medium', difficulty: 'Low', trend: 'up' },
    { term: 'social media marketing', volume: 'High', difficulty: 'Medium', trend: 'stable' },
    { term: 'email campaigns', volume: 'Medium', difficulty: 'Low', trend: 'up' },
    { term: 'conversion rate', volume: 'Medium', difficulty: 'Medium', trend: 'up' },
    { term: 'brand awareness', volume: 'Medium', difficulty: 'Low', trend: 'stable' },
    { term: 'lead generation', volume: 'High', difficulty: 'High', trend: 'up' },
    { term: 'customer retention', volume: 'Low', difficulty: 'Low', trend: 'up' },
    { term: 'marketing automation', volume: 'Medium', difficulty: 'Medium', trend: 'up' },
    { term: 'analytics tracking', volume: 'Low', difficulty: 'Low', trend: 'stable' },
    { term: 'competitor analysis', volume: 'Low', difficulty: 'Low', trend: 'up' },
    { term: 'market research', volume: 'Medium', difficulty: 'Medium', trend: 'stable' },
    { term: 'ROI optimization', volume: 'Low', difficulty: 'Medium', trend: 'up' },
    { term: 'performance metrics', volume: 'Low', difficulty: 'Low', trend: 'up' }
  ];

  const filteredKeywords = keywords.filter(keyword =>
    keyword.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev => {
      const isSelected = prev.some(k => k.term === keyword.term);
      if (isSelected) {
        return prev.filter(k => k.term !== keyword.term);
      } else {
        return [...prev, keyword];
      }
    });
  };

  const getVolumeColor = (volume) => {
    switch (volume) {
      case 'High':
        return 'bg-green-900/30 text-green-300 border-green-700';
      case 'Medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'Low':
        return 'bg-blue-900/30 text-blue-300 border-blue-700';
      default:
        return 'bg-gray-700/30 text-gray-300 border-gray-600';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'High':
        return 'text-red-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className="w-3 h-3 text-green-400" />;
    }
    return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <Hash className="w-5 h-5 text-blue-400" />
          Keyword Suggestions
        </h4>
        <span className="text-sm text-gray-400">
          {selectedKeywords.length} selected
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Selected Keywords */}
      {selectedKeywords.length > 0 && (
        <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
          <h5 className="text-sm font-medium text-blue-300 mb-2">Selected Keywords:</h5>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => toggleKeyword(keyword)}
              >
                {keyword.term}
                <Plus className="w-3 h-3 rotate-45" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Cloud */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {filteredKeywords.map((keyword, index) => {
            const isSelected = selectedKeywords.some(k => k.term === keyword.term);
            return (
              <div
                key={index}
                onClick={() => toggleKeyword(keyword)}
                className={`group cursor-pointer border rounded-lg p-3 transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : `${getVolumeColor(keyword.volume)} hover:shadow-lg hover:scale-105`
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{keyword.term}</span>
                  {getTrendIcon(keyword.trend)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={isSelected ? 'text-blue-100' : 'text-gray-400'}>
                    Vol: {keyword.volume}
                  </span>
                  <span className={isSelected ? 'text-blue-100' : getDifficultyColor(keyword.difficulty)}>
                    {keyword.difficulty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-600">
        <button
          onClick={() => setSelectedKeywords([])}
          className="flex-1 px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedKeywords.length === 0}
        >
          Clear Selection
        </button>
        <button
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedKeywords.length === 0}
        >
          Add to Campaign ({selectedKeywords.length})
        </button>
      </div>

      {/* Legend */}
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-900/30 border border-green-700 rounded"></div>
            <span>High Volume</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-900/30 border border-yellow-700 rounded"></div>
            <span>Medium Volume</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-900/30 border border-blue-700 rounded"></div>
            <span>Low Volume</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordSuggestions;