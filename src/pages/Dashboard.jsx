import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserProfile, logoutUser, getUserRole, isApprovedCustomer, canAccessAdminFeatures } from '../utils/auth';
import { handleError } from '../utils/errorHandler';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardHome from '../components/DashboardHome';
import ApplicationInProcessModal from '../components/ApplicationInProcessModal';
import ChatWidget from '../components/ChatWidget';

import Leads from './Leads';
import Contacts from './Contacts';
import Tasks from './Tasks';
import Orders from './Orders';
import Plans from './Plans';
import Ideas from './Ideas';
import Notes from './Notes';
import CRM from './CRM';
import Pipeline from './Pipeline';
import SalesInvoices from './SalesInvoices';
import CustomerOrders from './CustomerOrders';
import SubscriptionPlans from './SubscriptionPlans';
import PendingApproval from './PendingApproval';
import ReportsAnalytics from './ReportsAnalytics';
import TeamManagement from './TeamManagement';
import UserProfile from './UserProfile';
import Settings from './Settings';
import Support from './Support';
import Feedback from './Feedback';
import SubscriptionAnalytics from './SubscriptionAnalytics';
import MeetingScheduler from '../components/MeetingScheduler';
import MarketingDashboard from './MarketingDashboard';
import MarketingDiscountDashboard from './MarketingDiscountDashboard';
import SocialMediaAnalytics from './SocialMediaAnalytics';
import Proposals from './Proposals';
import Outreach from './Outreach';
import LeadScoring from './LeadScoring';
import { AdminDashboard, SuperAdminDashboard } from '../components/RoleManagement';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const location = useLocation();
  
  const userRole = getUserRole();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserProfile();
        setUser(userData);
        setError(null); // Clear any previous errors
        
        // Check if customer is approved
        const userRole = getUserRole();
        if (userRole === 'Customer' && !isApprovedCustomer()) {
          setShowApplicationModal(true);
          return;
        }
      } catch (error) {
        const errorMessage = handleError(error, 'Dashboard Authentication', 'Failed to load dashboard. Please try refreshing the page.');
        setError(errorMessage);
        // If token is invalid, logout
        logoutUser();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Navigation will be handled by the redirect below
    } catch (error) {
      handleError(error, 'Dashboard Logout', 'Logout failed. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  // Show error state if dashboard failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Dashboard Unavailable</div>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'dashboard':
      case '':
        return 'Dashboard';
      case 'leads':
          return 'Leads';
      case 'lead-scoring':
        return 'Lead Scoring';
      case 'orders':
        return 'Orders';
      case 'plans':
        return 'Plans';
      case 'analytics':
        return 'Analytics';
      case 'tasks':
        return 'Tasks';
      case 'meeting-scheduler':
        return 'Meeting Scheduler';
      case 'marketing-dashboard':
        return 'Marketing Dashboard';
      case 'marketing-discount-dashboard':
        return 'Marketing & Discount Management';
      case 'proposals':
        return 'Proposals';
      case 'sales-invoices':
        return 'Sales & Invoices';
      case 'team-management':
        return 'Team Management';
      case 'role-management':
        return 'Role Management';
      case 'super-admin':
        return 'Super Admin Dashboard';
      case 'profile':
        return 'My Profile';
      case 'support':
        return 'Support & Tickets';
      case 'subscription-analytics':
        return 'Subscription Analytics';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path.includes('/leads')) return 'leads';
    if (path.includes('/contacts')) return 'contacts';
    if (path.includes('/crm')) return 'crm';
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/marketing')) return 'marketing';
    if (path.includes('/proposals')) return 'proposals';
    if (path.includes('/pipeline')) return 'pipeline';
    if (path.includes('/sales')) return 'sales';
    if (path.includes('/support')) return 'support';
    if (path.includes('/team')) return 'team';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/ideas')) return 'ideas';
    if (path.includes('/notes')) return 'notes';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/feedback')) return 'feedback';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Top Navigation */}
        <DashboardNavbar
          user={user}
          onMenuClick={toggleSidebar}
          onLogout={handleLogout}
          pageTitle={getCurrentPageTitle()}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
          <Routes>
            {/* Admin-only routes */}
            {canAccessAdminFeatures() && (
              <>
                <Route path="/" element={<DashboardHome user={user} />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/lead-scoring" element={<LeadScoring />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/meeting-scheduler" element={<MeetingScheduler />} />
                <Route path="/marketing-dashboard" element={<MarketingDashboard />} />
                <Route path="/social-media-analytics" element={<SocialMediaAnalytics />} />
                <Route path="/marketing-discount-dashboard" element={<MarketingDiscountDashboard />} />
                <Route path="/proposals" element={<Proposals />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/outreach" element={<Outreach />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/sales-invoices" element={<SalesInvoices />} />
                <Route path="/reports-analytics" element={<ReportsAnalytics />} />
                <Route path="/subscription-analytics" element={<SubscriptionAnalytics />} />
                <Route path="/team-management" element={<TeamManagement />} />
                <Route path="/role-management" element={<AdminDashboard />} />
                <Route path="/super-admin" element={<SuperAdminDashboard />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/profile" element={<UserProfile />} />
                 <Route path="/settings" element={<Settings />} />
                 <Route path="/support" element={<Support />} />
                 <Route path="/feedback" element={<Feedback />} />
              </>
            )}
            
            {/* Team member and above routes */}
            {userRole !== 'Customer' && (
              <>
                <Route path="/" element={<DashboardHome user={user} />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/lead-scoring" element={<LeadScoring />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/meeting-scheduler" element={<MeetingScheduler />} />
                <Route path="/marketing-dashboard" element={<MarketingDashboard />} />
                <Route path="/social-media-analytics" element={<SocialMediaAnalytics />} />
                <Route path="/marketing-discount-dashboard" element={<MarketingDiscountDashboard />} />
                <Route path="/proposals" element={<Proposals />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/outreach" element={<Outreach />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/sales-invoices" element={<SalesInvoices />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/orders-management" element={<Orders />} />
                <Route path="/plans-management" element={<Plans />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/feedback" element={<Feedback />} />
              </>
            )}
            
            {/* Approved customer routes */}
            {userRole === 'Customer' && isApprovedCustomer() && (
              <>
                <Route path="/" element={<DashboardHome user={user} />} />
                <Route path="/orders" element={<CustomerOrders />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/subscription" element={<SubscriptionPlans />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
              </>
            )}
            
            {/* Pending customer approval */}
            {userRole === 'Customer' && !isApprovedCustomer() && (
              <Route path="*" element={<PendingApproval />} />
            )}
          </Routes>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* AI Chatbot Widget */}
      <ChatWidget currentPage={getCurrentPage()} />

      {/* Application In Process Modal */}
      <ApplicationInProcessModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        userEmail={user?.data?.user?.email || user?.email}
      />
    </div>
  );
};

export default Dashboard;