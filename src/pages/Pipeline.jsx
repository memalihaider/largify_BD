import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, DollarSign, Calendar, User, MoreVertical, X } from 'lucide-react';
import { getCurrentUser, hasLegacyPermission } from '../utils/auth';

// Sortable Deal Card Component
const SortableDealCard = ({ deal, canEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id, disabled: !canEdit });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getAvatarForMember = (memberName) => {
    return memberName.split(' ').map(n => n[0]).join('');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-slate-800 border border-slate-700 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''
      } ${!canEdit ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
         <h4 className="font-medium text-white text-sm leading-tight">
           {deal.name}
         </h4>
         <button className="text-slate-400 hover:text-slate-300">
           <MoreVertical className="w-4 h-4" />
         </button>
       </div>
       
       <p className="text-sm text-slate-300 mb-3">{deal.customer}</p>
      
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="font-semibold text-green-600">
          {formatCurrency(deal.value)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
            {getAvatarForMember(deal.assignedTo)}
          </div>
          <span className="text-xs text-slate-300">{deal.assignedTo}</span>
         </div>
         
         <div className="flex items-center gap-1 text-xs text-slate-400">
           <Calendar className="w-3 h-3" />
           {formatDate(deal.date)}
         </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const [user, setUser] = useState(null);
  const [deals, setDeals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    customer: '',
    value: '',
    stage: 'Lead',
    assignedTo: '',
    notes: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const stages = ['Lead', 'Prospect', 'Negotiation', 'Won', 'Lost'];
  
  // Dummy data for deals
  const dummyDeals = [
    {
      id: '1',
      name: 'Enterprise Software License',
      customer: 'TechCorp Inc.',
      value: 50000,
      stage: 'Lead',
      assignedTo: 'John Smith',
      date: '2024-01-15T10:30:00Z',
      notes: 'Initial contact made, interested in enterprise package'
    },
    {
      id: '2',
      name: 'Marketing Automation Setup',
      customer: 'StartupXYZ',
      value: 15000,
      stage: 'Prospect',
      assignedTo: 'Sarah Johnson',
      date: '2024-01-14T14:20:00Z',
      notes: 'Demo scheduled for next week'
    },
    {
      id: '3',
      name: 'Cloud Migration Project',
      customer: 'BigCorp Ltd.',
      value: 75000,
      stage: 'Negotiation',
      assignedTo: 'Mike Davis',
      date: '2024-01-13T09:15:00Z',
      notes: 'Contract terms under review'
    },
    {
      id: '4',
      name: 'CRM Implementation',
      customer: 'MediumBiz Co.',
      value: 25000,
      stage: 'Won',
      assignedTo: 'Emily Chen',
      date: '2024-01-12T16:45:00Z',
      notes: 'Contract signed, project starting next month'
    },
    {
      id: '5',
      name: 'Website Redesign',
      customer: 'LocalShop',
      value: 8000,
      stage: 'Lost',
      assignedTo: 'Tom Wilson',
      date: '2024-01-11T11:30:00Z',
      notes: 'Client chose competitor due to budget constraints'
    }
  ];

  const teamMembers = [
    { id: '1', name: 'John Smith', avatar: 'JS' },
    { id: '2', name: 'Sarah Johnson', avatar: 'SJ' },
    { id: '3', name: 'Mike Davis', avatar: 'MD' },
    { id: '4', name: 'Emily Chen', avatar: 'EC' },
    { id: '5', name: 'Tom Wilson', avatar: 'TW' }
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setDeals(dummyDeals);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the deal being dragged
    const activeDeal = deals.find(deal => deal.id === activeId);
    if (!activeDeal) return;

    // Check if we're dropping on a stage column or another deal
    let newStage;
    if (stages.includes(overId)) {
      // Dropped on a stage column
      newStage = overId;
    } else {
      // Dropped on another deal, find its stage
      const overDeal = deals.find(deal => deal.id === overId);
      newStage = overDeal ? overDeal.stage : activeDeal.stage;
    }

    // Update the deal's stage
    if (activeDeal.stage !== newStage) {
      const updatedDeals = deals.map(deal => {
        if (deal.id === activeId) {
          return { ...deal, stage: newStage };
        }
        return deal;
      });
      setDeals(updatedDeals);
    }
  };

  const handleAddDeal = (e) => {
    e.preventDefault();
    
    const deal = {
      id: Date.now().toString(),
      name: newDeal.name,
      customer: newDeal.customer,
      value: parseFloat(newDeal.value),
      stage: newDeal.stage,
      assignedTo: newDeal.assignedTo,
      date: new Date().toISOString(),
      notes: newDeal.notes
    };

    setDeals([...deals, deal]);
    setNewDeal({
      name: '',
      customer: '',
      value: '',
      stage: 'Lead',
      assignedTo: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const getDealsForStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const canCreateDeal = () => {
    if (!user) return false;
    return hasLegacyPermission(user.role, 'create_deals');
  };

  const canEditDeal = (deal) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin') return true;
    return deal.assignedTo === user.name;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  // Redirect customers
  if (user.role === 'customer') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300">You don't have permission to access the sales pipeline.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Sales Pipeline</h1>
        {canCreateDeal() && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Deal
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {stages.map((stage) => {
            const stageDeals = getDealsForStage(stage);
            return (
              <div key={stage} className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-semibold text-white flex items-center justify-between">
                    {stage}
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                      {stageDeals.length}
                    </span>
                  </h3>
                </div>
                
                <SortableContext
                  items={stageDeals.map(deal => deal.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className="p-4 min-h-[200px]"
                    style={{ minHeight: '200px' }}
                  >
                    {stageDeals.map((deal) => (
                      <SortableDealCard
                        key={deal.id}
                        deal={deal}
                        canEdit={canEditDeal(deal)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Add New Deal</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddDeal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Deal Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter deal name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Customer *
                </label>
                <input
                  type="text"
                  required
                  value={newDeal.customer}
                  onChange={(e) => setNewDeal({ ...newDeal, customer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Stage
                </label>
                <select
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Assigned To
                </label>
                <select
                  value={newDeal.assignedTo}
                  onChange={(e) => setNewDeal({ ...newDeal, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this deal..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;