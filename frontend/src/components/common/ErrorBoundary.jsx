import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-8 rounded-2xl bg-[#14141C] border border-[#D4AF37]/30 max-w-md space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="font-serif-lux text-2xl font-bold text-white">
              Đã Xảy Ra Lỗi Hiển Thị Trang
            </h2>
            <p className="text-xs text-slate-400 font-mono-lux">
              {this.state.error?.message || 'Hệ thống vừa gặp sự cố không mong muốn.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-lux-gold w-full py-3 text-xs font-mono-lux tracking-wider"
            >
              TẢI LẠI TRANG WEB
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
