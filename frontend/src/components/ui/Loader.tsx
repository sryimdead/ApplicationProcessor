import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Загрузка...</p>
    </div>
  );
};