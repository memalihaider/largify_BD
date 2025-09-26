import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  MoreVertical,
  Calendar,
  Building2
} from 'lucide-react';
import { contactStatuses } from '../data/mockContacts';

const ContactKanban = ({ 
  contacts, 
  onStatusChange, 
  onEdit, 
  onDelete, 
  canManage 
}) => {
  const [draggedContact, setDraggedContact] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const getContactsByStatus = (status) => {
    return contacts.filter(contact => contact.status === status);
  };

  const handleDragStart = (e, contact) => {
    setDraggedContact(contact);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedContact && draggedContact.status !== newStatus) {
      onStatusChange(draggedContact.id, newStatus);
    }
    setDraggedContact(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleActionClick = (contactId) => {
    setActionMenuOpen(actionMenuOpen === contactId ? null : contactId);
  };

  const ContactCard = ({ contact }) => (
    <div
      draggable={canManage}
      onDragStart={(e) => handleDragStart(e, contact)}
      className={`bg-slate-700 rounded-lg p-4 mb-3 border border-slate-600 hover:border-slate-500 transition-all duration-200 cursor-pointer ${
        draggedContact?.id === contact.id ? 'opacity-50' : ''
      } ${canManage ? 'hover:shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{contact.name}</h3>
          <p className="text-xs text-slate-400 truncate flex items-center mt-1">
            <Building2 className="h-3 w-3 mr-1" />
            {contact.company}
          </p>
        </div>
        <div className="relative ml-2">
          <button
            onClick={() => handleActionClick(contact.id)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-600 transition-colors duration-200"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {actionMenuOpen === contact.id && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setActionMenuOpen(null)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-slate-600 border border-slate-500 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      window.open(`mailto:${contact.email}`, '_blank');
                      setActionMenuOpen(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors duration-200 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </button>
                  <button
                    onClick={() => {
                      window.open(`tel:${contact.phone}`, '_blank');
                      setActionMenuOpen(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors duration-200 flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => {
                          onEdit(contact);
                          setActionMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors duration-200 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(contact.id);
                          setActionMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-500 transition-colors duration-200 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-xs text-slate-400">
          <Mail className="h-3 w-3 mr-1" />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <Phone className="h-3 w-3 mr-1" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Last contacted: {formatDate(contact.lastContacted)}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Source: {contact.source}</span>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${contact.email}`, '_blank');
              }}
              className="p-1 text-slate-400 hover:text-violet-400 rounded hover:bg-slate-600 transition-colors duration-200"
              title="Send Email"
            >
              <Mail className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${contact.phone}`, '_blank');
              }}
              className="p-1 text-slate-400 hover:text-green-400 rounded hover:bg-slate-600 transition-colors duration-200"
              title="Call"
            >
              <Phone className="h-3 w-3" />
            </button>
            {canManage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(contact);
                }}
                className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-600 transition-colors duration-200"
                title="Edit"
              >
                <Edit className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {contact.notes && (
        <div className="mt-2 pt-2 border-t border-slate-600">
          <p className="text-xs text-slate-400 line-clamp-2">{contact.notes}</p>
        </div>
      )}
    </div>
  );

  const KanbanColumn = ({ status, title, color }) => {
    const columnContacts = getContactsByStatus(status);
    
    return (
      <div className="flex-1 min-w-0">
        <div className="bg-slate-800 rounded-lg">
          {/* Column Header */}
          <div className={`px-4 py-3 border-b border-slate-700 ${color}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">{title}</h3>
              <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                {columnContacts.length}
              </span>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            className={`p-4 min-h-[500px] ${
              draggedContact && draggedContact.status !== status
                ? 'bg-slate-750 border-2 border-dashed border-violet-500'
                : ''
            }`}
          >
            {columnContacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-500 text-sm">No {title.toLowerCase()} contacts</div>
                {canManage && (
                  <div className="text-slate-600 text-xs mt-1">
                    Drag contacts here to change status
                  </div>
                )}
              </div>
            ) : (
              columnContacts.map(contact => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Kanban Instructions */}
      {canManage && (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            <p className="text-sm text-slate-300">
              Drag and drop contacts between columns to update their status
            </p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn 
          status="Hot" 
          title="Hot Leads" 
          color="bg-gradient-to-r from-red-600 to-red-500"
        />
        <KanbanColumn 
          status="Warm" 
          title="Warm Leads" 
          color="bg-gradient-to-r from-yellow-600 to-yellow-500"
        />
        <KanbanColumn 
          status="Cold" 
          title="Cold Leads" 
          color="bg-gradient-to-r from-blue-600 to-blue-500"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactStatuses.map(status => {
          const count = getContactsByStatus(status.value).length;
          const percentage = contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0;
          
          return (
            <div key={status.value} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">{status.label} Contacts</p>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${status.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactKanban;