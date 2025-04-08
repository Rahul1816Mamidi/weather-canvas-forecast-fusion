
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative overflow-hidden"
    >
      <Sun className={`h-5 w-5 absolute transition-all duration-500 ${
        theme === 'dark' ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
      }`} />
      <Moon className={`h-5 w-5 absolute transition-all duration-500 ${
        theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
      }`} />
    </Button>
  );
};

export default ThemeToggle;
