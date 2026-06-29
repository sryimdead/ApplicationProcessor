import React from 'react';
import { useTicketsStore } from '../../store/ticketsStore';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

export const TicketFilters: React.FC = () => {
  const { filters, setFilters } = useTicketsStore();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Фильтры и поиск</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Поиск
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по названию и описанию..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              className="input-field pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📊 Статус
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ status: e.target.value as any || undefined, page: 1 })}
            className="input-field"
          >
            <option value="">Все статусы</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Приоритет
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ priority: e.target.value as any || undefined, page: 1 })}
            className="input-field"
          >
            <option value="">Все приоритеты</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        {/* Sort */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📋 Сортировка
          </label>
          // Найди блок с сортировкой и замени на:

          <select
            value={`${filters.sort_by || 'created_at'}:${filters.sort_order || 'desc'}`}
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split(':');
              setFilters({ sort_by: sort_by as any, sort_order: sort_order as any });
            }}
            className="input-field"
          >
            <option value="created_at:desc">🕐 Сначала новые</option>
            <option value="created_at:asc">🕐 Сначала старые</option>
            <option value="priority:desc">🔥 Сначала высокие приоритеты</option>
            <option value="priority:asc">🔥 Сначала низкие приоритеты</option>
          </select>
        </div>
      </div>
    </div>
  );
};