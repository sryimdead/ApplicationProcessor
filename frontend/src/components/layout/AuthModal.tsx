import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Вход для администратора">
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Input
          label="Имя пользователя"
          placeholder="admin"
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Пароль"
          type="password"
          placeholder="admin"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex gap-2 mt-6">
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Войти
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </form>
    </Modal>
  );
};