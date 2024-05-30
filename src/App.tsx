
import { useEffect } from 'react';

import AppProvider from './providers';
import AppRouter from './routes';
import Modal from './components/shared/modal';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContext } from './provider/wallet';
import { NetworkContext } from './provider/network';

export default function App() {

  useEffect(() => { }, []);

  return (
    <AppProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        limit={1}
        rtl={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <NetworkContext>
        <WalletContext>
          <Modal />
          <AppRouter />
        </WalletContext>
      </NetworkContext>
    </AppProvider>
  );
}
