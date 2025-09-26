import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, 
  Eye, BarChart3, RefreshCw, Calendar, Filter, Download, 
  Facebook, Instagram, Linkedin, Twitter, Youtube, Globe,
  Plus, CheckCircle, AlertCircle, Clock, Settings
} from 'lucide-react';

const SocialMediaAnalytics = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState([
    { id: 'facebook', name: 'Facebook', connected: true, icon: Facebook, color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', connected: true, icon: Instagram, color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', connected: false, icon: Linkedin, color: '#0A66C2' },
    { id: 'twitter', name: 'Twitter', connected: true, icon: Twitter, color: '#1DA1F2' },
    { id: 'youtube', name: 'YouTube', connected: false, icon: Youtube, color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', connected: false, icon: Globe, color: '#000000' }
  ]);

  // Mock data for analytics
  const performanceData = [
    { date: '2024-01-01', engagement: 4200, reach: 12500, clicks: 850, shares: 320 },
    { date: '2024-01-02', engagement: 3800, reach: 11200, clicks: 720, shares: 280 },
    { date: '2024-01-03', engagement: 5100, reach: 15800, clicks: 950, shares: 410 },
    { date: '2024-01-04', engagement: 4600, reach: 13900, clicks: 880, shares: 360 },
    { date: '2024-01-05', engagement: 5800, reach: 17200, clicks: 1100, shares: 480 },
    { date: '2024-01-06', engagement: 4900, reach: 14600, clicks: 920, shares: 390 },
    { date: '2024-01-07', engagement: 6200, reach: 18500, clicks: 1250, shares: 520 }
  ];

  const platformData = [
    { name: 'Facebook', value: 35, color: '#1877F2' },
    { name: 'Instagram', value: 28, color: '#E4405F' },
    { name: 'Twitter', value: 22, color: '#1DA1F2' },
    { name: 'LinkedIn', value: 15, color: '#0A66C2' }
  ];

  const topPosts = [
    {
      id: 1,
      platform: 'Instagram',
      content: 'New product launch announcement with behind-the-scenes content',
      engagement: 2450,
      reach: 8900,
      date: '2024-01-07'
    },
    {
      id: 2,
      platform: 'Facebook',
      content: 'Customer success story featuring testimonial video',
      engagement: 1890,
      reach: 6700,
      date: '2024-01-06'
    },
    {
      id: 3,
      platform: 'Twitter',
      content: 'Industry insights thread with actionable tips',
      engagement: 1650,
      reach: 5200,
      date: '2024-01-05'
    }
  ];

  const kpiCards = [
    {
      title: 'Total Engagement',
      value: '34.2K',
      change: '+12.5%',
      trend: 'up',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      title: 'Total Reach',
      value: '128.7K',
      change: '+8.3%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Click-through Rate',
      value: '3.2%',
      change: '-2.1%',
      trend: 'down',
      icon: MessageCircle,
      color: 'text-green-600'
    },
    {
      title: 'Follower Growth',
      value: '+1,247',
      change: '+15.8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handlePlatformConnect = (platformId) => {
    setConnectedPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: !platform.connected }
          : platform
      )
    );
  };

  return (
    <div className="min-h-screen dark-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold dark-text-primary">Social Media Analytics</h1>
              <p className="mt-2 dark-text-secondary">
                Monitor and analyze your social media performance across all platforms
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="dark-select px-4 py-2 rounded-lg"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="dark-btn-primary flex items-center px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="dark-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium dark-text-secondary">{kpi.title}</p>
                  <p className="text-2xl font-bold dark-text-primary mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg dark-bg-tertiary`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 dark-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark-text-primary">Performance Overview</h3>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="dark-select px-3 py-2 rounded-lg text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="engagement" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="reach" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="dark-card p-6">
            <h3 className="text-lg font-semibold dark-text-primary mb-6">Platform Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Integration Section */}
        <div className="dark-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold dark-text-primary">Platform Integrations</h3>
            <button className="flex items-center px-4 py-2 dark-text-secondary hover:dark-text-primary hover:dark-bg-tertiary rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Platform
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedPlatforms.map((platform) => (
              <div key={platform.id} className="dark-border border rounded-lg p-4 hover:dark-border-accent hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <platform.icon className="w-6 h-6 mr-3" style={{ color: platform.color }} />
                    <span className="font-medium dark-text-primary">{platform.name}</span>
                  </div>
                  {platform.connected ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 dark-text-muted" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${platform.connected ? 'text-green-400' : 'dark-text-muted'}`}>
                    {platform.connected ? 'Connected' : 'Not Connected'}
                  </span>
                  <button
                    onClick={() => handlePlatformConnect(platform.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      platform.connected
                        ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                        : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                    }`}
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="dark-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold dark-text-primary">Top Performing Posts</h3>
            <button className="flex items-center px-4 py-2 dark-text-secondary hover:dark-text-primary hover:dark-bg-tertiary rounded-lg transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="dark-border border rounded-lg p-4 hover:dark-border-accent hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 mr-3">
                        {post.platform}
                      </span>
                      <span className="text-sm dark-text-muted">{post.date}</span>
                    </div>
                    <p className="dark-text-primary mb-3">{post.content}</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-pink-400 mr-1" />
                        <span className="text-sm dark-text-secondary">{post.engagement.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-sm dark-text-secondary">{post.reach.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 p-2 dark-text-muted hover:dark-text-primary transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trends */}
        <div className="dark-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold dark-text-primary">Engagement Trends</h3>
            <select className="dark-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3B82F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAnalytics;