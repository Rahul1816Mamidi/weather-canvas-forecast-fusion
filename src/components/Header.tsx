
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { theme, setTheme } = useTheme();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Forecast', path: '/forecast' },
    { name: 'Locations', path: '/locations' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Custom Alerts', path: '/custom-alerts' },
    { name: 'Air Quality', path: '/air-quality' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-30 w-full">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">WeatherCanvas</span>
          </NavLink>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-primary transition-colors'
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-2"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>WeatherCanvas</SheetTitle>
                <SheetDescription>
                  Navigate to different sections of the app
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-secondary/80'
                      }`
                    }
                    end={item.path === '/'}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
