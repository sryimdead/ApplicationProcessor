import React from 'react';
import type { Ticket } from '../../types/ticket';
import { useTicketsStore } from '../../store/ticketsStore';
import { useAuthStore } from '../../store/authStore';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

interface TicketCardProps {
  ticket: Ticket;
}

const statusIcons = {
  new: '🆕',
  in_progress: '⚙️',
  done: '✅'
};

const priorityIcons = {
  low: '🔽',
  normal: '➡️',
  high: '🔼'
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { updateTicket, deleteTicket } = useTicketsStore();
  const { user } = useAuthStore();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTicket(ticket.id, { status: newStatus as any });
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        await deleteTicket(ticket.id);
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const isDone = ticket.status === 'done';
  const isAdmin = user?.is_admin || false;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {ticket.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={`badge status-badge-${ticket.status}`}>
                <span className="mr-1">{statusIcons[ticket.status]}</span>
                {STATUS_LABELS[ticket.status]}
              </span>
              <span className={`badge priority-badge-${ticket.priority}`}>
                <span className="mr-1">{priorityIcons[ticket.priority]}</span>
                {PRIORITY_LABELS[ticket.priority]}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {ticket.description && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {ticket.description}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Создана: {formatDate(ticket.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Обновлена: {formatDate(ticket.updated_at)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isDone && (
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            )}
            
            {isAdmin && !isDone && (
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Удалить</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};