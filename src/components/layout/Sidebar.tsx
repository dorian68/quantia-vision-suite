
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  BrainCircuit, 
  LucideIcon, 
  TrendingUp, 
  Home, 
  Settings, 
  Menu, 
  X, 
  User,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  color?: string;
}

const NavItem = ({ icon: Icon, label, href, active, color = 'blue' }: NavItemProps) => {
  const colorMap = {
    blue: 'from-quantia-blue to-quantia-cyan',
    purple: 'from-quantia-purple to-quantia-indigo',
    green: 'from-quantia-green to-quantia-cyan',
  };

  const gradientClass = colorMap[color as keyof typeof colorMap] || colorMap.blue;
  
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
        active 
          ? "bg-gradient-to-r bg-opacity-10 text-white" 
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
      style={active ? { backgroundImage: `linear-gradient(to right, rgba(var(--primary), 0.15), transparent)` } : {}}
    >
      <span className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-300",
        active ? "bg-gradient-to-r" : "bg-sidebar-accent/50"
      )}
      style={active ? { backgroundImage: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))` } : {}}
      >
        <Icon className={cn(
          "w-5 h-5",
          active ? "text-white" : "text-sidebar-foreground"
        )} />
      </span>
      <span className="font-medium">{label}</span>
      {active && (
        <span className="ml-auto w-1.5 h-12 bg-gradient-to-b from-primary/80 to-primary/30 rounded-full" />
      )}
    </Link>
  );
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {isMobile && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-sidebar-background border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-quantia-blue to-quantia-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="font-bold text-xl text-sidebar-foreground">OptiQuantIA</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Navigation
            </p>
            <NavItem icon={Home} label="Accueil" href="/" active={isActive('/')} />
            
            <p className="mt-6 px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Modules
            </p>
            <NavItem 
              icon={BarChart3} 
              label="Pilotage Performance" 
              href="/performance" 
              active={isActive('/performance')} 
              color="blue"
            />
            <NavItem 
              icon={BrainCircuit} 
              label="Intelligence Assistée" 
              href="/intelligence" 
              active={isActive('/intelligence')} 
              color="purple"
            />
            <NavItem 
              icon={TrendingUp} 
              label="Intelligence Prédictive" 
              href="/predictive" 
              active={isActive('/predictive')} 
              color="green"
            />
            
            <p className="mt-6 px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Utilisateur
            </p>
            <NavItem icon={User} label="Mon Profil" href="/profile" active={isActive('/profile')} />
            <NavItem icon={Settings} label="Paramètres" href="/settings" active={isActive('/settings')} />
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-10 h-10 text-yellow-400 animate-pulse-glow p-2 bg-yellow-400/10 rounded-md" />
              <div>
                <h4 className="text-sm font-medium text-sidebar-foreground">Besoin d'aide?</h4>
                <p className="text-xs text-sidebar-foreground/70">Notre assistant IA peut vous guider</p>
              </div>
            </div>
            <Button className="mt-2 w-full" variant="outline" size="sm">
              Demander à l'IA
            </Button>
          </div>
        </div>
      </aside>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
