export type TicketStatus = 'new' | 'in_progress' | 'done';
export type TicketPriority = 'low' | 'normal' | 'high';

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface TicketCreate {
  title: string;
  description?: string;
  priority?: TicketPriority;
}

export interface TicketUpdate {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  sort_by?: 'created_at' | 'priority';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}