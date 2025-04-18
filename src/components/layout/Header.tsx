
import { useState } from 'react';
import { Bell, Moon, Search, Sun, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'US';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left side */}
        <div className="ml-16 md:ml-0 flex items-center gap-2">
          {!isMobile && (
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-full bg-background pl-8 border-muted rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <div className="flex items-center gap-2">
            <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-orange-400' : 'text-muted-foreground'}`} />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
            />
            <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground'}`} />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mt-2 p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'email@example.com'}</p>
                    {user?.company && (
                      <p className="text-xs text-muted-foreground">{user.company}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-1">
                <Button variant="ghost" className="w-full justify-start text-sm py-1.5" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Mon profil
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm py-1.5" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm py-1.5" 
                  size="sm"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
