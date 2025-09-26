import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Lightbulb, CreditCard } from 'lucide-react';
import { 
  Home, 
  Users, 
  UserPlus, 
  BarChart3, 
  CheckSquare,
  Package,
  FileText,
  Target,
  Building2,
  TrendingUp,
  Receipt,
  UserCog,
  Settings,
  HelpCircle,
  MessageSquare,
  Calendar,
  PieChart,
  Contact,
  Star,
  Bell,
  Mail,
  Phone,
  Briefcase,
  ClipboardList,
  FolderOpen,
  Archive
} from 'lucide-react';
import { getUserRole, canAccessAdminFeatures, canAccessSuperAdminFeatures, isApprovedCustomer } from '../utils/auth';

const NavbarSearch = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Define all available pages with their metadata
  const getAllPages = () => {
    const userRole = getUserRole();
    const pages = [];

    // Dashboard - available to all authenticated users
    pages.push({
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Main dashboard overview',
      icon: Home,
      path: '/dashboard',
      keywords: ['dashboard', 'home', 'overview', 'main']
    });

    // Admin-only pages
    if (canAccessAdminFeatures()) {

      pages.push({
        id: 'reports-analytics',
        title: 'Reports & Analytics',
        description: 'View detailed reports and analytics',
        icon: BarChart3,
        path: '/dashboard/reports-analytics',
        keywords: ['reports', 'analytics', 'data', 'statistics', 'metrics']
      });
      pages.push({
        id: 'subscription-analytics',
        title: 'Subscription Analytics',
        description: 'Track subscription metrics',
        icon: TrendingUp,
        path: '/dashboard/subscription-analytics',
        keywords: ['subscription', 'analytics', 'revenue', 'growth']
      });
      pages.push({
        id: 'team-management',
        title: 'Team Management',
        description: 'Manage team members and roles',
        icon: UserCog,
        path: '/dashboard/team-management',
        keywords: ['team', 'management', 'roles', 'permissions']
      });
    }

    // Team member and above (not customers)
    if (userRole !== 'Customer') {
      pages.push({
        id: 'leads',
        title: 'Leads',
        description: 'Manage and track leads',
        icon: UserPlus,
        path: '/dashboard/leads',
        keywords: ['leads', 'prospects', 'potential', 'customers']
      });
      pages.push({
        id: 'contacts',
        title: 'Contacts',
        description: 'Manage contact information',
        icon: Contact,
        path: '/dashboard/contacts',
        keywords: ['contacts', 'people', 'directory', 'address']
      });
      pages.push({
        id: 'lead-scoring',
        title: 'Lead Scoring',
        description: 'Score and prioritize leads',
        icon: Star,
        path: '/dashboard/lead-scoring',
        keywords: ['lead', 'scoring', 'priority', 'ranking']
      });
      pages.push({
        id: 'outreach',
        title: 'Outreach',
        description: 'Manage outreach campaigns',
        icon: Target,
        path: '/dashboard/outreach',
        keywords: ['outreach', 'campaigns', 'marketing', 'communication']
      });
      pages.push({
        id: 'crm',
        title: 'CRM',
        description: 'Customer relationship management',
        icon: Building2,
        path: '/dashboard/crm',
        keywords: ['crm', 'customer', 'relationship', 'management']
      });
      pages.push({
        id: 'tasks',
        title: 'Tasks',
        description: 'Manage tasks and to-dos',
        icon: CheckSquare,
        path: '/dashboard/tasks',
        keywords: ['tasks', 'todo', 'assignments', 'work']
      });
      pages.push({
        id: 'meeting-scheduler',
        title: 'Meeting Scheduler',
        description: 'Schedule and manage meetings',
        icon: Calendar,
        path: '/dashboard/meeting-scheduler',
        keywords: ['meeting', 'scheduler', 'calendar', 'appointments']
      });
      pages.push({
        id: 'marketing-dashboard',
        title: 'Marketing Dashboard',
        description: 'Marketing insights and metrics',
        icon: PieChart,
        path: '/dashboard/marketing-dashboard',
        keywords: ['marketing', 'dashboard', 'insights', 'campaigns']
      });
      pages.push({
        id: 'proposals',
        title: 'Proposals',
        description: 'Create and manage proposals',
        icon: FileText,
        path: '/dashboard/proposals',
        keywords: ['proposals', 'documents', 'quotes', 'offers']
      });
      pages.push({
        id: 'pipeline',
        title: 'Pipeline',
        description: 'Sales pipeline management',
        icon: TrendingUp,
        path: '/dashboard/pipeline',
        keywords: ['pipeline', 'sales', 'funnel', 'deals']
      });
      pages.push({
        id: 'sales-invoices',
        title: 'Sales & Invoices',
        description: 'Manage sales and invoicing',
        icon: Receipt,
        path: '/dashboard/sales-invoices',
        keywords: ['sales', 'invoices', 'billing', 'revenue']
      });
    }

    // Customer-specific pages (for approved customers)
    if (userRole === 'Customer' && isApprovedCustomer()) {
      pages.push({
        id: 'orders',
        title: 'My Orders',
        description: 'View your order history',
        icon: Package,
        path: '/dashboard/orders',
        keywords: ['orders', 'purchases', 'history', 'my']
      });
      pages.push({
        id: 'subscription-plans',
        title: 'Subscription Plans',
        description: 'Manage your subscription',
        icon: CreditCard,
        path: '/dashboard/subscription-plans',
        keywords: ['subscription', 'plans', 'billing', 'upgrade']
      });
    }

    // Common pages for all users
    pages.push({
      id: 'support',
      title: 'Support',
      description: 'Get help and support',
      icon: HelpCircle,
      path: '/dashboard/support',
      keywords: ['support', 'help', 'assistance', 'tickets']
    });
    pages.push({
      id: 'feedback',
      title: 'Feedback',
      description: 'Provide feedback and suggestions',
      icon: MessageSquare,
      path: '/dashboard/feedback',
      keywords: ['feedback', 'suggestions', 'comments', 'review']
    });
    pages.push({
      id: 'ideas',
      title: 'Ideas',
      description: 'Share and explore ideas',
      icon: Lightbulb,
      path: '/dashboard/ideas',
      keywords: ['ideas', 'innovation', 'suggestions', 'brainstorm']
    });
    pages.push({
      id: 'notes',
      title: 'Notes',
      description: 'Personal notes and reminders',
      icon: ClipboardList,
      path: '/dashboard/notes',
      keywords: ['notes', 'reminders', 'personal', 'memo']
    });
    pages.push({
      id: 'settings',
      title: 'Settings',
      description: 'Account and application settings',
      icon: Settings,
      path: '/dashboard/settings',
      keywords: ['settings', 'preferences', 'configuration', 'account']
    });

    return pages;
  };

  // Fuzzy search algorithm
  const fuzzyMatch = (query, text) => {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    if (textLower.includes(queryLower)) {
      return { score: 100, match: true };
    }
    
    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }
    
    const matchPercentage = (queryIndex / queryLower.length) * 100;
    return { score: matchPercentage, match: matchPercentage > 50 };
  };

  // Search function
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const pages = getAllPages();
    const results = [];

    pages.forEach(page => {
      const titleMatch = fuzzyMatch(query, page.title);
      const descriptionMatch = fuzzyMatch(query, page.description);
      const keywordMatches = page.keywords.map(keyword => fuzzyMatch(query, keyword));
      const bestKeywordMatch = keywordMatches.reduce((best, current) => 
        current.score > best.score ? current : best, { score: 0, match: false });

      const bestMatch = [titleMatch, descriptionMatch, bestKeywordMatch]
        .reduce((best, current) => current.score > best.score ? current : best);

      if (bestMatch.match) {
        results.push({
          ...page,
          searchScore: bestMatch.score
        });
      }
    });

    // Sort by search score (highest first)
    results.sort((a, b) => b.searchScore - a.searchScore);
    setSearchResults(results.slice(0, 8)); // Limit to 8 results
  };

  // Handle search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSearchOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleResultClick(searchResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (page) => {
    navigate(page.path);
    handleClose();
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    setIsSearchOpen(true);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          className="w-full pl-10 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={handleClose}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((page, index) => {
                const IconComponent = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => handleResultClick(page)}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors duration-200 flex items-center space-x-3 ${
                      index === selectedIndex ? 'bg-slate-700' : ''
                    }`}
                  >
                    <IconComponent className="h-4 w-4 text-violet-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {page.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {page.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchQuery ? (
            <div className="px-4 py-6 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pages found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start typing to search pages...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;