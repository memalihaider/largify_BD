import React, { useState } from 'react';
import KPICard from '../components/KPICard';
import CompetitorTable from '../components/CompetitorTable';
import MarketTrendChart from '../components/MarketTrendChart';
import SEOForm from '../components/SEOForm';
import SEOReportPanel from '../components/SEOReportPanel';
import KeywordSuggestions from '../components/KeywordSuggestions';

const MarketingDashboard = () => {
  const [seoReport, setSeoReport] = useState(null);
  const [isLoadingSEO, setIsLoadingSEO] = useState(false);

  // Dummy data for KPI cards
  const kpiData = {
    totalCompetitors: { value: 24, trend: 'up', change: '+3' },
    avgPriceDiff: { value: '15.2%', trend: 'down', change: '-2.1%' },
    marketShare: { value: '32.8%', trend: 'up', change: '+1.4%' }
  };

  const handleSEOSubmit = async (url) => {
    setIsLoadingSEO(true);
    // Simulate API call
    setTimeout(() => {
      setSeoReport({
        url: url,
        score: 78,
        issues: [
          { severity: 'high', title: 'Missing meta description', description: 'Add a compelling meta description to improve click-through rates' },
          { severity: 'medium', title: 'Large image files', description: 'Optimize images to reduce page load time' },
          { severity: 'low', title: 'Missing alt text', description: 'Add alt text to 3 images for better accessibility' }
        ],
        recommendations: [
          'Optimize page loading speed by compressing images',
          'Add structured data markup for better search visibility',
          'Improve internal linking structure',
          'Update title tags to include target keywords'
        ]
      });
      setIsLoadingSEO(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Marketing Dashboard
        </h1>
        <p className="text-gray-300">
          Monitor competitor insights and optimize your SEO performance
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Competitor Analysis (60% on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Competitor Analysis Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Competitor Analysis
            </h2>
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <KPICard
                title="Total Competitors Tracked"
                value={kpiData.totalCompetitors.value}
                trend={kpiData.totalCompetitors.trend}
                change={kpiData.totalCompetitors.change}
              />
              <KPICard
                title="Avg. Price Difference"
                value={kpiData.avgPriceDiff.value}
                trend={kpiData.avgPriceDiff.trend}
                change={kpiData.avgPriceDiff.change}
              />
              <KPICard
                title="Market Share Trend"
                value={kpiData.marketShare.value}
                trend={kpiData.marketShare.trend}
                change={kpiData.marketShare.change}
              />
            </div>
          </div>

          {/* Competitor Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Competitor Overview
            </h3>
            <CompetitorTable />
          </div>

          {/* Market Trend Chart */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              12-Month Market Trend
            </h3>
            <MarketTrendChart />
          </div>
        </div>

        {/* Right Column - SEO Optimization Assistant (40% on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEO Optimization Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              SEO Optimization Assistant
            </h2>
            
            {/* SEO Form */}
            <SEOForm onSubmit={handleSEOSubmit} isLoading={isLoadingSEO} />
            
            {/* SEO Report Panel - Conditional Display */}
            {seoReport && (
              <div className="mt-6">
                <SEOReportPanel report={seoReport} />
              </div>
            )}
          </div>

          {/* Keyword Suggestions */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Keyword Suggestions
            </h3>
            <KeywordSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;