import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useTicketsStore } from '../../store/ticketsStore';
import { PRIORITY_LABELS } from '../../utils/constants';

const ticketSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(120, 'Максимум 120 символов'),
  description: z.string().max(1000, 'Максимум 1000 символов').optional(),
  priority: z.enum(['low', 'normal', 'high']),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export const TicketForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { createTicket, isLoading } = useTicketsStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'normal',
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket(data);
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center space-x-2 shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Создать заявку</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="📝 Создание новой заявки">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Введите название заявки"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Введите описание (необязательно)"
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Приоритет
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all duration-200 ${
                    value === 'low' ? 'hover:border-slate-400' :
                    value === 'normal' ? 'hover:border-blue-400' :
                    'hover:border-rose-400'
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    {...register('priority')}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">
                    {value === 'low' ? '🔽' : value === 'normal' ? '➡️' : '🔼'}
                  </div>
                  <div className="text-sm font-medium">{label}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Создание...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Создать</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};