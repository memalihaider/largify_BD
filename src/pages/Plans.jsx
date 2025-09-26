import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Check, 
  X,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import Card from '../components/Card';

const Plans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock plans data
  const plans = [
    {
      id: 1,
      name: 'Basic Plan',
      description: 'Perfect for individuals and small teams getting started',
      price: '$9.99',
      billingCycle: 'monthly',
      category: 'Individual',
      features: [
        'Up to 5 users',
        '10GB storage',
        'Basic support',
        'Core features',
        'Mobile app access'
      ],
      limitations: [
        'No advanced analytics',
        'Limited integrations'
      ],
      subscribers: 1234,
      revenue: '$12,345',
      status: 'Active',
      popular: false
    },
    {
      id: 2,
      name: 'Premium Plan',
      description: 'Ideal for growing businesses with advanced needs',
      price: '$29.99',
      billingCycle: 'monthly',
      category: 'Business',
      features: [
        'Up to 25 users',
        '100GB storage',
        'Priority support',
        'Advanced features',
        'Mobile app access',
        'Analytics dashboard',
        'API access'
      ],
      limitations: [
        'Limited custom integrations'
      ],
      subscribers: 856,
      revenue: '$25,678',
      status: 'Active',
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise Plan',
      description: 'Comprehensive solution for large organizations',
      price: '$99.99',
      billingCycle: 'monthly',
      category: 'Enterprise',
      features: [
        'Unlimited users',
        '1TB storage',
        '24/7 dedicated support',
        'All features included',
        'Mobile app access',
        'Advanced analytics',
        'Full API access',
        'Custom integrations',
        'White-label options',
        'SSO integration'
      ],
      limitations: [],
      subscribers: 234,
      revenue: '$23,397',
      status: 'Active',
      popular: false
    },
    {
      id: 4,
      name: 'Starter Plan',
      description: 'Free plan for trying out our platform',
      price: 'Free',
      billingCycle: 'monthly',
      category: 'Individual',
      features: [
        '1 user',
        '1GB storage',
        'Community support',
        'Basic features'
      ],
      limitations: [
        'No mobile app',
        'No analytics',
        'Limited features'
      ],
      subscribers: 5678,
      revenue: '$0',
      status: 'Active',
      popular: false
    },
    {
      id: 5,
      name: 'Legacy Pro',
      description: 'Discontinued plan for existing customers',
      price: '$19.99',
      billingCycle: 'monthly',
      category: 'Business',
      features: [
        'Up to 15 users',
        '50GB storage',
        'Standard support',
        'Most features'
      ],
      limitations: [
        'No new signups',
        'Limited support'
      ],
      subscribers: 123,
      revenue: '$2,458',
      status: 'Deprecated',
      popular: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-500/10';
      case 'Deprecated': return 'text-yellow-400 bg-yellow-500/10';
      case 'Inactive': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Individual': return 'text-blue-400 bg-blue-500/10';
      case 'Business': return 'text-purple-400 bg-purple-500/10';
      case 'Enterprise': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const planStats = {
    total: plans.length,
    active: plans.filter(p => p.status === 'Active').length,
    totalSubscribers: plans.reduce((sum, plan) => sum + plan.subscribers, 0),
    totalRevenue: plans.reduce((sum, plan) => {
      const revenue = parseFloat(plan.revenue.replace('$', '').replace(',', ''));
      return sum + revenue;
    }, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription Plans</h1>
            <p className="text-slate-400">Manage your pricing plans and subscriptions</p>
          </div>
        </div>
        <button className="mt-4 sm:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Plus className="h-4 w-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{planStats.total}</div>
          <div className="text-sm text-slate-400">Total Plans</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{planStats.active}</div>
          <div className="text-sm text-slate-400">Active Plans</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{planStats.totalSubscribers.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Total Subscribers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">${planStats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Monthly Revenue</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`p-6 relative ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.price !== 'Free' && (
                  <span className="text-slate-400 text-sm">/{plan.billingCycle}</span>
                )}
              </div>

              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plan.category)}`}>
                  {plan.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-3">Features included:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-slate-300">
                    <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            {plan.limitations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white mb-3">Limitations:</h4>
                <ul className="space-y-2">
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-400">
                      <X className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats */}
            <div className="border-t border-slate-700 pt-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center text-blue-400 mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{plan.subscribers.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-400">Subscribers</div>
                </div>
                <div>
                  <div className="flex items-center justify-center text-green-400 mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{plan.revenue}</span>
                  </div>
                  <div className="text-xs text-slate-400">Revenue</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button className="text-blue-400 hover:text-blue-300 p-2 rounded transition-colors duration-200">
                <Edit className="h-4 w-4" />
              </button>
              <button className="text-red-400 hover:text-red-300 p-2 rounded transition-colors duration-200">
                <Trash2 className="h-4 w-4" />
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                Manage
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <Card className="p-12 text-center">
          <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No plans found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default Plans;