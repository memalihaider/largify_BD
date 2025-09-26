import React, { useState } from 'react';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';
import Card from '../components/Card';

const SubscriptionPlans = () => {
  const [currentPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses getting started',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Up to 5 team members',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Standard integrations'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$79',
      period: '/month',
      description: 'Most popular choice for growing businesses',
      icon: Star,
      color: 'from-violet-500 to-violet-600',
      popular: true,
      features: [
        'Up to 25 team members',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'All integrations',
        'Custom workflows',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'Advanced features for large organizations',
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Enterprise analytics',
        '24/7 phone support',
        'Custom integrations',
        'Advanced security',
        'Dedicated account manager',
        'SLA guarantee'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Subscription Plans</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-violet-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Current Plan: Premium</h3>
              <p className="text-slate-400">Next billing date: February 15, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">$79/month</p>
            <p className="text-sm text-green-400">Active</p>
          </div>
        </div>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.id === currentPlan;
          
          return (
            <Card key={plan.id} className={`p-6 relative ${plan.popular ? 'ring-2 ring-violet-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${plan.color} mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isCurrentPlan
                    ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? 'Current Plan' : 'Upgrade to ' + plan.name}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Billing Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Payment Method</h4>
            <p className="text-slate-400">**** **** **** 4242</p>
            <p className="text-slate-400 text-sm">Expires 12/25</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Billing Address</h4>
            <p className="text-slate-400">123 Business St</p>
            <p className="text-slate-400">New York, NY 10001</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <button className="text-violet-400 hover:text-violet-300 text-sm">
            Update billing information
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;