import React from 'react';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TicketFlow
              </h1>
              <p className="text-xs text-gray-500">Система управления заявками</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
              user?.is_admin 
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {user?.username}
              </span>
              {user?.is_admin && (
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};