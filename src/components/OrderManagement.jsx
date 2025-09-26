import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Clock, 
  AlertCircle, 
  Download,
  Mail,
  User,
  CreditCard,
  Package
} from 'lucide-react';
import Card from './Card';

const OrderManagement = ({ orders = [], onStatusUpdate, onViewDetails }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'approved': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'active': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'expired': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <Check className="h-4 w-4" />;
      case 'active': return <Package className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders
    .filter(order => filter === 'all' || order.status === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      return a[sortBy]?.localeCompare(b[sortBy]) || 0;
    });

  const handleApprove = (orderId) => {
    onStatusUpdate(orderId, 'approved');
  };

  const handleReject = (orderId) => {
    onStatusUpdate(orderId, 'rejected');
  };

  const handleActivate = (orderId) => {
    onStatusUpdate(orderId, 'active');
  };

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="user">Sort by User</option>
              <option value="plan">Sort by Plan</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{order.id}</h3>
                    <p className="text-slate-400 text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">{order.user}</p>
                    <p className="text-slate-400 text-sm">{order.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">{order.plan}</p>
                    <p className="text-slate-400 text-sm">{order.amount}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">{order.paymentMethod}</p>
                    <p className="text-slate-400 text-sm">
                      {order.receipt ? 'Receipt uploaded' : 'Receipt pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <button
                  onClick={() => onViewDetails(order)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  
                  {order.status === 'approved' && (
                    <button
                      onClick={() => handleActivate(order.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Package className="h-4 w-4" />
                      <span>Activate</span>
                    </button>
                  )}
                  
                  {(order.status === 'approved' || order.status === 'active') && (
                    <button className="flex items-center space-x-2 px-3 py-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <Mail className="h-4 w-4" />
                      <span>Notify</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No orders found matching your criteria.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;