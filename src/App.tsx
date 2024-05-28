
import { useEffect } from 'react';

import AppProvider from './providers';
import AppRouter from './routes';
import Modal from './components/shared/modal';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {

  useEffect(() => { }, []);

  return (
    <AppProvider>
      <Modal />
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
      <AppRouter />
    </AppProvider>
  );
}
