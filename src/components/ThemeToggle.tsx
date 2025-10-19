'use client';

import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi2';

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  const getCurrentModeIcon = () => {
    return mode === 'light' ? (
      <HiSun className='h-5 w-5' />
    ) : (
      <HiMoon className='h-5 w-5' />
    );
  };

  const getModeName = () => {
    return mode === 'light' ? 'Light Mode' : 'Dark Mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className='relative cursor-pointer rounded-lg bg-gray-100 p-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      title={`Current: ${getModeName()} | Click to toggle`}
    >
      {getCurrentModeIcon()}
    </button>
  );
}

// Compact version for smaller spaces
export function CompactThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className='rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      title='Toggle Theme'
    >
      {mode === 'light' ? (
        <HiSun className='h-4 w-4' />
      ) : (
        <HiMoon className='h-4 w-4' />
      )}
    </button>
  );
}
