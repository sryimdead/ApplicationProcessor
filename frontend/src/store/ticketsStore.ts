import { create } from 'zustand';
import { ticketsApi } from '../api/tickets';
import type { Ticket, TicketFilters, TicketCreate, TicketUpdate } from '../types/ticket';

interface TicketsState {
  tickets: Ticket[];
  total: number;
  filters: TicketFilters;
  isLoading: boolean;
  error: string | null;
  
  fetchTickets: (filters?: TicketFilters) => Promise<void>;
  createTicket: (data: TicketCreate) => Promise<void>;
  updateTicket: (id: number, data: TicketUpdate) => Promise<void>;
  deleteTicket: (id: number) => Promise<void>;
  setFilters: (filters: TicketFilters) => void;
  clearError: () => void;
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
  tickets: [],
  total: 0,
  filters: {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
  },
  isLoading: false,
  error: null,

  fetchTickets: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const response = await ticketsApi.getAll(currentFilters);
      set({
        tickets: response.items,
        total: response.total,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка загрузки заявок',
        isLoading: false,
      });
    }
  },

  createTicket: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ticketsApi.create(data);
      await get().fetchTickets();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка создания заявки',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTicket: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await ticketsApi.update(id, data);
      await get().fetchTickets();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка обновления заявки',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTicket: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ticketsApi.delete(id);
      await get().fetchTickets();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Ошибка удаления заявки',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchTickets({ ...get().filters, ...filters });
  },

  clearError: () => set({ error: null }),
}));