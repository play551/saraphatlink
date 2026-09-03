'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ThemeMode } from '@/types';
import { ThemeStore } from '@/lib/storage';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const apply = useCallback((m: ThemeMode) => {
    if (typeof window === 'undefined') return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = m === 'dark' || (m === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    setResolved(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const stored = ThemeStore.get();
    setMode(stored);
    apply(stored);
    setMounted(true);
  }, [apply]);

  useEffect(() => {
    if (!mounted || mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => apply('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode, mounted, apply]);

  const setTheme = useCallback(
    (m: ThemeMode) => {
      setMode(m);
      ThemeStore.set(m);
      apply(m);
    },
    [apply]
  );

  const cycleTheme = useCallback(() => {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    setTheme(order[(order.indexOf(mode) + 1) % order.length]);
  }, [mode, setTheme]);

  return { mode, resolved, setTheme, cycleTheme, mounted };
}
