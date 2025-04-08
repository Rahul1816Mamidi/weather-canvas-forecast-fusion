
import React from "react";
import { Link } from "react-router-dom";
import { Cloud, CloudRain, MapPin, Menu, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { useMediaQuery } from "@/hooks/use-media-query";

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center relative">
            <Sun className="h-6 w-6 text-weather-sunny animate-spin-slow" />
            <Cloud className="h-8 w-8 text-weather-cloudy absolute -right-2 -top-1" />
          </div>
          <span className="text-xl font-semibold ml-2">WeatherCanvas</span>
        </div>

        {isMobile ? (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-20"
            >
              <Menu />
            </Button>
            
            {menuOpen && (
              <nav className="absolute top-full right-0 mt-2 p-4 glass rounded-lg z-10 min-w-[200px] animate-fade-in">
                <ul className="space-y-4">
                  <li>
                    <Link to="/" className="flex items-center gap-2 hover:text-primary" onClick={() => setMenuOpen(false)}>
                      <Sun size={16} />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/forecast" className="flex items-center gap-2 hover:text-primary" onClick={() => setMenuOpen(false)}>
                      <CloudRain size={16} />
                      <span>Forecast</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/locations" className="flex items-center gap-2 hover:text-primary" onClick={() => setMenuOpen(false)}>
                      <MapPin size={16} />
                      <span>Locations</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="flex items-center gap-2 hover:text-primary" onClick={() => setMenuOpen(false)}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li className="pt-2 border-t">
                    <ThemeToggle />
                  </li>
                </ul>
              </nav>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                  <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Sun size={16} />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/forecast" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <CloudRain size={16} />
                    <span>Forecast</span>
                  </Link>
                </li>
                <li>
                  <Link to="/locations" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MapPin size={16} />
                    <span>Locations</span>
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
