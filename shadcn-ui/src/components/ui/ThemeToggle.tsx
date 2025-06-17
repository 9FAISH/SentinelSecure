// src/components/ui/ThemeToggle.tsx
import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import useLocalStorage from '@/hooks/useLocalStorage';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light' | 'system'>(
    'theme', 'system'
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};

export default ThemeToggle;