import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, User, Package, Upload, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: 'Pakistan',
    couponCode: '',
    referenceCode: ''
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected plan from navigation state
  useEffect(() => {
    const plan = location.state?.selectedPlan;
    if (plan) {
      setSelectedPlan(plan);
    } else {
      // Redirect to plans if no plan selected
      navigate('/#plans');
    }
  }, [location.state?.selectedPlan, navigate]);

  // Memoized payment details
  const paymentDetails = useMemo(() => ({
    beneficiary: "MUHAMMAD ALI HAIDER",
    bank: "Meezan Bank-MEEZAN DIGITAL CENTRE",
    accountNumber: "00300109180495",
    iban: "PK27MEZN0000300109180495"
  }), []);

  // Optimized input change handler using useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Optimized file upload handler
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  }, []);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const fieldsValid = requiredFields.every(field => formData[field].trim() !== '');
    return fieldsValid && receiptFile;
  }, [formData, receiptFile]);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add personal information
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('company', formData.company);
      submitData.append('city', formData.city);
      
      // Add plan information from location state
      if (selectedPlan) {
        submitData.append('planName', selectedPlan.name);
        submitData.append('planPrice', selectedPlan.price);
        submitData.append('planCurrency', selectedPlan.currency || 'PKR');
        submitData.append('planPeriod', selectedPlan.period || 'monthly');
      }
      
      // Add receipt file
      if (receiptFile) {
        submitData.append('receipt', receiptFile);
      }

      // Add promotional codes if provided
      if (formData.couponCode.trim()) {
        submitData.append('couponCode', formData.couponCode.trim());
      }
      if (formData.referenceCode.trim()) {
        submitData.append('referenceCode', formData.referenceCode.trim());
      }

      // Submit to backend
      const response = await fetch('http://localhost:5001/api/checkout/process', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        // Store order ID for tracking
        localStorage.setItem('orderId', result.data.order.id);
        
        // Navigate to success page
        navigate('/checkout-success', { 
          state: { 
            orderData: result.data,
            message: result.message
          } 
        });
      } else {
        alert(result.message || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedPlan, receiptFile, navigate]);

  // Memoized toggle functions


  // Loading state
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <p className="text-slate-400 mt-1">Complete your subscription to Largify BD</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                {/* Coupon and Reference Codes Section */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-medium text-white mb-4">Promotional Codes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Coupon Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Enter coupon code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Reference Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="referenceCode"
                        value={formData.referenceCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Enter reference code"
                      />
                    </div>
                  </div>
                </div>


              </div>

              {/* Payment Details */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Payment Details</h2>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4">Bank Transfer Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Beneficiary:</span>
                      <span className="text-white font-medium">{paymentDetails.beneficiary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bank:</span>
                      <span className="text-white font-medium">{paymentDetails.bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Number:</span>
                      <span className="text-white font-mono">{paymentDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IBAN:</span>
                      <span className="text-white font-mono">{paymentDetails.iban}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-amber-300 font-medium mb-1">Payment Instructions</h4>
                      <p className="text-amber-200 text-sm">
                        Please transfer the exact amount to the above account and upload the payment receipt below. 
                        Your subscription will be activated after payment verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Receipt */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Upload Payment Receipt</h2>
                </div>

                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="receipt"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="receipt" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">
                      {receiptFile ? receiptFile.name : 'Click to upload payment receipt'}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Supported formats: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Order Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{selectedPlan.name}</h3>
                    <p className="text-slate-400 text-sm">{selectedPlan.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">
                      ₨{selectedPlan.price?.toLocaleString() || 'Custom'}
                    </span>
                  </div>
                  {selectedPlan.period && (
                    <p className="text-slate-400 text-sm text-right">
                      per {selectedPlan.period}
                    </p>
                  )}
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-300 text-sm">
                      Secure payment processing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;