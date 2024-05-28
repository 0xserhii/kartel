import { useEffect } from 'react';
import AppProvider from './providers';
import AppRouter from './routes';
import Modal from './components/shared/modal';

export default function App() {

  useEffect(() => { }, []);

  return (
    <AppProvider>
      <Modal />
      <AppRouter />
    </AppProvider>
  );
}
