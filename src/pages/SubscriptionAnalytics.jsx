import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, AlertTriangle, TrendingDown } from 'lucide-react';
import KPICard from '../components/KPICard';
import MRRLineChart from '../components/MRRLineChart';
import ChurnBarChart from '../components/ChurnBarChart';
import CohortTable from '../components/CohortTable';
import ChurnInsightsPanel from '../components/ChurnInsightsPanel';

const SubscriptionAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    kpis: {
      mrr: 0,
      arr: 0,
      activeSubscribers: 0,
      arpu: 0
    },
    mrrTrend: [],
    churnData: [],
    cohortData: [],
    atRiskCustomers: []
  });

  useEffect(() => {
    // Simulate API call with dummy data
    const loadAnalyticsData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        kpis: {
          mrr: 125000,
          arr: 1500000,
          activeSubscribers: 2847,
          arpu: 43.89
        },
        mrrTrend: [
          { month: 'Jan', mrr: 98000, subscribers: 2234 },
          { month: 'Feb', mrr: 102000, subscribers: 2298 },
          { month: 'Mar', mrr: 108000, subscribers: 2401 },
          { month: 'Apr', mrr: 112000, subscribers: 2456 },
          { month: 'May', mrr: 115000, subscribers: 2523 },
          { month: 'Jun', mrr: 118000, subscribers: 2598 },
          { month: 'Jul', mrr: 120000, subscribers: 2634 },
          { month: 'Aug', mrr: 122000, subscribers: 2689 },
          { month: 'Sep', mrr: 123000, subscribers: 2734 },
          { month: 'Oct', mrr: 124000, subscribers: 2789 },
          { month: 'Nov', mrr: 124500, subscribers: 2823 },
          { month: 'Dec', mrr: 125000, subscribers: 2847 }
        ],
        churnData: [
          { month: 'Jan', churnRate: 3.2 },
          { month: 'Feb', churnRate: 2.8 },
          { month: 'Mar', churnRate: 3.5 },
          { month: 'Apr', churnRate: 2.9 },
          { month: 'May', churnRate: 3.1 },
          { month: 'Jun', churnRate: 2.7 },
          { month: 'Jul', churnRate: 3.3 },
          { month: 'Aug', churnRate: 2.6 },
          { month: 'Sep', churnRate: 3.0 },
          { month: 'Oct', churnRate: 2.8 },
          { month: 'Nov', churnRate: 3.2 },
          { month: 'Dec', churnRate: 2.9 }
        ],
        cohortData: [
          { cohort: '2024-01', users: 234, retentionRate: 85.2, ltv: 1250 },
          { cohort: '2024-02', users: 198, retentionRate: 87.1, ltv: 1340 },
          { cohort: '2024-03', users: 267, retentionRate: 82.4, ltv: 1180 },
          { cohort: '2024-04', users: 189, retentionRate: 89.3, ltv: 1420 },
          { cohort: '2024-05', users: 223, retentionRate: 86.7, ltv: 1290 },
          { cohort: '2024-06', users: 245, retentionRate: 84.8, ltv: 1220 },
          { cohort: '2024-07', users: 201, retentionRate: 88.2, ltv: 1380 },
          { cohort: '2024-08', users: 278, retentionRate: 83.9, ltv: 1160 },
          { cohort: '2024-09', users: 192, retentionRate: 90.1, ltv: 1450 },
          { cohort: '2024-10', users: 256, retentionRate: 85.6, ltv: 1270 },
          { cohort: '2024-11', users: 234, retentionRate: 87.8, ltv: 1320 },
          { cohort: '2024-12', users: 289, retentionRate: 81.2, ltv: 1140 }
        ],
        atRiskCustomers: [
          {
            id: 1,
            name: 'TechCorp Solutions',
            email: 'admin@techcorp.com',
            plan: 'Enterprise',
            mrr: 2500,
            riskScore: 85,
            lastActivity: '2024-01-10',
            recommendations: ['Offer Discount', 'Schedule Call']
          },
          {
            id: 2,
            name: 'StartupXYZ',
            email: 'founder@startupxyz.com',
            plan: 'Professional',
            mrr: 199,
            riskScore: 78,
            lastActivity: '2024-01-08',
            recommendations: ['Send Engagement Email', 'Feature Tutorial']
          },
          {
            id: 3,
            name: 'Digital Agency Pro',
            email: 'contact@digitalagency.com',
            plan: 'Business',
            mrr: 799,
            riskScore: 72,
            lastActivity: '2024-01-12',
            recommendations: ['Offer Upgrade', 'Success Manager Contact']
          },
          {
            id: 4,
            name: 'E-commerce Plus',
            email: 'support@ecommerceplus.com',
            plan: 'Professional',
            mrr: 299,
            riskScore: 69,
            lastActivity: '2024-01-09',
            recommendations: ['Send Engagement Email', 'Product Demo']
          },
          {
            id: 5,
            name: 'Marketing Hub',
            email: 'team@marketinghub.com',
            plan: 'Enterprise',
            mrr: 1999,
            riskScore: 66,
            lastActivity: '2024-01-11',
            recommendations: ['Schedule Call', 'Feature Training']
          }
        ]
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    };

    loadAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading subscription analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscription Analytics</h1>
          <p className="text-slate-400 mt-1">Monitor your subscription metrics and revenue performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="12">Last 12 months</option>
            <option value="6">Last 6 months</option>
            <option value="3">Last 3 months</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Recurring Revenue"
          value={`$${analyticsData.kpis.mrr.toLocaleString()}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Annual Recurring Revenue"
          value={`$${analyticsData.kpis.arr.toLocaleString()}`}
          change="+15.2%"
          trend="up"
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title="Active Subscribers"
          value={analyticsData.kpis.activeSubscribers.toLocaleString()}
          change="+8.7%"
          trend="up"
          icon={Users}
          color="purple"
        />
        <KPICard
          title="Average Revenue Per User"
          value={`$${analyticsData.kpis.arpu}`}
          change="+3.2%"
          trend="up"
          icon={Target}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Trend Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">MRR Trend</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
              <span>Monthly Recurring Revenue</span>
            </div>
          </div>
          <MRRLineChart data={analyticsData.mrrTrend} />
        </div>

        {/* Churn Rate Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Churn Rate</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Monthly Churn %</span>
            </div>
          </div>
          <ChurnBarChart data={analyticsData.churnData} />
        </div>
      </div>

      {/* Customer Cohort Table and Churn Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cohort Table */}
        <div className="xl:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Customer Cohort Analysis</h2>
              <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                Export Data
              </button>
            </div>
            <CohortTable data={analyticsData.cohortData} />
          </div>
        </div>

        {/* Churn Insights Panel */}
        <div className="xl:col-span-1">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Churn Control Insights</h2>
            </div>
            <ChurnInsightsPanel customers={analyticsData.atRiskCustomers} />
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Customer Acquisition Cost</p>
              <p className="text-2xl font-bold text-white mt-1">$127</p>
            </div>
            <div className="text-green-400 text-sm font-medium">-8.2%</div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Customer Lifetime Value</p>
              <p className="text-2xl font-bold text-white mt-1">$1,284</p>
            </div>
            <div className="text-green-400 text-sm font-medium">+12.4%</div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Net Revenue Retention</p>
              <p className="text-2xl font-bold text-white mt-1">108%</p>
            </div>
            <div className="text-green-400 text-sm font-medium">+2.1%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAnalytics;