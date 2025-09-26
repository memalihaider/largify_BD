import React, { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

const SEOForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (inputUrl) => {
    try {
      // Add protocol if missing
      let validUrl = inputUrl;
      if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        validUrl = 'https://' + inputUrl;
      }
      
      const urlObj = new URL(validUrl);
      return urlObj.href;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const validatedUrl = validateUrl(url.trim());
    if (!validatedUrl) {
      setError('Please enter a valid URL');
      return;
    }

    onSubmit(validatedUrl);
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            Website URL
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={handleInputChange}
              placeholder="Enter website URL (e.g., example.com)"
              className={`w-full px-4 py-3 pr-12 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600'
              }`}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isLoading || !url.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing SEO...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Analyze SEO
            </>
          )}
        </button>
      </form>

      {/* Help text */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>• Enter any website URL to get a comprehensive SEO analysis</p>
        <p>• Analysis includes on-page optimization, technical issues, and recommendations</p>
        <p>• Results typically take 10-30 seconds to generate</p>
      </div>
    </div>
  );
};

export default SEOForm;