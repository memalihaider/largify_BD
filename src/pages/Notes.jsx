import React, { useState, useEffect } from 'react';
import { getUserRole, canAccessAdminFeatures } from '../utils/auth';
import { Eye, Edit, Trash2, Plus, X, Save } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('user-1'); // Mock current user ID

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, note: null });
  const [editModal, setEditModal] = useState({ isOpen: false, note: null });

  // Dummy data
  const dummyNotes = [
    {
      id: 'note-1',
      title: 'Project Planning Meeting Notes',
      content: 'Discussed the upcoming project milestones and deliverables. Key points:\n\n1. Phase 1 completion by end of month\n2. Resource allocation for Q2\n3. Client feedback integration\n4. Testing schedule review\n\nAction items assigned to team members.',
      date: '2024-01-15T10:30:00Z',
      authorId: 'user-1'
    },
    {
      id: 'note-2',
      title: 'Customer Feedback Summary',
      content: 'Compiled feedback from recent customer surveys:\n\n- 85% satisfaction rate\n- Main requests: mobile app improvements\n- Feature requests: dark mode, offline sync\n- Performance issues on older devices\n\nNext steps: prioritize mobile optimization.',
      date: '2024-01-14T14:20:00Z',
      authorId: 'user-2'
    },
    {
      id: 'note-3',
      title: 'Technical Architecture Review',
      content: 'Review of current system architecture and proposed improvements:\n\n- Database optimization opportunities\n- API performance enhancements\n- Security audit recommendations\n- Scalability considerations for growth\n\nImplementation timeline: 6-8 weeks.',
      date: '2024-01-13T09:15:00Z',
      authorId: 'user-1'
    },
    {
      id: 'note-4',
      title: 'Marketing Campaign Ideas',
      content: 'Brainstorming session for Q2 marketing campaigns:\n\n- Social media strategy refresh\n- Influencer partnerships\n- Content marketing calendar\n- Email automation sequences\n\nBudget allocation and timeline to be finalized.',
      date: '2024-01-12T16:45:00Z',
      authorId: 'user-3'
    },
    {
      id: 'note-5',
      title: 'Team Training Schedule',
      content: 'Upcoming training sessions for team development:\n\n- React advanced patterns workshop\n- Database optimization course\n- Security best practices seminar\n- Agile methodology refresher\n\nAll sessions scheduled for February.',
      date: '2024-01-11T11:00:00Z',
      authorId: 'user-2'
    }
  ];

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotesByRole();
  }, [notes, userRole]);

  const loadNotes = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNotes(dummyNotes);
      setIsLoading(false);
    }, 500);
  };

  const filterNotesByRole = () => {
    if (canAccessAdminFeatures()) {
      // Super Admin can see all notes
      setFilteredNotes(notes);
    } else {
      // Other roles can only see their own notes
      const userNotes = notes.filter(note => note.authorId === currentUserId);
      setFilteredNotes(userNotes);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newNote = {
      id: `note-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      date: new Date().toISOString(),
      authorId: currentUserId
    };
    
    setNotes(prev => [newNote, ...prev]);
    setFormData({ title: '', content: '' });
    setFormErrors({});
    setError('');
  };

  const handleEdit = (note) => {
    setEditModal({ isOpen: true, note });
  };

  const handleSaveEdit = () => {
    if (!validateForm()) return;
    
    const updatedNotes = notes.map(note => 
      note.id === editModal.note.id 
        ? { ...note, title: formData.title.trim(), content: formData.content.trim() }
        : note
    );
    
    setNotes(updatedNotes);
    setEditModal({ isOpen: false, note: null });
    setFormData({ title: '', content: '' });
    setFormErrors({});
  };

  const handleDelete = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const openEditModal = (note) => {
    setFormData({ title: note.title, content: note.content });
    setEditModal({ isOpen: true, note });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, note: null });
    setFormData({ title: '', content: '' });
    setFormErrors({});
  };

  const canEditNote = (note) => {
    return canAccessAdminFeatures() || note.authorId === currentUserId;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
        <p className="text-slate-300">Create and manage your personal notes</p>
      </div>

      {/* Add Note Form */}
      <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add New Note
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.title ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Enter note title (max 100 characters)"
              maxLength={100}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
            <p className="text-slate-400 text-sm mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.content ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Write your note content here... (Markdown supported)"
            />
            {formErrors.content && (
              <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Note
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-300 mt-2">Loading notes...</p>
        </div>
      ) : (
        <>
          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-3">
                    {truncateContent(note.content)}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {formatDate(note.date)}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewModal({ isOpen: true, note })}
                    className="flex items-center px-3 py-1 text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  
                  {canEditNote(note) && (
                    <>
                      <button
                        onClick={() => openEditModal(note)}
                        className="flex items-center px-3 py-1 text-green-400 hover:bg-slate-700 rounded-md transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="flex items-center px-3 py-1 text-red-400 hover:bg-slate-700 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No notes found</p>
              <p className="text-slate-500">Create your first note using the form above</p>
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      {viewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{viewModal.note.title}</h2>
                <button
                  onClick={() => setViewModal({ isOpen: false, note: null })}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-slate-400 text-sm mb-4">
                Created on {formatDate(viewModal.note.date)}
              </p>
              
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-slate-300 font-sans">
                  {viewModal.note.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Edit Note</h2>
                <button
                  onClick={closeEditModal}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-slate-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Enter note title (max 100 characters)"
                    maxLength={100}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                  <p className="text-slate-400 text-sm mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="edit-content" className="block text-sm font-medium text-slate-300 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.content ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Write your note content here... (Markdown supported)"
                  />
                  {formErrors.content && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-slate-600 text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;