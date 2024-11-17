import { AppProvider } from '@/components/providers/AppProvider';
import { AppRoutes } from '@/routes';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { InstallPrompt } from '@/components/ui/install-prompt';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, checkAdminAccess } = useAuth();

  useEffect(() => {
    // Handle initial redirect from session storage
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      navigate(redirect);
    }

    const publicPaths = ['/login'];
    const adminPaths = ['/admin', '/admin/investments', '/admin/users', '/admin/settings', '/admin/balances', '/admin/referrals'];
    const currentPath = location.pathname;
    const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));
    const isAdminPath = adminPaths.some(path => currentPath === path);

    if (!isAuthenticated && !isPublicPath) {
      navigate('/login', { replace: true, state: { from: location } });
    } else if (isAuthenticated && isPublicPath) {
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } else if (isAdminPath && !checkAdminAccess()) {
      navigate('/dashboard', { replace: true });
    } else if (isAuthenticated && currentPath === '/') {
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, location, navigate, user, checkAdminAccess]);

  return (
    <ErrorBoundary>
      <AppProvider>
        <InstallPrompt />
        <AppRoutes />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;