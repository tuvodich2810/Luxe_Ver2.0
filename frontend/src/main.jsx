import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';

import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);