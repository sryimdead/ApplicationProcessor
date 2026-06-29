import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/layout/LoginScreen';
import { TicketFilters } from './components/tickets/TicketFilters';
import { TicketList } from './components/tickets/TicketList';
import { TicketForm } from './components/tickets/TicketForm';
import { useAuthStore } from './store/authStore';

const App: React.FC = () => {
  const { isAuthenticated, isInitializing, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-white font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Заявки</h2>
            <p className="text-blue-100">Управляйте заявками эффективно</p>
          </div>
          <TicketForm />
        </div>

        <TicketFilters />
        <TicketList />
      </main>
    </div>
  );
};

export default App;