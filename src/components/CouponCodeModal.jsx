import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calendar, 
  DollarSign, 
  Percent, 
  Users, 
  AlertCircle,
  Info,
  Hash,
  ShoppingCart,
  Target
} from 'lucide-react';

const CouponCodeModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    discountValue: '',
    minimumOrderValue: '',
    maximumDiscount: '',
    usageLimit: '',
    usagePerUser: '',
    startDate: '',
    endDate: '',
    status: 'active',
    applicableProducts: 'all', // 'all', 'specific', 'categories'
    userRestrictions: 'all', // 'all', 'new_users', 'existing_users'
    stackable: false,
    autoGenerate: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        code: editData.code || '',
        name: editData.name || '',
        description: editData.description || '',
        discountType: editData.discountType || 'percentage',
        discountValue: editData.discountValue || '',
        minimumOrderValue: editData.minimumOrderValue || '',
        maximumDiscount: editData.maximumDiscount || '',
        usageLimit: editData.usageLimit || '',
        usagePerUser: editData.usagePerUser || '',
        startDate: editData.startDate || '',
        endDate: editData.endDate || '',
        status: editData.status || 'active',
        applicableProducts: editData.applicableProducts || 'all',
        userRestrictions: editData.userRestrictions || 'all',
        stackable: editData.stackable || false,
        autoGenerate: false
      });
    } else {
      // Reset form for new coupon
      setFormData({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minimumOrderValue: '',
        maximumDiscount: '',
        usageLimit: '',
        usagePerUser: '',
        startDate: '',
        endDate: '',
        status: 'active',
        applicableProducts: 'all',
        userRestrictions: 'all',
        stackable: false,
        autoGenerate: false
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAutoGenerate = () => {
    const newCode = generateCouponCode();
    setFormData(prev => ({ ...prev, code: newCode }));
    if (errors.code) {
      setErrors(prev => ({ ...prev, code: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Coupon code must be at least 3 characters';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = 'Coupon code must contain only uppercase letters and numbers';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Coupon name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }

    if (formData.minimumOrderValue && formData.minimumOrderValue < 0) {
      newErrors.minimumOrderValue = 'Minimum order value cannot be negative';
    }

    if (formData.maximumDiscount && formData.maximumDiscount <= 0) {
      newErrors.maximumDiscount = 'Maximum discount must be greater than 0';
    }

    if (formData.usageLimit && formData.usageLimit < 1) {
      newErrors.usageLimit = 'Usage limit must be at least 1';
    }

    if (formData.usagePerUser && formData.usagePerUser < 1) {
      newErrors.usagePerUser = 'Usage per user must be at least 1';
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
      console.error('Error saving coupon:', error);
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
              {editData ? 'Edit Coupon Code' : 'Create New Coupon Code'}
            </h2>
            <p className="text-slate-400 mt-1">
              Configure your coupon code settings and restrictions
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
                Coupon Code *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  className={`flex-1 px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.code ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="SAVE20"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Hash className="w-4 h-4 mr-1" />
                  Generate
                </button>
              </div>
              {errors.code && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.code}
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Coupon Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Summer Sale 2024"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Stackable with Other Coupons
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.stackable}
                  onChange={(e) => handleInputChange('stackable', e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                />
                <span className="ml-2 text-slate-300">Allow stacking with other coupons</span>
              </label>
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
                placeholder="Describe your coupon offer"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-violet-400" />
                Discount Configuration
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount Value *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.discountType === 'fixed' ? (
                    <DollarSign className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Percent className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || '')}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.discountValue ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="0"
                  min="0"
                  step={formData.discountType === 'fixed' ? '0.01' : '1'}
                />
              </div>
              {errors.discountValue && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.discountValue}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Minimum Order Value (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  value={formData.minimumOrderValue}
                  onChange={(e) => handleInputChange('minimumOrderValue', parseFloat(e.target.value) || '')}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.minimumOrderValue ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.minimumOrderValue && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.minimumOrderValue}
                </p>
              )}
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Maximum Discount (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={formData.maximumDiscount}
                    onChange={(e) => handleInputChange('maximumDiscount', parseFloat(e.target.value) || '')}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.maximumDiscount ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.maximumDiscount && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.maximumDiscount}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Cap the maximum discount amount for percentage-based coupons
                </p>
              </div>
            )}
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-violet-400" />
                Usage Limits
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total Usage Limit (Optional)
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value) || '')}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.usageLimit ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Unlimited"
                min="1"
              />
              {errors.usageLimit && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.usageLimit}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Total number of times this coupon can be used
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Usage Per User (Optional)
              </label>
              <input
                type="number"
                value={formData.usagePerUser}
                onChange={(e) => handleInputChange('usagePerUser', parseInt(e.target.value) || '')}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.usagePerUser ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Unlimited"
                min="1"
              />
              {errors.usagePerUser && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.usagePerUser}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Maximum uses per individual user
              </p>
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-violet-400" />
                Validity Period
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

          {/* Restrictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-violet-400" />
                Restrictions
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Applicable Products
              </label>
              <select
                value={formData.applicableProducts}
                onChange={(e) => handleInputChange('applicableProducts', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Products</option>
                <option value="specific">Specific Products</option>
                <option value="categories">Product Categories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                User Restrictions
              </label>
              <select
                value={formData.userRestrictions}
                onChange={(e) => handleInputChange('userRestrictions', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Users</option>
                <option value="new_users">New Users Only</option>
                <option value="existing_users">Existing Users Only</option>
              </select>
            </div>
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
                  {editData ? 'Update Coupon' : 'Create Coupon'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponCodeModal;