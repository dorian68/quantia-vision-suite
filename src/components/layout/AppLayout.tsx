
import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AppLayout({ 
  children, 
  className, 
  requireAuth = true, 
  requireAdmin = false 
}: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (requireAuth && !loading && !user) {
      navigate('/login');
    } else if (requireAdmin && !loading && user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, loading, requireAuth, requireAdmin, navigate]);
  
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  
  if ((requireAuth && !user) || (requireAdmin && user?.role !== 'admin')) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isMobile ? "ml-0" : "ml-64" // Adjust for sidebar width
      )}>
        <Header />
        <main className={cn("flex-1 p-4 md:p-6 overflow-y-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
