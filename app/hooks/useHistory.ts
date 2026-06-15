'use client';
// ============================================================
// hooks/useHistory.ts — gerencia histórico no LocalStorage
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  loadHistory,
  saveToHistory,
  removeFromHistory,
  clearHistory,
} from '../lib/utils';
import type { HistoryItem, QRMode, QRColors } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Carrega histórico ao montar (client-only)
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback(
    (content: string, label: string, mode: QRMode, colors: QRColors) => {
      if (!content.trim()) return;
      const updated = saveToHistory(content, label, mode, colors);
      setHistory(updated);
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    const updated = removeFromHistory(id);
    setHistory(updated);
  }, []);

  const clearAll = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, addToHistory, removeItem, clearAll };
}
