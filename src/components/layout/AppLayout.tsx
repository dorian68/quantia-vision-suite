
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  requireAuth?: boolean;
}

export function AppLayout({ children, className, requireAuth = true }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
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
