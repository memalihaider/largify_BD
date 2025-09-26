import React from 'react';
import { logoutUser } from '../utils/auth';

const ApplicationInProcessModal = ({ isOpen, onClose, userEmail }) => {
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      window.location.href = '/login';
    }
  };

  const handleContactSupport = () => {
    window.open('mailto:support@bd-saas.com?subject=Application Status Inquiry&body=Hello, I would like to inquire about the status of my application. My email: ' + userEmail, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Application In Process
          </h2>
          <p className="text-gray-600 mb-4">
            Your subscription application is currently being reviewed by our team. 
            You will receive an email notification once your application has been approved.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Our team will review your application within 24-48 hours</li>
              <li>• You'll receive an email with your account activation details</li>
              <li>• Once approved, you can access all dashboard features</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleContactSupport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Contact Support
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Need immediate assistance? Email us at{' '}
            <a href="mailto:support@bd-saas.com" className="text-blue-600 hover:underline">
              support@bd-saas.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInProcessModal;