import React, { useEffect } from 'react';
import { TicketCard } from './TicketCard';
import { Loader } from '../ui/Loader';
import { Button } from '../ui/Button';
import { useTicketsStore } from '../../store/ticketsStore';

export const TicketList: React.FC = () => {
  const { tickets, total, filters, isLoading, error, fetchTickets, setFilters } = useTicketsStore();

  useEffect(() => {
    fetchTickets();
  }, []);

  if (isLoading && tickets.length === 0) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-800 mb-2">Ошибка загрузки</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchTickets()} variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Повторить попытку
        </Button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Заявки не найдены</h3>
        <p className="text-gray-500 mb-6">Создайте первую заявку, чтобы начать работу</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / (filters.limit || 10));
  const currentPage = filters.page || 1;

  return (
    <div>
      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Всего заявок</p>
            <p className="text-4xl font-bold">{total}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm mb-1">Показано</p>
            <p className="text-2xl font-semibold">{tickets.length} из {total}</p>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div key={ticket.id} style={{ animationDelay: `${index * 50}ms` }}>
            <TicketCard ticket={ticket} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setFilters({ page: currentPage - 1 })}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center space-x-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Назад</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters({ page })}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setFilters({ page: currentPage + 1 })}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center space-x-1"
            >
              <span>Вперед</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};