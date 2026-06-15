'use client';
// ============================================================
// hooks/useTheme.ts — gerencia tema dark/light com persistência
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { loadTheme, saveTheme } from '../lib/utils';

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Carrega tema salvo na montagem
  useEffect(() => {
    const saved = loadTheme();
    setThemeState(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      saveTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
