import type { TicketStatus, TicketPriority } from '../types/ticket';

export const STATUS_LABELS: Record<TicketStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Завершена',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Низкий',
  normal: 'Обычный',
  high: 'Высокий',
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-red-100 text-red-800',
};