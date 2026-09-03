'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Icon from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/45 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'glass-strong relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden',
          'animate-scale-in rounded-t-3xl sm:rounded-3xl',
          SIZES[size]
        )}
      >
        {title && (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-400/15 px-5 py-4 sm:px-6">
            <div className="min-w-0 flex-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              {title}
            </div>
            <button
              onClick={onClose}
              aria-label="ปิด"
              className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/10 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-slate-400/15 px-5 py-4 sm:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
}

export default Modal;
