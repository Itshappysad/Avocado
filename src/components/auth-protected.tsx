import { useNavigate } from 'react-router-dom';
import { auth } from '../core/auth';
import { useEffect } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = auth.currentUser;
  useEffect(() => {
    if (!user) {
      navigate('/signup', { replace: true });
    }
  }, [navigate, user]);

  return children;
}
export default ProtectedRoute;
