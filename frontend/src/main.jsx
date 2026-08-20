import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';

// Bảo mật: Tắt toàn bộ console.log / console.info / console.debug trên trình duyệt để ẩn thông tin nội bộ
if (typeof window !== 'undefined') {
  window.console.log = () => {};
  window.console.info = () => {};
  window.console.debug = () => {};
}

// Bắt và ngăn chặn các lỗi unhandled rejection từ extension trình duyệt hoặc background promises
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('toLowerCase') ||
    event.reason?.message?.includes('401') ||
    event.reason?.message?.includes('Phiên làm việc')
  ) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);