'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

// Theme types
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always start with 'light' for SSR consistency
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Detect system theme preference (only used for initialization)
  const getSystemTheme = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  // Initialize theme from localStorage or system preference (client-side only)
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('theme-mode');
        if (stored && (stored === 'light' || stored === 'dark')) {
          setMode(stored);
          return;
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }

      // If no valid stored theme, use system preference
      setMode(getSystemTheme());
    }
  }, []); // Save theme to localStorage
  const saveTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme-mode', newMode);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  };

  // Apply theme classes to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      // Apply dark mode class
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [mode]);

  // Theme control functions
  const setThemeMode = (newMode: ThemeMode) => {
    saveTheme(newMode);
  };

  // Simple toggle between light and dark
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const contextValue: ThemeContextType = {
    mode,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div suppressHydrationWarning={!mounted}>{children}</div>
    </ThemeContext.Provider>
  );
}

// Custom hook for using theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
