import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Calendar, 
  User,
  Clock,
  Flag,
  Filter,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import Card from '../components/Card';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: 'Follow up with lead #1234',
      description: 'Contact Alice Johnson regarding Premium Plan inquiry',
      status: 'In Progress',
      priority: 'High',
      assignee: 'John Doe',
      dueDate: '2024-01-16',
      createdDate: '2024-01-15',
      category: 'Sales',
      estimatedHours: 2,
      completedHours: 1
    },
    {
      id: 2,
      title: 'Update product documentation',
      description: 'Review and update API documentation for v2.0 release',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'Jane Smith',
      dueDate: '2024-01-20',
      createdDate: '2024-01-14',
      category: 'Documentation',
      estimatedHours: 8,
      completedHours: 0
    },
    {
      id: 3,
      title: 'Prepare monthly sales report',
      description: 'Compile sales data and create presentation for management',
      status: 'Completed',
      priority: 'High',
      assignee: 'Mike Johnson',
      dueDate: '2024-01-15',
      createdDate: '2024-01-10',
      category: 'Reporting',
      estimatedHours: 4,
      completedHours: 4
    },
    {
      id: 4,
      title: 'Fix login page bug',
      description: 'Resolve issue with password reset functionality',
      status: 'In Progress',
      priority: 'High',
      assignee: 'Sarah Wilson',
      dueDate: '2024-01-17',
      createdDate: '2024-01-15',
      category: 'Development',
      estimatedHours: 3,
      completedHours: 1.5
    },
    {
      id: 5,
      title: 'Design new landing page',
      description: 'Create mockups for updated homepage design',
      status: 'Review',
      priority: 'Medium',
      assignee: 'Tom Brown',
      dueDate: '2024-01-22',
      createdDate: '2024-01-12',
      category: 'Design',
      estimatedHours: 12,
      completedHours: 10
    },
    {
      id: 6,
      title: 'Customer support training',
      description: 'Conduct training session for new support team members',
      status: 'Todo',
      priority: 'Low',
      assignee: 'Lisa Davis',
      dueDate: '2024-01-25',
      createdDate: '2024-01-13',
      category: 'Training',
      estimatedHours: 6,
      completedHours: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'text-slate-400 bg-slate-500/10';
      case 'In Progress': return 'text-blue-400 bg-blue-500/10';
      case 'Review': return 'text-yellow-400 bg-yellow-500/10';
      case 'Completed': return 'text-green-400 bg-green-500/10';
      case 'Cancelled': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'text-green-400 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'High': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Sales': return 'text-purple-400 bg-purple-500/10';
      case 'Development': return 'text-blue-400 bg-blue-500/10';
      case 'Design': return 'text-pink-400 bg-pink-500/10';
      case 'Documentation': return 'text-cyan-400 bg-cyan-500/10';
      case 'Reporting': return 'text-orange-400 bg-orange-500/10';
      case 'Training': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    review: tasks.filter(t => t.status === 'Review').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-slate-400">Manage and track team tasks and assignments</p>
          </div>
        </div>
        <button className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{taskStats.total}</div>
          <div className="text-sm text-slate-400">Total Tasks</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-slate-400">{taskStats.todo}</div>
          <div className="text-sm text-slate-400">To Do</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{taskStats.inProgress}</div>
          <div className="text-sm text-slate-400">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{taskStats.review}</div>
          <div className="text-sm text-slate-400">Review</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{taskStats.completed}</div>
          <div className="text-sm text-slate-400">Completed</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate);
          const overdue = isOverdue(task.dueDate);
          const progress = (task.completedHours / task.estimatedHours) * 100;

          return (
            <Card key={task.id} className="p-6 hover:bg-slate-700/30 transition-colors duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-300 p-1 rounded transition-colors duration-200">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Status and Priority */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{task.completedHours}h completed</span>
                  <span>{task.estimatedHours}h estimated</span>
                </div>
              </div>

              {/* Assignee and Due Date */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-300">
                  <User className="h-4 w-4 mr-2 text-slate-400" />
                  {task.assignee}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                  <span className={overdue ? 'text-red-400' : daysUntilDue <= 1 ? 'text-yellow-400' : 'text-slate-300'}>
                    {task.dueDate}
                    {overdue && ' (Overdue)'}
                    {!overdue && daysUntilDue === 0 && ' (Due Today)'}
                    {!overdue && daysUntilDue === 1 && ' (Due Tomorrow)'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-400">
                  <Clock className="h-4 w-4 mr-2" />
                  Created {task.createdDate}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                  {task.status === 'Completed' ? 'View' : 'Update'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card className="p-12 text-center">
          <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default Tasks;