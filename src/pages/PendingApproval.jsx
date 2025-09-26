import React from 'react';
import { Clock, AlertTriangle, Mail, Phone } from 'lucide-react';
import Card from '../components/Card';

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex p-4 bg-yellow-500/10 rounded-full mb-4">
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h1>
            <p className="text-slate-400">
              Your customer account has been created successfully and is currently under review.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-white">What happens next?</span>
            </div>
            <ul className="text-sm text-slate-400 space-y-2 text-left">
              <li>• Our team will review your account within 24-48 hours</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• After approval, you'll have full access to all features</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Need immediate assistance? Contact our support team:
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="mailto:support@company.com"
                className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email Support</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">Call Us</span>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Refresh Status
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PendingApproval;