import React, { useState } from 'react';
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
  Shield,
  PieChart,
  ChevronDown,
  ChevronRight,
  Contact,
  Star,
  Tag,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { getUserRole, canAccessAdminFeatures, canAccessSuperAdminFeatures, isApprovedCustomer } from '../utils/auth';

const Sidebar = ({ user, isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const userRole = getUserRole();
    const menuItems = [];

    // Dashboard - available to all authenticated users
    menuItems.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    });

    // Admin-only items
    if (canAccessAdminFeatures()) {
      menuItems.push({
        id: 'reports-supports',
        label: 'Reports & Supports',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          {
            id: 'reports-analytics',
            label: 'Reports & Analytics',
            icon: BarChart3,
            path: '/dashboard/reports-analytics'
          },
          {
            id: 'support',
            label: 'Support',
            icon: HelpCircle,
            path: '/dashboard/support'
          },
          {
            id: 'feedback',
            label: 'Feedback',
            icon: MessageSquare,
            path: '/dashboard/feedback'
          }
        ]
      });
      menuItems.push({
        id: 'super-admin-tools',
        label: 'Super Admin Tools',
        icon: Shield,
        hasSubmenu: true,
        submenu: [
          {
            id: 'subscription-analytics',
            label: 'Subscription Analytics',
            icon: TrendingUp,
            path: '/dashboard/subscription-analytics'
          },
          {
            id: 'role-management',
            label: 'Role Management',
            icon: Users,
            path: '/dashboard/role-management'
          },
          {
            id: 'super-admin',
            label: 'Super Admin Dashboard',
            icon: UserCog,
            path: '/dashboard/super-admin'
          }
        ]
      });
      
      // Super Admin only - now handled in Super Admin Tools dropdown
    }

    // Team member and above (not customers)
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
            path: '/dashboard/leads'
          },
          {
            id: 'contacts',
            label: 'Contacts',
            icon: Contact,
            path: '/dashboard/contacts'
          },
          {
            id: 'lead-scoring',
            label: 'Lead Scoring',
            icon: Star,
            path: '/dashboard/lead-scoring'
          },
          {
            id: 'outreach',
            label: 'Outreach',
            icon: Target,
            path: '/dashboard/outreach'
          },
          {
            id: 'crm',
            label: 'CRM',
            icon: Building2,
            path: '/dashboard/crm'
          }
        ]
      });
      // Productive Tools dropdown
      menuItems.push({
        id: 'productive-tools',
        label: 'Productive Tools',
        icon: Target,
        hasSubmenu: true,
        submenu: [
          {
            id: 'tasks',
            label: 'Tasks',
            icon: CheckSquare,
            path: '/dashboard/tasks'
          },
          {
            id: 'ideas',
            label: 'Ideas',
            icon: Lightbulb,
            path: '/dashboard/ideas'
          },
          {
            id: 'notes',
            label: 'Notes',
            icon: FileText,
            path: '/dashboard/notes'
          },
          {
            id: 'meeting-scheduler',
            label: 'Meeting Scheduler',
            icon: Calendar,
            path: '/dashboard/meeting-scheduler'
          }
        ]
      });
      menuItems.push({
        id: 'marketing-tools',
        label: 'Marketing Tools',
        icon: PieChart,
        hasSubmenu: true,
        submenu: [
          {
            id: 'marketing-dashboard',
            label: 'Marketing Dashboard',
            icon: PieChart,
            path: '/dashboard/marketing-dashboard'
          },
          {
            id: 'social-media-analytics',
            label: 'Social Media Analytics',
            icon: BarChart3,
            path: '/dashboard/social-media-analytics'
          }
        ]
      });
      
      // Client Management dropdown
      menuItems.push({
        id: 'client-management',
        label: 'Client Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          {
            id: 'subscription-analytics',
            label: 'Subscription Analytics',
            icon: TrendingUp,
            path: '/dashboard/subscription-analytics'
          },
          {
            id: 'order-management',
            label: 'Order Management',
            icon: Package,
            path: '/dashboard/orders-management'
          },
          {
            id: 'plan-management',
            label: 'Plan Management',
            icon: FileText,
            path: '/dashboard/plans-management'
          },
          {
            id: 'marketing-discount-management',
            label: 'Marketing & Discount Management',
            icon: Tag,
            path: '/dashboard/marketing-discount-dashboard'
          }
        ]
      });
      
      // Project Management dropdown
      menuItems.push({
        id: 'project-management',
        label: 'Project Management',
        icon: Briefcase,
        hasSubmenu: true,
        submenu: [
          {
            id: 'proposals',
            label: 'Proposals',
            icon: FileText,
            path: '/dashboard/proposals'
          },
          {
            id: 'pipeline',
            label: 'Pipeline',
            icon: TrendingUp,
            path: '/dashboard/pipeline'
          },
          {
            id: 'sales-invoices',
            label: 'Sales & Invoices',
            icon: Receipt,
            path: '/dashboard/sales-invoices'
          },
          {
            id: 'team-management',
            label: 'Team Management',
            icon: UserCog,
            path: '/dashboard/team-management'
          }
        ]
      });
    }

    // Customer-specific items (only if approved)
    if (userRole === 'Customer' && isApprovedCustomer()) {
      menuItems.push({
        id: 'customer-orders',
        label: 'My Orders',
        icon: ShoppingCart,
        path: '/dashboard/orders'
      });
      menuItems.push({
        id: 'ideas',
        label: 'Ideas',
        icon: Lightbulb,
        path: '/dashboard/ideas'
      });
      menuItems.push({
        id: 'notes',
        label: 'Notes',
        icon: FileText,
        path: '/dashboard/notes'
      });
      menuItems.push({
        id: 'subscription-plans',
        label: 'Subscription Plans',
        icon: CreditCard,
        path: '/dashboard/subscription'
      });
    }

    // Profile - available to all authenticated users
    menuItems.push({
      id: 'profile',
      label: 'My Profile',
      icon: UserCircle,
      path: '/dashboard/profile'
    });

    // Settings - available to all authenticated users
    menuItems.push({
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings'
    });

    return menuItems;
  };

  const menuItems = getMenuItems();

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r border-slate-700 z-30">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-4 bg-slate-900 border-b border-slate-700">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BD</span>
              </div>
              <span className="ml-2 text-white font-semibold text-lg">Largify BD</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              const isExpanded = expandedMenus[item.id];
              
              if (item.hasSubmenu) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
                      {item.label}
                      {isExpanded ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = isActiveRoute(subItem.path);
                          
                          return (
                            <Link
                              key={subItem.id}
                              to={subItem.path}
                              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isSubActive
                                  ? 'bg-violet-600 text-white'
                                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              <SubIcon
                                className={`mr-3 h-4 w-4 ${
                                  isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                }`}
                              />
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 p-4 border-t border-slate-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'team_member'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700">
          <div className="flex flex-col flex-1 min-h-0">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 bg-slate-900 border-b border-slate-700">
              <Link to="/dashboard" className="flex items-center" onClick={onClose}>
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BD</span>
                </div>
                <span className="ml-2 text-white font-semibold text-lg">Largify BD</span>
              </Link>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-md transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                const isExpanded = expandedMenus[item.id];
                
                if (item.hasSubmenu) {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
                        {item.label}
                        {isExpanded ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = isActiveRoute(subItem.path);
                            
                            return (
                              <Link
                                key={subItem.id}
                                to={subItem.path}
                                onClick={onClose}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                  isSubActive
                                    ? 'bg-violet-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                              >
                                <SubIcon
                                  className={`mr-3 h-4 w-4 ${
                                    isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                  }`}
                                />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Info */}
            <div className="flex-shrink-0 p-4 border-t border-slate-700">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role || 'team_member'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;