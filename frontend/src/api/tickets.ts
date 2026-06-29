import { apiClient } from './client';
import type {
  Ticket,
  TicketCreate,
  TicketUpdate,
  TicketListResponse,
  TicketFilters,
} from '../types/ticket';

export const ticketsApi = {
  getAll: async (filters: TicketFilters = {}): Promise<TicketListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<TicketListResponse>(
      `/tickets?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: TicketCreate): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  update: async (id: number, data: TicketUpdate): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },
};