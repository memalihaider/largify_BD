import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react';

const CalendarView = ({ meetings = [], onMeetingClick, onAddMeeting }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  // Helper functions for date manipulation
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getMeetingsForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return meetings.filter(meeting => meeting.date === dateStr);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    }
    
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth();
  };

  // Render different views
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((date, index) => {
          const dayMeetings = getMeetingsForDate(date);
          const isCurrentDay = isToday(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-1 border border-gray-200 dark:border-gray-600 ${
                isCurrentDay 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${!isCurrentMonthDay ? 'opacity-40' : ''} cursor-pointer transition-colors`}
              onClick={() => date && onAddMeeting && onAddMeeting()}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentDay 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map(meeting => (
                      <div
                        key={meeting.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMeetingClick(meeting);
                        }}
                        className="text-xs p-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded truncate hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                      >
                        {meeting.time} {meeting.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayMeetings.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column header */}
        <div className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          Time
        </div>
        
        {/* Day headers */}
        {weekDays.map(date => (
          <div key={date.toISOString()} className="p-2 text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${
              isToday(date) 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* Day columns */}
            {weekDays.map(date => {
              const dayMeetings = getMeetingsForDate(date).filter(meeting => {
                const meetingHour = parseInt(meeting.time.split(':')[0]);
                return meetingHour === hour;
              });
              
              return (
                <div
                  key={`${date.toISOString()}-${hour}`}
                  className="min-h-[60px] p-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => onAddMeeting && onAddMeeting()}
                >
                  {dayMeetings.map(meeting => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick(meeting);
                      }}
                      className="text-xs p-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded mb-1 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      <div className="font-medium truncate">{meeting.title}</div>
                      <div className="text-xs opacity-75">{meeting.time}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayMeetings = getMeetingsForDate(currentDate);

    return (
      <div className="space-y-1">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        
        {hours.map(hour => {
          const hourMeetings = dayMeetings.filter(meeting => {
            const meetingHour = parseInt(meeting.time.split(':')[0]);
            return meetingHour === hour;
          });
          
          return (
            <div
              key={hour}
              className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <div className="w-20 p-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              </div>
              <div 
                className="flex-1 min-h-[80px] p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onAddMeeting && onAddMeeting()}
              >
                {hourMeetings.map(meeting => (
                  <div
                    key={meeting.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMeetingClick(meeting);
                    }}
                    className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-lg mb-2 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{meeting.participants.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {['month', 'week', 'day'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
            {viewMode === 'month' && getMonthName(currentDate)}
            {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;