import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function AdminHeader({ title }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  return (
    <header style={{
      height: 60, background: 'var(--black)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px', flexShrink: 0,
    }}>
      <h1 style={{
        fontFamily: 'Cormorant Garamond', fontSize: 22,
        fontWeight: 300, color: 'var(--white)',
      }}>
        {title}
      </h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Website
        </Button>
        <Button variant="danger" size="sm"
          onClick={async () => { await logout(); navigate('/'); }}>
          Đăng xuất
        </Button>
      </div>
    </header>
  );
}