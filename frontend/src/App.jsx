import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import Chatbot from './components/common/Chatbot';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Chatbot />
    </AuthProvider>
  );
}
