import axios from 'axios';

// Определяем API URL динамически
const getApiUrl = () => {
  // Если задана переменная окружения - используем её
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Иначе определяем по текущему хосту
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Если localhost - используем localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // Иначе используем текущий IP с портом backend
  return `${protocol}//${hostname}:8000/api`;
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);