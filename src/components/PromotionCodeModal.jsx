import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Percent, Users, Target, Settings, AlertCircle, Info } from 'lucide-react';

const PromotionCodeModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderValue: '',
    maximumDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    usagePerUser: '',
    targetAudience: 'all',
    applicableProducts: 'all',
    stackable: false,
    autoGenerate: false,
    requiresApproval: false,
    priority: 'medium',
    channels: ['website'],
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        code: editData.code || '',
        discountType: editData.discountType || 'percentage',
        discountValue: editData.discountValue?.toString() || '',
        minimumOrderValue: editData.minimumOrderValue?.toString() || '',
        maximumDiscount: editData.maximumDiscount?.toString() || '',
        startDate: editData.startDate || '',
        endDate: editData.endDate || '',
        usageLimit: editData.usageLimit?.toString() || '',
        usagePerUser: editData.usagePerUser?.toString() || '',
        targetAudience: editData.targetAudience || 'all',
        applicableProducts: editData.applicableProducts || 'all',
        stackable: editData.stackable || false,
        autoGenerate: false,
        requiresApproval: editData.requiresApproval || false,
        priority: editData.priority || 'medium',
        channels: editData.channels || ['website'],
        tags: editData.tags || []
      });
    } else {
      // Reset form for new promotion
      setFormData({
        name: '',
        description: '',
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minimumOrderValue: '',
        maximumDiscount: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        usagePerUser: '',
        targetAudience: 'all',
        applicableProducts: 'all',
        stackable: false,
        autoGenerate: false,
        requiresApproval: false,
        priority: 'medium',
        channels: ['website'],
        tags: []
      });
    }
    setErrors({});
    setCurrentStep(1);
  }, [editData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.autoGenerate && !formData.code.trim()) newErrors.code = 'Promotion code is required';
    if (!formData.discountValue) newErrors.discountValue = 'Discount value is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

    // Code validation
    if (!formData.autoGenerate && formData.code) {
      if (formData.code.length < 3) newErrors.code = 'Code must be at least 3 characters';
      if (formData.code.length > 20) newErrors.code = 'Code must be less than 20 characters';
      if (!/^[A-Z0-9]+$/.test(formData.code)) newErrors.code = 'Code must contain only uppercase letters and numbers';
    }

    // Discount validation
    const discountValue = parseFloat(formData.discountValue);
    if (isNaN(discountValue) || discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be a positive number';
    } else if (formData.discountType === 'percentage' && discountValue > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%';
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Usage limits validation
    if (formData.usageLimit && (isNaN(parseInt(formData.usageLimit)) || parseInt(formData.usageLimit) <= 0)) {
      newErrors.usageLimit = 'Usage limit must be a positive number';
    }
    if (formData.usagePerUser && (isNaN(parseInt(formData.usagePerUser)) || parseInt(formData.usagePerUser) <= 0)) {
      newErrors.usagePerUser = 'Usage per user must be a positive number';
    }

    // Minimum order value validation
    if (formData.minimumOrderValue && (isNaN(parseFloat(formData.minimumOrderValue)) || parseFloat(formData.minimumOrderValue) < 0)) {
      newErrors.minimumOrderValue = 'Minimum order value must be a non-negative number';
    }

    // Maximum discount validation
    if (formData.maximumDiscount && (isNaN(parseFloat(formData.maximumDiscount)) || parseFloat(formData.maximumDiscount) <= 0)) {
      newErrors.maximumDiscount = 'Maximum discount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePromotionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minimumOrderValue: formData.minimumOrderValue ? parseFloat(formData.minimumOrderValue) : 0,
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        usagePerUser: formData.usagePerUser ? parseInt(formData.usagePerUser) : 1,
        code: formData.autoGenerate ? generatePromotionCode() : formData.code.toUpperCase()
      };

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleChannelChange = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: 'Basic Info', icon: Info },
    { id: 2, title: 'Discount Settings', icon: Percent },
    { id: 3, title: 'Targeting & Limits', icon: Target },
    { id: 4, title: 'Advanced Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {editData ? 'Edit Promotion Campaign' : 'Create Promotion Campaign'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Configure your promotional campaign settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-violet-600 border-violet-600 text-white' 
                    : 'border-slate-600 text-slate-400'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-white' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-violet-600' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        errors.name ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="e.g., Summer Sale 2024"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.description ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Describe your promotional campaign..."
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Promotion Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      disabled={formData.autoGenerate}
                      className={`flex-1 px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        errors.code ? 'border-red-500' : 'border-slate-600'
                      } ${formData.autoGenerate ? 'opacity-50' : ''}`}
                      placeholder="e.g., SUMMER25"
                    />
                    <button
                      type="button"
                      onClick={generatePromotionCode}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="autoGenerate"
                      checked={formData.autoGenerate}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoGenerate: e.target.checked }))}
                      className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="autoGenerate" className="ml-2 text-sm text-slate-300">
                      Auto-generate unique code
                    </label>
                  </div>
                  {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Marketing Channels
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['website', 'email', 'social', 'mobile', 'affiliate', 'print', 'radio', 'tv'].map((channel) => (
                      <label key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.channels.includes(channel)}
                          onChange={() => handleChannelChange(channel)}
                          className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="ml-2 text-sm text-slate-300 capitalize">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Discount Settings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="percentage">Percentage Discount</option>
                      <option value="fixed">Fixed Amount Discount</option>
                      <option value="bogo">Buy One Get One</option>
                      <option value="shipping">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      {formData.discountType === 'fixed' && (
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      )}
                      {formData.discountType === 'percentage' && (
                        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      )}
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                        disabled={formData.discountType === 'shipping'}
                        className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                          errors.discountValue ? 'border-red-500' : 'border-slate-600'
                        } ${formData.discountType === 'fixed' ? 'pl-10' : ''} ${formData.discountType === 'percentage' ? 'pr-10' : ''}`}
                        placeholder={formData.discountType === 'percentage' ? '25' : '50'}
                        min="0"
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        step={formData.discountType === 'percentage' ? '0.1' : '0.01'}
                      />
                    </div>
                    {errors.discountValue && <p className="text-red-400 text-sm mt-1">{errors.discountValue}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Minimum Order Value
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="number"
                        value={formData.minimumOrderValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumOrderValue: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                          errors.minimumOrderValue ? 'border-red-500' : 'border-slate-600'
                        }`}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.minimumOrderValue && <p className="text-red-400 text-sm mt-1">{errors.minimumOrderValue}</p>}
                  </div>

                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Maximum Discount Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          value={formData.maximumDiscount}
                          onChange={(e) => setFormData(prev => ({ ...prev, maximumDiscount: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                            errors.maximumDiscount ? 'border-red-500' : 'border-slate-600'
                          }`}
                          placeholder="No limit"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {errors.maximumDiscount && <p className="text-red-400 text-sm mt-1">{errors.maximumDiscount}</p>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Campaign Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                          errors.startDate ? 'border-red-500' : 'border-slate-600'
                        }`}
                      />
                    </div>
                    {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Campaign End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                          errors.endDate ? 'border-red-500' : 'border-slate-600'
                        }`}
                      />
                    </div>
                    {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Targeting & Limits */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="all">All Customers</option>
                      <option value="new_users">New Customers Only</option>
                      <option value="existing_users">Existing Customers Only</option>
                      <option value="premium_users">Premium Members</option>
                      <option value="inactive_users">Inactive Customers</option>
                      <option value="high_value">High-Value Customers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Applicable Products
                    </label>
                    <select
                      value={formData.applicableProducts}
                      onChange={(e) => setFormData(prev => ({ ...prev, applicableProducts: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="all">All Products</option>
                      <option value="categories">Specific Categories</option>
                      <option value="specific">Specific Products</option>
                      <option value="brands">Specific Brands</option>
                      <option value="new_arrivals">New Arrivals</option>
                      <option value="sale_items">Sale Items</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                      className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        errors.usageLimit ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Unlimited"
                      min="1"
                    />
                    {errors.usageLimit && <p className="text-red-400 text-sm mt-1">{errors.usageLimit}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Usage Per Customer
                    </label>
                    <input
                      type="number"
                      value={formData.usagePerUser}
                      onChange={(e) => setFormData(prev => ({ ...prev, usagePerUser: e.target.value }))}
                      className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        errors.usagePerUser ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="1"
                      min="1"
                    />
                    {errors.usagePerUser && <p className="text-red-400 text-sm mt-1">{errors.usagePerUser}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Campaign Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-violet-600/20 text-violet-400 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-violet-400 hover:text-violet-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Advanced Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Stackable with Other Promotions</h4>
                      <p className="text-slate-400 text-sm">Allow this promotion to be combined with other offers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.stackable}
                      onChange={(e) => setFormData(prev => ({ ...prev, stackable: e.target.checked }))}
                      className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Requires Approval</h4>
                      <p className="text-slate-400 text-sm">Campaign needs approval before going live</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requiresApproval}
                      onChange={(e) => setFormData(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                      className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-400 font-medium mb-1">Campaign Preview</h4>
                      <div className="text-sm text-slate-300 space-y-1">
                        <p><strong>Code:</strong> {formData.code || 'AUTO_GENERATED'}</p>
                        <p><strong>Discount:</strong> {
                          formData.discountType === 'fixed' 
                            ? `$${formData.discountValue} off` 
                            : formData.discountType === 'percentage'
                            ? `${formData.discountValue}% off`
                            : formData.discountType === 'shipping'
                            ? 'Free shipping'
                            : 'Buy one get one'
                        }</p>
                        {formData.minimumOrderValue && (
                          <p><strong>Minimum Order:</strong> ${formData.minimumOrderValue}</p>
                        )}
                        <p><strong>Valid:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'TBD'} - {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'TBD'}</p>
                        <p><strong>Target:</strong> {formData.targetAudience.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : editData ? 'Update Campaign' : 'Create Campaign'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionCodeModal;