import React, { useState } from 'react';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import NavbarSearch from './NavbarSearch';

const DashboardNavbar = ({ user, onToggleSidebar, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Mobile menu button and title */}
      <div className="flex items-center flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Page title - hidden on mobile */}
        <h1 className="hidden sm:block ml-4 lg:ml-0 text-xl font-semibold text-white">
          Dashboard
        </h1>
      </div>

      {/* Center - Search Bar */}
      <NavbarSearch user={user} />

      {/* Right side - User menu */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* User info and dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
          >
            {/* User avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            
            {/* User info - hidden on small screens */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role || 'Team Member'}</p>
            </div>
            
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <>
              {/* Backdrop for mobile */}
              <div 
                className="fixed inset-0 z-10 sm:hidden" 
                onClick={() => setDropdownOpen(false)}
              />
              
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  {/* User info in dropdown - visible on small screens */}
                  <div className="sm:hidden px-4 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role || 'Team Member'}</p>
                  </div>
                  
                  {/* Profile option */}
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  
                  {/* Logout option */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;