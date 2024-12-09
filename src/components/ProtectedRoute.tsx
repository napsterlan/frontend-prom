import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (!auth.isAuthenticated()) {
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 