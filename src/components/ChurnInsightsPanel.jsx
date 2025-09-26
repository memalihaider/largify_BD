import React, { useState } from 'react';
import { AlertTriangle, Mail, Phone, Gift, BookOpen, TrendingUp, User, DollarSign, Calendar } from 'lucide-react';

const ChurnInsightsPanel = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score >= 70) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return 'High Risk';
    if (score >= 70) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'Offer Discount':
        return <Gift className="w-4 h-4" />;
      case 'Send Engagement Email':
        return <Mail className="w-4 h-4" />;
      case 'Schedule Call':
        return <Phone className="w-4 h-4" />;
      case 'Feature Tutorial':
      case 'Feature Training':
        return <BookOpen className="w-4 h-4" />;
      case 'Offer Upgrade':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Offer Discount':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Send Engagement Email':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Schedule Call':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Feature Tutorial':
      case 'Feature Training':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Offer Upgrade':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-slate-300 text-sm">At Risk</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">{customers.length}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-400" />
            <span className="text-slate-300 text-sm">Risk MRR</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">
            ${customers.reduce((sum, customer) => sum + customer.mrr, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {customers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-colors cursor-pointer"
            onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-slate-400" />
                  <h3 className="text-white font-medium text-sm">{customer.name}</h3>
                </div>
                <p className="text-slate-400 text-xs">{customer.email}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(customer.riskScore)}`}>
                {getRiskLabel(customer.riskScore)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-slate-400 text-xs">Plan</p>
                <p className="text-white text-sm font-medium">{customer.plan}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">MRR</p>
                <p className="text-white text-sm font-medium">${customer.mrr}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400 text-xs">
                  Last active: {formatDate(customer.lastActivity)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Risk Score</p>
                <p className={`text-sm font-bold ${customer.riskScore >= 80 ? 'text-red-400' : customer.riskScore >= 70 ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {customer.riskScore}%
                </p>
              </div>
            </div>

            {/* Risk Score Bar */}
            <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all duration-300 ${
                  customer.riskScore >= 80 ? 'bg-red-400' :
                  customer.riskScore >= 70 ? 'bg-orange-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${customer.riskScore}%` }}
              ></div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <p className="text-slate-300 text-xs font-medium">Recommendations:</p>
              <div className="flex flex-wrap gap-2">
                {customer.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(rec)}`}
                  >
                    {getRecommendationIcon(rec)}
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {selectedCustomer === customer.id && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <h4 className="text-white text-sm font-medium mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
                        Send Engagement Email
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-colors">
                        Schedule Success Call
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors">
                        Offer Retention Discount
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Summary */}
      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <h4 className="text-white font-medium mb-3">Recommended Actions</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">High-risk customers to contact:</span>
            <span className="text-red-400 font-medium">
              {customers.filter(c => c.riskScore >= 80).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Potential revenue at risk:</span>
            <span className="text-orange-400 font-medium">
              ${customers.filter(c => c.riskScore >= 70).reduce((sum, c) => sum + c.mrr, 0).toLocaleString()}/mo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Immediate actions needed:</span>
            <span className="text-violet-400 font-medium">
              {customers.filter(c => c.riskScore >= 75).length} customers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnInsightsPanel;