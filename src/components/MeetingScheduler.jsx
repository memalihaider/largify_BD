import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import MeetingFormModal from '../components/MeetingFormModal';
import UpcomingMeetingsTable from '../components/UpcomingMeetingsTable';
import MeetingDetailsModal from '../components/MeetingDetailsModal';

// Dummy meetings data
const initialMeetings = [
  {
    id: 1,
    title: "Product Strategy Review",
    date: "2024-01-25",
    time: "10:00",
    duration: "1hr",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    location: "Conference Room A",
    hasAgenda: true,
    agenda: {
      introduction: "Welcome and introductions (5 minutes)",
      discussionPoints: [
        "Q4 product performance review",
        "2024 roadmap priorities",
        "Resource allocation discussion",
        "Market feedback analysis"
      ],
      actionItems: [
        "Finalize Q1 feature priorities",
        "Schedule follow-up with engineering team",
        "Prepare market research presentation"
      ],
      closingNotes: "Next meeting scheduled for February 1st"
    }
  },
  {
    id: 2,
    title: "Client Onboarding Call",
    date: "2024-01-26",
    time: "14:30",
    duration: "30min",
    participants: ["Sarah Wilson", "Tom Brown"],
    location: "https://zoom.us/j/123456789",
    hasAgenda: false
  },
  {
    id: 3,
    title: "Team Standup",
    date: "2024-01-27",
    time: "09:00",
    duration: "30min",
    participants: ["Development Team"],
    location: "Virtual - Teams",
    hasAgenda: true,
    agenda: {
      introduction: "Daily standup check-in (5 minutes)",
      discussionPoints: [
        "Yesterday's accomplishments",
        "Today's priorities",
        "Blockers and challenges"
      ],
      actionItems: [
        "Address deployment issues",
        "Review code reviews",
        "Update project timeline"
      ],
      closingNotes: "Same time tomorrow"
    }
  }
];

const MeetingScheduler = () => {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Filter meetings based on search and filter criteria
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'today' && meeting.date === new Date().toISOString().split('T')[0]) ||
                         (filterBy === 'upcoming' && new Date(meeting.date) > new Date()) ||
                         (filterBy === 'with-agenda' && meeting.hasAgenda);
    
    return matchesSearch && matchesFilter;
  });

  const handleAddMeeting = (meetingData) => {
    const newMeeting = {
      ...meetingData,
      id: meetings.length + 1,
    };
    setMeetings([...meetings, newMeeting]);
    setShowMeetingForm(false);
  };

  const handleEditMeeting = (updatedMeeting) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === updatedMeeting.id ? updatedMeeting : meeting
    ));
    setShowMeetingDetails(false);
  };

  const handleDeleteMeeting = (meetingId) => {
    setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
    setShowMeetingDetails(false);
  };

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Meeting Scheduler
              </h1>
            </div>
            <button
              onClick={() => setShowMeetingForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Calendar View
                  </h2>
                </div>
                <CalendarView 
                  meetings={meetings} 
                  onMeetingClick={handleViewMeeting}
                  onAddMeeting={() => setShowMeetingForm(true)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Actions & Filters */}
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search & Filter
              </h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by:
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Meetings</option>
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="with-agenda">With Agenda</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Meetings</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{meetings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">With Agenda</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {meetings.filter(m => m.hasAgenda).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {meetings.filter(m => {
                      const meetingDate = new Date(m.date);
                      const today = new Date();
                      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return meetingDate >= today && meetingDate <= weekFromNow;
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings Table */}
        <div className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Meetings
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''}
                </div>
              </div>
              <UpcomingMeetingsTable 
                meetings={filteredMeetings}
                onViewMeeting={handleViewMeeting}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMeetingForm && (
        <MeetingFormModal
          onClose={() => setShowMeetingForm(false)}
          onSubmit={handleAddMeeting}
        />
      )}

      {showMeetingDetails && selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setShowMeetingDetails(false)}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
        />
      )}
    </div>
  );
};

export default MeetingScheduler;