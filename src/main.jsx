import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
      <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <ToastContainer />
    <App />
    </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
