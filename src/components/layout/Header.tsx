
import { useState } from 'react';
import { Bell, Moon, Search, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
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
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">US</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mt-2 p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">US</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Utilisateur Demo</p>
                    <p className="text-xs text-muted-foreground">demo@optiquantia.com</p>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <Button variant="ghost" className="w-full justify-start text-sm py-1.5" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Mon profil
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm py-1.5" size="sm">
                  Paramètres
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm py-1.5" size="sm">
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
