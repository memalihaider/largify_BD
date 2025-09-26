import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  UserPlus, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  CheckSquare,
  Package,
  FileText,
  Lightbulb,
  Target,
  Building2,
  TrendingUp,
  Receipt,
  X,
  LogOut,
  UserCog,
  UserCircle,
  Settings,
  HelpCircle,
  MessageSquare,
  Calendar,
  PieChart,
  ChevronDown,
  ChevronRight,
  Contact,
  Star,
  Menu,
  Bell,
  Mail,
  Phone,
  Briefcase,
  ClipboardList,
  FolderOpen,
  Archive
} from 'lucide-react';
import { getUserRole, canAccessAdminFeatures, canAccessSuperAdminFeatures, isApprovedCustomer } from '../utils/auth';

const EnhancedSidebar = ({ 
  user, 
  isOpen, 
  onClose, 
  activePage = '',
  notifications = {
    tasks: 0,
    support: 0,
    feedback: 0
  }
}) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Enhanced menu structure with proper hierarchy
  const getMenuItems = () => {
    const userRole = getUserRole();
    const menuItems = [];

    // Dashboard - available to all authenticated users
    menuItems.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
    });



    // Reports & Analytics with submenu
    if (canAccessAdminFeatures()) {
      const reportsSubmenu = [
        {
          id: 'reports-analytics',
          label: 'Reports & Analytics',
          icon: BarChart3,
          path: '/dashboard/reports-analytics',
          roles: ['Super Admin', 'Admin', 'Business Owner']
        }
      ];

      // Subscription Analytics - Super Admin only
      if (canAccessSuperAdminFeatures()) {
        reportsSubmenu.push({
          id: 'subscription-analytics',
          label: 'Subscription Analytics',
          icon: TrendingUp,
          path: '/dashboard/subscription-analytics',
          roles: ['Super Admin']
        });
      }

      menuItems.push({
        id: 'reports',
        label: 'Reports & Analytics',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: reportsSubmenu,
        roles: ['Super Admin', 'Admin', 'Business Owner']
      });
    }

    // Team Management
    if (canAccessAdminFeatures()) {
      menuItems.push({
        id: 'team-management',
        label: 'Team Management',
        icon: UserCog,
        path: '/dashboard/team-management',
        roles: ['Super Admin', 'Admin', 'Business Owner']
      });
    }

    // Lead Generation & CRM with submenu
    if (userRole !== 'Customer') {
      menuItems.push({
        id: 'lead-generation-crm',
        label: 'Lead Generation & CRM',
        icon: UserPlus,
        hasSubmenu: true,
        submenu: [
          {
            id: 'leads',
            label: 'Leads',
            icon: UserPlus,
            path: '/dashboard/leads',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'contacts',
            label: 'Contacts',
            icon: Contact,
            path: '/dashboard/contacts',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'lead-scoring',
            label: 'Lead Scoring',
            icon: Star,
            path: '/dashboard/lead-scoring',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'outreach',
            label: 'Outreach',
            icon: Target,
            path: '/outreach',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'crm',
            label: 'CRM',
            icon: Building2,
            path: '/dashboard/crm',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          }
        ],
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
      });
    }

    // Tasks with notification badge
    if (userRole !== 'Customer' || (userRole === 'Customer' && isApprovedCustomer())) {
      menuItems.push({
        id: 'tasks',
        label: 'Tasks',
        icon: CheckSquare,
        path: '/dashboard/tasks',
        badge: notifications.tasks,
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
      });
    }

    // Meeting Scheduler
    if (userRole !== 'Customer') {
      menuItems.push({
        id: 'meeting-scheduler',
        label: 'Meeting Scheduler',
        icon: Calendar,
        path: '/dashboard/meeting-scheduler',
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
      });
    }

    // Marketing with submenu
    if (userRole !== 'Customer') {
      menuItems.push({
        id: 'marketing',
        label: 'Marketing',
        icon: PieChart,
        hasSubmenu: true,
        submenu: [
          {
            id: 'marketing-dashboard',
            label: 'Marketing Dashboard',
            icon: PieChart,
            path: '/dashboard/marketing-dashboard',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'proposals',
            label: 'Proposals',
            icon: FileText,
            path: '/dashboard/proposals',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          }
        ],
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
      });
    }

    // Client Management with submenu
    if (userRole !== 'Customer') {
      menuItems.push({
        id: 'client-management',
        label: 'Client Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          {
            id: 'subscription-management',
            label: 'Subscription Management',
            icon: CreditCard,
            path: '/dashboard/subscription',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'order-management',
            label: 'Order Management',
            icon: Package,
            path: '/dashboard/orders-management',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'plan-management',
            label: 'Plan Management',
            icon: Archive,
            path: '/dashboard/plans-management',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          },
          {
            id: 'marketing-discount-management',
            label: 'Marketing & Discount Management',
            icon: PieChart,
            path: '/dashboard/marketing-discount-dashboard',
            roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
          }
        ],
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
      });
    }

    // Pipeline
    if (userRole !== 'Customer') {
      menuItems.push({
        id: 'pipeline',
        label: 'Pipeline',
        icon: TrendingUp,
        path: '/dashboard/pipeline',
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
      });
    }

    // Sales & Invoices
    if (userRole !== 'Customer') {
      menuItems.push({
        id: 'sales-invoices',
        label: 'Sales & Invoices',
        icon: Receipt,
        path: '/dashboard/sales-invoices',
        roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member']
      });
    }

    // Ideas & Notes with submenu
    const ideasNotesRoles = userRole === 'Customer' && isApprovedCustomer() 
      ? ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
      : ['Super Admin', 'Admin', 'Business Owner', 'Team Member'];

    if (userRole !== 'Customer' || (userRole === 'Customer' && isApprovedCustomer())) {
      menuItems.push({
        id: 'ideas-notes',
        label: 'Ideas & Notes',
        icon: Lightbulb,
        hasSubmenu: true,
        submenu: [
          {
            id: 'ideas',
            label: 'Ideas',
            icon: Lightbulb,
            path: '/dashboard/ideas',
            roles: ideasNotesRoles
          },
          {
            id: 'notes',
            label: 'Notes',
            icon: FileText,
            path: '/dashboard/notes',
            roles: ideasNotesRoles
          }
        ],
        roles: ideasNotesRoles
      });
    }

    // Orders & Plans with submenu - REMOVED (now part of Client Management)
    // This section has been moved to Client Management dropdown

    // Customer-specific items
    if (userRole === 'Customer' && isApprovedCustomer()) {
      menuItems.push({
        id: 'customer-orders',
        label: 'My Orders',
        icon: ShoppingCart,
        path: '/dashboard/orders',
        roles: ['Customer']
      });
      menuItems.push({
        id: 'subscription-plans',
        label: 'Subscription Plans',
        icon: CreditCard,
        path: '/dashboard/subscription',
        roles: ['Customer']
      });
    }

    // My Profile - available to all authenticated users
    menuItems.push({
      id: 'profile',
      label: 'My Profile',
      icon: UserCircle,
      path: '/dashboard/profile',
      roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
    });

    // Settings - available to all authenticated users
    menuItems.push({
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
      roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
    });

    // Support & Feedback with submenu
    menuItems.push({
      id: 'support-feedback',
      label: 'Support & Feedback',
      icon: HelpCircle,
      hasSubmenu: true,
      submenu: [
        {
          id: 'support',
          label: 'Support',
          icon: HelpCircle,
          path: '/dashboard/support',
          badge: notifications.support,
          roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
        },
        {
          id: 'feedback',
          label: 'Feedback',
          icon: MessageSquare,
          path: '/dashboard/feedback',
          badge: notifications.feedback,
          roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
        }
      ],
      roles: ['Super Admin', 'Admin', 'Business Owner', 'Team Member', 'Customer']
    });

    // Filter items based on user role
    return menuItems.filter(item => 
      item.roles.includes(userRole) || 
      (userRole === 'Customer' && isApprovedCustomer() && item.roles.includes('Customer'))
    );
  };

  const menuItems = getMenuItems();

  const isActiveRoute = (path) => {
    if (activePage) {
      return activePage === path;
    }
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname === path;
  };

  const renderBadge = (count) => {
    if (!count || count === 0) return null;
    return (
      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  const renderMenuItem = (item, isMobileView = false) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.path);
    const isExpanded = expandedMenus[item.id];
    
    if (item.hasSubmenu) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleSubmenu(item.id)}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <Icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white transition-colors duration-200" />
            <span className="flex-1 text-left">{item.label}</span>
            <div className="flex items-center space-x-2">
              {item.badge && renderBadge(item.badge)}
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </div>
          </button>
          <div className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {item.submenu.map((subItem) => {
              const SubIcon = subItem.icon;
              const isSubActive = isActiveRoute(subItem.path);
              
              return (
                <Link
                  key={subItem.id}
                  to={subItem.path}
                  onClick={isMobileView ? onClose : undefined}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isSubActive
                      ? 'bg-violet-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <SubIcon
                    className={`mr-3 h-4 w-4 transition-colors duration-200 ${
                      isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="flex-1">{subItem.label}</span>
                  {subItem.badge && renderBadge(subItem.badge)}
                </Link>
              );
            })}
          </div>
        </div>
      );
    }
    
    return (
      <Link
        key={item.id}
        to={item.path}
        onClick={isMobileView ? onClose : undefined}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-violet-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
      >
        <Icon
          className={`mr-3 h-5 w-5 transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
          }`}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge && renderBadge(item.badge)}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r border-slate-700 z-30 shadow-xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-4 bg-slate-900 border-b border-slate-700">
            <Link to="/dashboard" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">BD</span>
              </div>
              <span className="ml-2 text-white font-semibold text-lg group-hover:text-violet-300 transition-colors duration-200">
                Largify BD
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-900">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 capitalize truncate">{user?.role || 'team_member'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
          onClick={onClose} 
        />
        <div className={`fixed inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col flex-1 min-h-0">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 bg-slate-900 border-b border-slate-700">
              <Link to="/dashboard" className="flex items-center group" onClick={onClose}>
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-sm">BD</span>
                </div>
                <span className="ml-2 text-white font-semibold text-lg group-hover:text-violet-300 transition-colors duration-200">
                  Largify BD
                </span>
              </Link>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors duration-200 hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => renderMenuItem(item, true))}
            </nav>

            {/* Mobile User Info */}
            <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-900">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 capitalize truncate">{user?.role || 'team_member'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedSidebar;