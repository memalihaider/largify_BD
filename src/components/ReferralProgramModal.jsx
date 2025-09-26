import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  AlertCircle,
  Info
} from 'lucide-react';

const ReferralProgramModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    campaignName: '',
    description: '',
    rewardType: 'fixed', // 'fixed' or 'percentage'
    rewardValue: '',
    threshold: 1,
    maxRewards: '',
    startDate: '',
    endDate: '',
    status: 'active',
    terms: '',
    targetAudience: 'all' // 'all', 'new_users', 'existing_users'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        campaignName: editData.campaignName || '',
        description: editData.description || '',
        rewardType: editData.rewardType || 'fixed',
        rewardValue: editData.rewardValue || '',
        threshold: editData.threshold || 1,
        maxRewards: editData.maxRewards || '',
        startDate: editData.startDate || '',
        endDate: editData.endDate || '',
        status: editData.status || 'active',
        terms: editData.terms || '',
        targetAudience: editData.targetAudience || 'all'
      });
    } else {
      // Reset form for new campaign
      setFormData({
        campaignName: '',
        description: '',
        rewardType: 'fixed',
        rewardValue: '',
        threshold: 1,
        maxRewards: '',
        startDate: '',
        endDate: '',
        status: 'active',
        terms: '',
        targetAudience: 'all'
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.rewardValue || formData.rewardValue <= 0) {
      newErrors.rewardValue = 'Reward value must be greater than 0';
    }

    if (formData.rewardType === 'percentage' && formData.rewardValue > 100) {
      newErrors.rewardValue = 'Percentage cannot exceed 100%';
    }

    if (!formData.threshold || formData.threshold < 1) {
      newErrors.threshold = 'Threshold must be at least 1';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving referral program:', error);
    } finally {
      setLoading(false);
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editData ? 'Edit Referral Program' : 'Create New Referral Program'}
            </h2>
            <p className="text-slate-400 mt-1">
              Configure your referral campaign settings and rewards
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-violet-400" />
                Basic Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => handleInputChange('campaignName', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.campaignName ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter campaign name"
              />
              {errors.campaignName && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.campaignName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none ${
                  errors.description ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Describe your referral program"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Reward Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-violet-400" />
                Reward Configuration
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reward Type
              </label>
              <select
                value={formData.rewardType}
                onChange={(e) => handleInputChange('rewardType', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="fixed">Fixed Amount ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reward Value *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">
                    {formData.rewardType === 'fixed' ? '$' : '%'}
                  </span>
                </div>
                <input
                  type="number"
                  value={formData.rewardValue}
                  onChange={(e) => handleInputChange('rewardValue', parseFloat(e.target.value) || '')}
                  className={`w-full pl-8 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.rewardValue ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="0"
                  min="0"
                  step={formData.rewardType === 'fixed' ? '0.01' : '1'}
                />
              </div>
              {errors.rewardValue && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rewardValue}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Referral Threshold *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => handleInputChange('threshold', parseInt(e.target.value) || 1)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.threshold ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="1"
                  min="1"
                />
              </div>
              {errors.threshold && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.threshold}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Number of successful referrals needed to earn reward
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Maximum Rewards (Optional)
              </label>
              <input
                type="number"
                value={formData.maxRewards}
                onChange={(e) => handleInputChange('maxRewards', parseInt(e.target.value) || '')}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Unlimited"
                min="1"
              />
              <p className="mt-1 text-xs text-slate-400">
                Leave empty for unlimited rewards
              </p>
            </div>
          </div>

          {/* Campaign Duration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-violet-400" />
                Campaign Duration
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.startDate ? 'border-red-500' : 'border-slate-600'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.endDate ? 'border-red-500' : 'border-slate-600'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-violet-400" />
              Target Audience
            </h3>
            <select
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Users</option>
              <option value="new_users">New Users Only</option>
              <option value="existing_users">Existing Users Only</option>
            </select>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Terms and Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Enter terms and conditions for this referral program..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editData ? 'Update Program' : 'Create Program'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralProgramModal;