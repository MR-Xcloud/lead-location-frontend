import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, History, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-16 bg-white shadow-lg flex flex-col items-center py-6">
      <div className="mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <nav className="flex flex-col space-y-4 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
          title="Current Form"
        >
          <FileText className="w-5 h-5" />
        </NavLink>
        
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
          title="History"
        >
          <History className="w-5 h-5" />
        </NavLink>
      </nav>
      
      <div className="mt-auto">
        <div className="mb-4 text-xs text-gray-500 text-center">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={logout}
          className="p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;