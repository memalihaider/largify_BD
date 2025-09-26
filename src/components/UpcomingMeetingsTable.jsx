import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Video,
  Building
} from 'lucide-react';

const UpcomingMeetingsTable = ({ meetings = [], onViewMeeting }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting logic
  const sortedMeetings = useMemo(() => {
    return [...meetings].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date and time sorting
      if (sortField === 'date') {
        aValue = new Date(`${a.date} ${a.time}`);
        bValue = new Date(`${b.date} ${b.time}`);
      } else if (sortField === 'participants') {
        aValue = a.participants.length;
        bValue = b.participants.length;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [meetings, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeetings = sortedMeetings.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = (date, time) => {
    const meetingDateTime = new Date(`${date} ${time}`);
    return meetingDateTime > new Date();
  };

  const getLocationIcon = (location) => {
    if (location.includes('http') || location.includes('zoom') || location.includes('teams')) {
      return <Video className="h-4 w-4" />;
    }
    return <Building className="h-4 w-4" />;
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="h-4 w-4" /> : 
          <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No meetings scheduled</h3>
        <p className="text-gray-500 dark:text-gray-400">Schedule your first meeting to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedMeetings.length)} of {sortedMeetings.length} meetings
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="title">Title</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="date">Date & Time</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="participants">Participants</SortButton>
              </th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Agenda</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedMeetings.map((meeting) => (
              <tr 
                key={meeting.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !isUpcoming(meeting.date, meeting.time) ? 'opacity-60' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {meeting.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {meeting.duration}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-gray-900 dark:text-white">
                        {formatDate(meeting.date)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(meeting.time)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-gray-900 dark:text-white">
                        {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {meeting.participants.join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    {getLocationIcon(meeting.location)}
                    <span className="ml-2 truncate max-w-[120px]" title={meeting.location}>
                      {meeting.location || 'Not specified'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {meeting.hasAgenda ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        <FileText className="h-3 w-3 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        None
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewMeeting(meeting)}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedMeetings.map((meeting) => (
          <div 
            key={meeting.id} 
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${
              !isUpcoming(meeting.date, meeting.time) ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">{meeting.title}</h3>
              <button
                onClick={() => onViewMeeting(meeting)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(meeting.date)} at {formatTime(meeting.time)}
                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {meeting.duration}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                {getLocationIcon(meeting.location)}
                <span className="ml-2 truncate">{meeting.location || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {meeting.hasAgenda ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      <FileText className="h-3 w-3 mr-1" />
                      Agenda Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      No Agenda
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetingsTable;