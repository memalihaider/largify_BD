import React from 'react';
import { 
  Users, 
  UserCheck, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Calendar,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Card from './Card';
import { getUserRole, canAccessAdminFeatures, isApprovedCustomer } from '../utils/auth';

const DashboardHome = ({ user }) => {
  const userRole = getUserRole();

  // Role-specific stats
  const getStatsForRole = () => {
    if (canAccessAdminFeatures()) {
      // Admin/Super Admin stats
      return [
        {
          title: 'Total Users',
          value: '2,543',
          change: '+12%',
          changeType: 'positive',
          icon: Users,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Pending Approvals',
          value: '23',
          change: '+5',
          changeType: 'neutral',
          icon: Clock,
          color: 'from-orange-500 to-orange-600'
        },
        {
          title: 'Active Leads',
          value: '1,234',
          change: '+8%',
          changeType: 'positive',
          icon: UserCheck,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Monthly Revenue',
          value: '$45,678',
          change: '+15%',
          changeType: 'positive',
          icon: DollarSign,
          color: 'from-yellow-500 to-yellow-600'
        }
      ];
    } else if (userRole === 'Team Member') {
      // Team Member stats
      return [
        {
          title: 'My Leads',
          value: '87',
          change: '+3',
          changeType: 'positive',
          icon: UserCheck,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Tasks Completed',
          value: '156',
          change: '+12',
          changeType: 'positive',
          icon: CheckCircle,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Pending Tasks',
          value: '8',
          change: '-2',
          changeType: 'positive',
          icon: Clock,
          color: 'from-orange-500 to-orange-600'
        },
        {
          title: 'This Month',
          value: '94%',
          change: '+5%',
          changeType: 'positive',
          icon: TrendingUp,
          color: 'from-purple-500 to-purple-600'
        }
      ];
    } else if (userRole === 'Customer' && isApprovedCustomer()) {
      // Customer stats
      return [
        {
          title: 'Active Orders',
          value: '3',
          change: '+1',
          changeType: 'positive',
          icon: ShoppingCart,
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Total Spent',
          value: '$2,450',
          change: '+$340',
          changeType: 'neutral',
          icon: DollarSign,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Subscription',
          value: 'Premium',
          change: 'Active',
          changeType: 'positive',
          icon: CheckCircle,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Support Tickets',
          value: '2',
          change: 'Open',
          changeType: 'neutral',
          icon: Bell,
          color: 'from-orange-500 to-orange-600'
        }
      ];
    } else {
      // Default/fallback stats
      return [
        {
          title: 'Account Status',
          value: 'Pending',
          change: 'Approval Required',
          changeType: 'neutral',
          icon: AlertTriangle,
          color: 'from-orange-500 to-orange-600'
        }
      ];
    }
  };

  const stats = getStatsForRole();

  // Role-specific activities
  const getActivitiesForRole = () => {
    if (canAccessAdminFeatures()) {
      return [
        { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
        { id: 2, action: 'Customer approved', user: 'Jane Smith', time: '5 minutes ago', type: 'approval' },
        { id: 3, action: 'Lead converted', user: 'Mike Johnson', time: '10 minutes ago', type: 'lead' },
        { id: 4, action: 'Payment received', user: 'Sarah Wilson', time: '15 minutes ago', type: 'payment' },
        { id: 5, action: 'New support ticket', user: 'Tom Brown', time: '20 minutes ago', type: 'support' }
      ];
    } else if (userRole === 'Team Member') {
      return [
        { id: 1, action: 'Lead assigned to you', user: 'System', time: '1 hour ago', type: 'lead' },
        { id: 2, action: 'Task completed', user: 'You', time: '2 hours ago', type: 'task' },
        { id: 3, action: 'Meeting scheduled', user: 'Manager', time: '3 hours ago', type: 'meeting' },
        { id: 4, action: 'Lead updated', user: 'You', time: '4 hours ago', type: 'lead' }
      ];
    } else if (userRole === 'Customer' && isApprovedCustomer()) {
      return [
        { id: 1, action: 'Order shipped', user: 'System', time: '1 day ago', type: 'order' },
        { id: 2, action: 'Payment processed', user: 'System', time: '2 days ago', type: 'payment' },
        { id: 3, action: 'Support ticket resolved', user: 'Support Team', time: '3 days ago', type: 'support' },
        { id: 4, action: 'Subscription renewed', user: 'System', time: '1 week ago', type: 'subscription' }
      ];
    } else {
      return [
        { id: 1, action: 'Account created', user: 'System', time: 'Today', type: 'user' },
        { id: 2, action: 'Awaiting approval', user: 'System', time: 'Pending', type: 'approval' }
      ];
    }
  };

  // Role-specific tasks
  const getTasksForRole = () => {
    if (canAccessAdminFeatures()) {
      return [
        { id: 1, task: 'Review pending customer approvals', priority: 'high', dueDate: 'Today' },
        { id: 2, task: 'Monthly analytics review', priority: 'medium', dueDate: 'Tomorrow' },
        { id: 3, task: 'Team performance evaluation', priority: 'medium', dueDate: 'This week' },
        { id: 4, task: 'System maintenance planning', priority: 'low', dueDate: 'Next week' }
      ];
    } else if (userRole === 'Team Member') {
      return [
        { id: 1, task: 'Follow up with lead #1234', priority: 'high', dueDate: 'Today' },
        { id: 2, task: 'Complete project proposal', priority: 'high', dueDate: 'Tomorrow' },
        { id: 3, task: 'Team meeting preparation', priority: 'medium', dueDate: 'This week' },
        { id: 4, task: 'Update client documentation', priority: 'low', dueDate: 'Next week' }
      ];
    } else if (userRole === 'Customer' && isApprovedCustomer()) {
      return [
        { id: 1, task: 'Review order #5678', priority: 'medium', dueDate: 'Today' },
        { id: 2, task: 'Update billing information', priority: 'low', dueDate: 'This week' },
        { id: 3, task: 'Provide project feedback', priority: 'medium', dueDate: 'Next week' }
      ];
    } else {
      return [
        { id: 1, task: 'Complete profile setup', priority: 'high', dueDate: 'Today' },
        { id: 2, task: 'Wait for account approval', priority: 'medium', dueDate: 'Pending' }
      ];
    }
  };

  const recentActivities = getActivitiesForRole();
  const upcomingTasks = getTasksForRole();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-400" />;
      case 'order': return <ShoppingCart className="h-4 w-4 text-green-400" />;
      case 'lead': return <UserCheck className="h-4 w-4 text-purple-400" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-yellow-400" />;
      case 'support': return <Bell className="h-4 w-4 text-red-400" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'task': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-400" />;
      case 'subscription': return <Activity className="h-4 w-4 text-cyan-400" />;
      default: return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    if (canAccessAdminFeatures()) {
      return "Here's your administrative overview for today.";
    } else if (userRole === 'Team Member') {
      return "Here's your task overview and recent activities.";
    } else if (userRole === 'Customer' && isApprovedCustomer()) {
      return "Welcome to your customer dashboard.";
    } else {
      return "Your account is pending approval. You'll have full access once approved.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username || 'User'}!
        </h1>
        <p className="text-violet-100">
          {getWelcomeMessage()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">{stat.change}</span>
                    <span className="text-sm text-slate-400 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-200">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Tasks</h3>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">
                    {task.task}
                  </p>
                  <p className="text-xs text-slate-400">
                    Due: {task.dueDate}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-center">
            <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <span className="text-sm text-white">Add User</span>
          </button>
          <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-center">
            <UserCheck className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <span className="text-sm text-white">New Lead</span>
          </button>
          <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-center">
            <ShoppingCart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <span className="text-sm text-white">Create Order</span>
          </button>
          <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-center">
            <Activity className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <span className="text-sm text-white">View Reports</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;