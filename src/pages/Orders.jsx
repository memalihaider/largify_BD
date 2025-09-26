import React, { useState, useEffect, useCallback } from 'react';
import { getUserRole, canAccessAdminFeatures } from '../utils/auth';
import { handleError } from '../utils/errorHandler';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Package, 
  Truck, 
  CheckCircle,
  Filter,
  Download,
  Eye,
  Edit,
  Calendar,
  Upload,
  X,
  Check,
  XCircle,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Bell,
  Mail,
  Trash2,
  DollarSign,
  User,
  FileText,
  Clock,
  TrendingUp,
  Users,
  CreditCard,
  ExternalLink,
  FileX,
  Phone,
  Building
} from 'lucide-react';
import Card from '../components/Card';
import OrderManagement from '../components/OrderManagement';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'management'
  
  const userRole = getUserRole();
  const isCustomer = userRole === 'Customer';
  const isSuperAdmin = userRole === 'Super Admin';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/checkout/orders');
      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to match frontend structure
        const transformedOrders = result.data.orders.map(order => ({
          id: order.id,
          user: order.user_name || 'Unknown User',
          email: order.user_email || 'No email',
          plan: order.plan_name,
          amount: `${order.plan_price} ${order.plan_currency}`,
          status: order.status,
          receipt: order.receipt_url,
          date: order.created_at,
          renewalDate: calculateRenewalDate(order.created_at, order.plan_period),
          paymentMethod: order.payment_method === 'bank_transfer' ? 'Bank Transfer' : order.payment_method,
          features: getFeaturesByPlan(order.plan_name),
          notes: order.notes,
          personal_info: typeof order.personal_info === 'string' ? JSON.parse(order.personal_info) : order.personal_info
        }));
        
        setOrders(transformedOrders);
      } else {
        setError(result.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to calculate renewal date
  const calculateRenewalDate = (createdAt, period) => {
    const date = new Date(createdAt);
    if (period === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (period === 'annual') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString();
  };

  // Helper function to get features by plan
  const getFeaturesByPlan = (planName) => {
    const defaultFeatures = ['Basic Support', 'Standard Analytics'];
    if (planName?.toLowerCase().includes('premium') || planName?.toLowerCase().includes('pro')) {
      return ['Advanced Analytics', 'Priority Support', 'Custom Integrations'];
    }
    return defaultFeatures;
  };

  // Fetch orders on component mount and set up polling for real-time updates
  useEffect(() => {
    fetchOrders();
    
    // Set up polling every 30 seconds for real-time updates
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Enhanced mock orders data with subscription structure (fallback for development)
  const mockOrders = [
    {
      id: 'SUB-001',
      user: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      plan: 'Monthly Plan',
      amount: '3,000 PKR',
      status: 'active',
      receipt: 'receipt_001.pdf',
      date: '2024-01-15',
      renewalDate: '2024-02-15',
      paymentMethod: 'Bank Transfer',
      features: ['Advanced Analytics', 'Priority Support', 'Custom Integrations']
    },
    {
      id: 'SUB-002',
      user: 'Bob Smith',
      email: 'bob.smith@example.com',
      plan: 'Annual Plan',
      amount: '25,000 PKR',
      status: 'pending',
      receipt: null,
      date: '2024-01-14',
      renewalDate: '2025-01-14',
      paymentMethod: 'Bank Transfer',
      features: ['Advanced Analytics', 'Priority Support', 'Custom Integrations']
    },
    {
      id: 'SUB-003',
      user: 'Carol Davis',
      email: 'carol.davis@example.com',
      plan: 'Custom Plan',
      amount: 'Contact for Pricing',
      status: 'approved',
      receipt: 'receipt_003.pdf',
      date: '2024-01-13',
      renewalDate: '2024-07-13',
      paymentMethod: 'Bank Transfer',
      features: ['Full Analytics Suite', '24/7 Support', 'White Label', 'API Access']
    },
    {
      id: 'SUB-004',
      user: 'David Wilson',
      email: 'david.wilson@example.com',
      plan: 'Monthly Plan',
      amount: '3,000 PKR',
      status: 'expired',
      receipt: 'receipt_004.pdf',
      date: '2023-12-15',
      renewalDate: '2024-01-15',
      paymentMethod: 'Bank Transfer',
      features: ['Advanced Analytics', 'Priority Support', 'Custom Integrations']
    },
    {
      id: 'SUB-005',
      user: 'Eva Brown',
      email: 'eva.brown@example.com',
      plan: 'Annual Plan',
      amount: '25,000 PKR',
      status: 'pending',
      receipt: null,
      date: '2024-01-11',
      renewalDate: '2025-01-11',
      paymentMethod: 'Bank Transfer',
      features: ['Advanced Analytics', 'Priority Support', 'Custom Integrations']
    }
  ];
  // Status color mapping for subscription statuses
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'approved': return 'text-blue-400 bg-blue-500/10';
      case 'active': return 'text-green-400 bg-green-500/10';
      case 'expired': return 'text-gray-400 bg-gray-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Package className="h-4 w-4" />;
      case 'approved': return <Check className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  // Sorting function
  const sortOrders = (orders) => {
    return [...orders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'date' || sortField === 'renewalDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Use real data if available, fallback to mock data for development
  // State for email loading
  const [emailLoading, setEmailLoading] = useState({});
  const [receiptImageError, setReceiptImageError] = useState({});

  // Handle email sending functionality
  const handleSendEmail = useCallback(async (emailType, order) => {
    try {
      setEmailLoading(prev => ({ ...prev, [order.id]: true }));
      
      const orderData = {
        id: order.id,
        user: order.user,
        plan: order.plan,
        amount: order.amount,
        status: order.status,
        date: order.date
      };

      const response = await fetch('http://localhost:5001/api/checkout/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: order.email,
          orderData,
          emailType
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Email sent successfully to ${order.email}`);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      handleError(error, 'Failed to send email');
    } finally {
      setEmailLoading(prev => ({ ...prev, [order.id]: false }));
    }
  }, []);

  // Handle receipt image display
  const getReceiptImageUrl = useCallback((receiptPath) => {
    if (!receiptPath) return null;
    
    // If it's already a full URL, return as is
    if (receiptPath.startsWith('http')) {
      return receiptPath;
    }
    
    // Convert backend path to accessible URL
    const filename = receiptPath.split('/').pop() || receiptPath.split('\\').pop();
    return `http://localhost:5001/uploads/receipts/${filename}`;
  }, []);

  const displayOrders = orders && orders.length > 0 ? orders : mockOrders;

  // Filter orders based on user role
  const getFilteredOrders = () => {
    let filteredOrders = displayOrders;
    
    // If customer, only show their orders (for demo, we'll show all)
    // In real app, filter by user ID
    
    // Apply search filter
    filteredOrders = filteredOrders.filter(order => {
      const matchesSearch = String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                           String(order.user).toLowerCase().includes(searchTerm.toLowerCase()) ||
                           String(order.plan).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    
    return sortOrders(filteredOrders);
  };

  const filteredOrders = getFilteredOrders();

  // Handle status update (Super Admin only)
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/checkout/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          approvedBy: userRole // In a real app, this would be the current user's ID
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state immediately for better UX
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // Refresh data from server to ensure consistency
        fetchOrders();
        
        // Show success message
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status:', result.message);
        alert(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to connect to server');
    }
  };

  // Handle file upload
  const handleFileUpload = (orderId, file) => {
    // Upload receipt functionality would be implemented here
    // For now, we'll simulate the upload by updating the order
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, receipt: file.name } : order
    ));
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    active: orders.filter(o => o.status === 'active').length,
    expired: orders.filter(o => o.status === 'expired').length
  };

  const totalRevenue = orders
    .filter(o => o.status === 'active' || o.status === 'approved')
    .reduce((sum, order) => {
      if (order.amount.includes('PKR')) {
        return sum + parseFloat(order.amount.replace(/[^\d]/g, ''));
      }
      return sum;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isCustomer ? 'My Subscriptions' : 'Orders & Subscriptions'}
            </h1>
            <p className="text-slate-400">
              {isCustomer ? 'View your subscription history and current plans' : 'Manage customer subscriptions and orders'}
            </p>
            {loading && (
              <div className="mt-2 flex items-center text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                Loading orders...
              </div>
            )}
            {error && (
              <div className="mt-2 bg-red-900/20 border border-red-500/30 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">Error loading orders</h3>
                    <div className="mt-1 text-sm text-red-400">{error}</div>
                    <div className="mt-2">
                      <button
                        onClick={fetchOrders}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium text-white transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isCustomer && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('management')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'management' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Management View
              </button>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <Plus className="h-4 w-4" />
              <span>New Subscription</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total {isCustomer ? 'Subscriptions' : 'Orders'}</p>
              <p className="text-2xl font-bold text-white">{orderStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">{orderStats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{orderStats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()} PKR</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </Card>
      {/* Orders Table or Management View */}
      {viewMode === 'table' ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  <button 
                    onClick={() => {
                      setSortField('id');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center space-x-1 hover:text-white"
                  >
                    <span>Order ID</span>
                  </button>
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  <button 
                    onClick={() => {
                      setSortField('user');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center space-x-1 hover:text-white"
                  >
                    <span>User</span>
                  </button>
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  <button 
                    onClick={() => {
                      setSortField('plan');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center space-x-1 hover:text-white"
                  >
                    <span>Plan</span>
                  </button>
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  <button 
                    onClick={() => {
                      setSortField('date');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center space-x-1 hover:text-white"
                  >
                    <span>Date</span>
                  </button>
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Receipt</th>
                <th className="text-right py-4 px-6 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-white">{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-white font-medium">{order.user}</div>
                      <div className="text-slate-400 text-sm">{order.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{order.plan}</div>
                    <div className="text-slate-400 text-sm">{order.amount}</div>
                  </td>
                  <td className="py-4 px-6">
                    <OrderStatusBadge status={order.status} size="small" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white text-sm">{new Date(order.date).toLocaleDateString()}</div>
                    {order.renewalDate && (
                      <div className="text-slate-400 text-xs">Renews: {new Date(order.renewalDate).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {order.receipt ? (
                      <span className="text-green-400 text-sm">✓ Uploaded</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id={`receipt-${order.id}`}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleFileUpload(order.id, e.target.files[0]);
                            }
                          }}
                        />
                        <label
                          htmlFor={`receipt-${order.id}`}
                          className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                        >
                          <Upload className="h-3 w-3" />
                          <span>Upload</span>
                        </label>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {isSuperAdmin && (
                        <div className="flex items-center space-x-1">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'approved')}
                                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'expired')}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {order.status === 'approved' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'active')}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              title="Activate"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {order.status === 'active' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'expired')}
                              className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
                              title="Deactivate"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No orders found matching your criteria.</p>
            </div>
          ) : null}
        </div>
      </Card>
      ) : (
        <OrderManagement 
          orders={filteredOrders}
          onStatusUpdate={handleStatusUpdate}
          onViewDetails={viewOrderDetails}
        />
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400">Order ID</label>
                      <p className="text-white font-mono">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Date</label>
                      <p className="text-white">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Status</label>
                      <OrderStatusBadge status={selectedOrder.status} />
                    </div>
                    {selectedOrder.renewalDate && (
                      <div>
                        <label className="text-sm text-slate-400">Renewal Date</label>
                        <p className="text-white">{new Date(selectedOrder.renewalDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400">Name</label>
                      <p className="text-white">{selectedOrder.user}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Email</label>
                      <p className="text-white">{selectedOrder.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Plan Details */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Subscription Details</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{selectedOrder.plan}</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        {selectedOrder.plan.includes('Monthly') ? 'Monthly subscription' : 
                         selectedOrder.plan.includes('Annual') ? 'Annual subscription' : 
                         'Custom subscription'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{selectedOrder.amount}</p>
                      <p className="text-slate-400 text-sm">
                        {selectedOrder.plan.includes('Monthly') ? 'per month' : 
                         selectedOrder.plan.includes('Annual') ? 'per year' : 
                         'custom pricing'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Receipt Status and Display */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Payment Receipt</h3>
                {selectedOrder.receipt ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-green-400 mb-3">
                      <Check className="h-5 w-5" />
                      <span>Receipt uploaded and verified</span>
                    </div>
                    
                    {/* Receipt Image Display */}
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">Receipt Image</h4>
                        <button
                          onClick={() => window.open(getReceiptImageUrl(selectedOrder.receipt), '_blank')}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Full Size</span>
                        </button>
                      </div>
                      
                      <div className="relative">
                        {!receiptImageError[selectedOrder.id] ? (
                          <img
                            src={getReceiptImageUrl(selectedOrder.receipt)}
                            alt="Payment Receipt"
                            className="w-full max-w-md mx-auto rounded-lg border border-slate-600/50 shadow-lg"
                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                            onError={() => {
                              setReceiptImageError(prev => ({ ...prev, [selectedOrder.id]: true }));
                            }}
                            onLoad={() => {
                              setReceiptImageError(prev => ({ ...prev, [selectedOrder.id]: false }));
                            }}
                          />
                        ) : (
                          <div className="w-full max-w-md mx-auto h-48 bg-slate-600/30 rounded-lg border border-slate-600/50 flex flex-col items-center justify-center">
                            <FileText className="h-12 w-12 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-sm">Receipt file: {selectedOrder.receipt}</p>
                            <button
                              onClick={() => window.open(getReceiptImageUrl(selectedOrder.receipt), '_blank')}
                              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Download Receipt
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>Receipt pending upload</span>
                  </div>
                )}
              </div>

              {/* Email Notifications Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Send Status Update</p>
                          <p className="text-slate-400 text-sm">Notify customer about order status changes</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendEmail('status_update', selectedOrder)}
                        disabled={emailLoading[selectedOrder.id] || !selectedOrder.email}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {emailLoading[selectedOrder.id] ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Email'
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Send Receipt Confirmation</p>
                          <p className="text-slate-400 text-sm">Send receipt acknowledgment to customer</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendEmail('receipt_confirmation', selectedOrder)}
                        disabled={emailLoading[selectedOrder.id] || !selectedOrder.email || !selectedOrder.receipt}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {emailLoading[selectedOrder.id] ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Receipt'
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Email Status Info */}
                  <div className="text-xs text-slate-400 space-y-1 mt-3">
                    <p className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Status Update: Notifies customer about order status changes</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Receipt Confirmation: Confirms receipt verification and subscription activation</span>
                    </p>
                    {!selectedOrder.email && (
                      <p className="text-red-400 flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3" />
                        <span>No email address available for this order</span>
                      </p>
                    )}
                    {!selectedOrder.receipt && (
                      <p className="text-yellow-400 flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3" />
                        <span>Receipt confirmation requires uploaded receipt</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions for Super Admin */}
              {isSuperAdmin && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Admin Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedOrder.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedOrder.id, 'approved');
                            setShowModal(false);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve Order</span>
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedOrder.id, 'expired');
                            setShowModal(false);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject Order</span>
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'approved' && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, 'active');
                          setShowModal(false);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span>Activate Subscription</span>
                      </button>
                    )}
                    {selectedOrder.status === 'active' && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, 'expired');
                          setShowModal(false);
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Deactivate Subscription</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;