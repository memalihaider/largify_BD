import React, { useState } from 'react';
import { Calendar, DollarSign, Sparkles, User, Building, FileText, Clock } from 'lucide-react';
import { industryOptions, proposalTemplates } from '../data/mockProposals';

const ProposalForm = ({ onProposalGenerated }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    industry: '',
    projectScope: '',
    budgetRange: [10000, 50000],
    deadline: '',
    useAIRecommendations: true
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.projectScope.trim()) {
      newErrors.projectScope = 'Project scope is required';
    } else if (formData.projectScope.length < 50) {
      newErrors.projectScope = 'Project scope should be at least 50 characters';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const generateProposal = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const proposal = {
      ...formData,
      id: Date.now(),
      generatedAt: new Date().toISOString(),
      sections: {
        introduction: `We are pleased to present this comprehensive proposal for ${formData.clientName}'s ${formData.industry.toLowerCase()} project. Our team has carefully analyzed your requirements and developed a tailored solution that aligns with your business objectives and timeline.`,
        
        objectives: [
          `Deliver a high-quality ${formData.industry.toLowerCase()} solution that meets all specified requirements`,
          'Ensure seamless integration with existing systems and workflows',
          'Provide comprehensive training and ongoing support',
          'Achieve project completion within the specified timeline and budget'
        ],
        
        deliverables: [
          'Complete project analysis and requirements documentation',
          'Custom solution development and implementation',
          'Quality assurance testing and validation',
          'User training and documentation',
          'Post-launch support and maintenance'
        ],
        
        timeline: [
          { phase: 'Discovery & Planning', duration: '2 weeks', description: 'Requirements gathering and project planning' },
          { phase: 'Development', duration: '6-8 weeks', description: 'Core development and implementation' },
          { phase: 'Testing & QA', duration: '2 weeks', description: 'Comprehensive testing and quality assurance' },
          { phase: 'Deployment', duration: '1 week', description: 'Go-live and initial support' },
          { phase: 'Support', duration: 'Ongoing', description: 'Maintenance and ongoing support' }
        ],
        
        pricing: {
          basePrice: formData.budgetRange[0],
          maxPrice: formData.budgetRange[1],
          breakdown: [
            { item: 'Project Management', cost: Math.round(formData.budgetRange[0] * 0.15) },
            { item: 'Development', cost: Math.round(formData.budgetRange[0] * 0.60) },
            { item: 'Testing & QA', cost: Math.round(formData.budgetRange[0] * 0.15) },
            { item: 'Training & Support', cost: Math.round(formData.budgetRange[0] * 0.10) }
          ]
        },
        
        closingNotes: `We are confident that our proposed solution will exceed your expectations and deliver significant value to ${formData.clientName}. Our experienced team is committed to ensuring the success of this project and building a long-term partnership with your organization.`
      }
    };

    setIsGenerating(false);
    onProposalGenerated(proposal);
  };

  const formatBudget = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-violet-600 rounded-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">AI Proposal Generator</h2>
          <p className="text-slate-400 text-sm">Fill in the details to generate a professional proposal</p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Client Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2">
            <User className="h-4 w-4" />
            <span>Client Name</span>
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              errors.clientName ? 'border-red-500' : 'border-slate-600'
            }`}
            placeholder="Enter client or company name"
          />
          {errors.clientName && (
            <p className="text-red-400 text-sm mt-1">{errors.clientName}</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2">
            <Building className="h-4 w-4" />
            <span>Industry</span>
          </label>
          <select
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              errors.industry ? 'border-red-500' : 'border-slate-600'
            }`}
          >
            <option value="">Select an industry</option>
            {industryOptions.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-red-400 text-sm mt-1">{errors.industry}</p>
          )}
        </div>

        {/* Project Scope */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2">
            <FileText className="h-4 w-4" />
            <span>Project Scope</span>
          </label>
          <textarea
            value={formData.projectScope}
            onChange={(e) => handleInputChange('projectScope', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none ${
              errors.projectScope ? 'border-red-500' : 'border-slate-600'
            }`}
            placeholder="Describe the project requirements, goals, and expected outcomes..."
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-slate-400">
              {formData.projectScope.length}/1000 characters
            </span>
            {errors.projectScope && (
              <p className="text-red-400 text-sm">{errors.projectScope}</p>
            )}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>Budget Range</span>
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 w-12">Min:</span>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={formData.budgetRange[0]}
                onChange={(e) => handleInputChange('budgetRange', [parseInt(e.target.value), formData.budgetRange[1]])}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-white w-20 text-right">
                {formatBudget(formData.budgetRange[0])}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 w-12">Max:</span>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="5000"
                value={formData.budgetRange[1]}
                onChange={(e) => handleInputChange('budgetRange', [formData.budgetRange[0], parseInt(e.target.value)])}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-white w-20 text-right">
                {formatBudget(formData.budgetRange[1])}
              </span>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2">
            <Calendar className="h-4 w-4" />
            <span>Project Deadline</span>
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              errors.deadline ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          {errors.deadline && (
            <p className="text-red-400 text-sm mt-1">{errors.deadline}</p>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="aiRecommendations"
            checked={formData.useAIRecommendations}
            onChange={(e) => handleInputChange('useAIRecommendations', e.target.checked)}
            className="h-4 w-4 text-violet-600 bg-slate-700 border-slate-600 rounded focus:ring-violet-500"
          />
          <label htmlFor="aiRecommendations" className="text-sm text-slate-300">
            Use AI Recommendations for enhanced proposal content
          </label>
        </div>

        {/* Generate Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={generateProposal}
            disabled={isGenerating}
            className="w-full flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Proposal...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Proposal</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;