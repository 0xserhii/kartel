import { Socket, io } from 'socket.io-client';
import { useEffect } from 'react';

import AppProvider from './providers';
import AppRouter from './routes';
import { ClientToServerEvents, ServerToClientEvents } from './types';
import Modal from './components/shared/modal';

export default function App() {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

  useEffect(() => { }, []);

  return (
    <AppProvider>
      <Modal />
      <AppRouter />
    </AppProvider>
  );
}
