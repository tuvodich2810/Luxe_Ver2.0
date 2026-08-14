import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import LoadingScreen from './components/common/LoadingScreen';
import RegisterWidget from './components/common/RegisterWidget';

export default function App() {
  // Show loading screen only once per session (not on every navigate)
  const [loaded, setLoaded] = useState(() => {
    // If already shown this session, skip it
    if (sessionStorage.getItem('luxe_loaded')) return true;
    return false;
  });

  const handleLoadComplete = () => {
    sessionStorage.setItem('luxe_loaded', '1');
    setLoaded(true);
  };

  return (
    <AuthProvider>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <AppRouter />
      <RegisterWidget />
    </AuthProvider>
  );
}
