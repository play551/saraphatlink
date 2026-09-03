'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ToastItem, ToastVariant } from '@/types';

/* Global store แบบเบา — ใช้ได้ทุก component โดยไม่ต้องมี Provider */
let toasts: ToastItem[] = [];
const listeners = new Set<(t: ToastItem[]) => void>();

function emit() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function pushToast(
  message: string,
  variant: ToastVariant = 'info',
  duration = 3200
): string {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  toasts = [...toasts, { id, message, variant, duration }];
  emit();
  if (duration > 0) setTimeout(() => dismissToast(id), duration);
  return id;
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (m: string, d?: number) => pushToast(m, 'success', d),
  error: (m: string, d?: number) => pushToast(m, 'error', d ?? 4200),
  info: (m: string, d?: number) => pushToast(m, 'info', d),
  warning: (m: string, d?: number) => pushToast(m, 'warning', d ?? 3800),
};

export function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (t: ToastItem[]) => setItems(t);
    listeners.add(listener);
    setItems([...toasts]);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = useCallback((id: string) => dismissToast(id), []);

  return { toasts: items, dismiss, push: pushToast, toast };
}
