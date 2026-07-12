'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Moon, Sun, Bell, User, LogOut } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';

interface AppBarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed?: boolean;
  isMobile: boolean;
}

export default function AppBar({ onToggleSidebar, isMobile }: AppBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isMobile ? 'PPSC Prep' : 'PPSC Exam Preparation'}
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="cursor-pointer transition-colors relative">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-2 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User Info with dropdown */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              className="flex items-center space-x-3 border-gray-200 dark:border-gray-700 focus:outline-none"
            >
              <div className="w-10 h-10 bg-green-800 dark:bg-green-900 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </button>

            {menuOpen && ( 
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
              >
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout?.();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
