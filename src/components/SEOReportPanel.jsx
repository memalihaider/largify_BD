import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ExternalLink } from 'lucide-react';

const SEOReportPanel = ({ report }) => {
  const { url, score, issues, recommendations } = report;

  // Circular progress bar component
  const CircularProgress = ({ score }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getScoreColor = (score) => {
      if (score >= 80) return '#10b981'; // green
      if (score >= 60) return '#f59e0b'; // yellow
      return '#ef4444'; // red
    };

    const getScoreLabel = (score) => {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Fair';
      return 'Poor';
    };

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-xs text-gray-300 font-medium">{getScoreLabel(score)}</span>
        </div>
      </div>
    );
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-900/20';
      case 'low':
        return 'border-l-blue-500 bg-blue-900/20';
      default:
        return 'border-l-gray-500 bg-gray-700/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with URL */}
      <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
        <ExternalLink className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300 truncate">{url}</span>
      </div>

      {/* SEO Score */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-white mb-4">SEO Score</h4>
        <CircularProgress score={score} />
        <p className="text-sm text-gray-400 mt-2">
          Overall SEO performance based on {issues.length + recommendations.length} factors
        </p>
      </div>

      {/* Issues Section */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Issues Found ({issues.length})
        </h4>
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(issue.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(issue.severity)}
                <div className="flex-1">
                  <h5 className="font-medium text-white mb-1">{issue.title}</h5>
                  <p className="text-sm text-gray-300">{issue.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                    issue.severity === 'high' ? 'bg-red-900/30 text-red-300' :
                    issue.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                    'bg-blue-900/30 text-blue-300'
                  }`}>
                    {issue.severity.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Recommendations ({recommendations.length})
        </h4>
        <div className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-700 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-600">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Download Full Report
        </button>
      </div>
    </div>
  );
};

export default SEOReportPanel;