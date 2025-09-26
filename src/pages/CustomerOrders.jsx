import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, Eye, Download } from 'lucide-react';
import Card from '../components/Card';

const CustomerOrders = () => {
  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: '$1,299.99',
      items: 3,
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-18'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipped',
      total: '$899.50',
      items: 2,
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-25'
    },
    {
      id: 'ORD-003',
      date: '2024-01-22',
      status: 'processing',
      total: '$450.00',
      items: 1,
      trackingNumber: null,
      estimatedDelivery: '2024-01-28'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-semibold text-white">{order.id}</h3>
                  <p className="text-sm text-slate-400">Ordered on {order.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-slate-400">Total Amount</p>
                <p className="font-semibold text-white">{order.total}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Items</p>
                <p className="font-semibold text-white">{order.items} item{order.items > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Tracking Number</p>
                <p className="font-semibold text-white">
                  {order.trackingNumber || 'Not available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Estimated Delivery</p>
                <p className="font-semibold text-white">{order.estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              {order.status === 'delivered' && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download Invoice</span>
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;