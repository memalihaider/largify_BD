import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, Clock, ArrowRight } from 'lucide-react';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData, message } = location.state || {};

  useEffect(() => {
    // Redirect to home if no order data
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Application Submitted Successfully!</h1>
          <p className="text-slate-400 text-lg">
            {message || "Your subscription application has been received and is being processed."}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Name:</span>
              <span className="text-white">{orderData.firstName} {orderData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="text-white">{orderData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phone:</span>
              <span className="text-white">{orderData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Plan:</span>
              <span className="text-white">{orderData.plan?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amount:</span>
              <span className="text-white font-semibold">
                ₨{orderData.plan?.price?.toLocaleString() || 'Custom'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">What Happens Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Payment Verification</h3>
                <p className="text-slate-400 text-sm">
                  Our team will verify your payment receipt within 24 hours.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Account Activation</h3>
                <p className="text-slate-400 text-sm">
                  Once approved, your premium features will be activated automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Welcome Email</h3>
                <p className="text-slate-400 text-sm">
                  You'll receive a welcome email with access instructions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Updates */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-blue-300 font-medium mb-1">Email Confirmation Sent</h4>
              <p className="text-blue-200 text-sm">
                A confirmation email has been sent to <strong>{orderData.email}</strong>. 
                Please check your inbox and spam folder.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-amber-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-amber-300 font-medium mb-1">Processing Time</h4>
              <p className="text-amber-200 text-sm">
                Applications are typically processed within 24 hours during business days. 
                You'll be notified via email once your subscription is activated.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Need help? Contact us at{' '}
            <a 
              href="mailto:largifysolutions@gmail.com" 
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              largifysolutions@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;