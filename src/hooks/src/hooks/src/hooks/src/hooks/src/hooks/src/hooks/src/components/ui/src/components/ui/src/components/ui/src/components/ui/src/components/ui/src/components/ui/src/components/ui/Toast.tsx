'use client';

import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import Icon, { type IconName } from './Icon';
import type { ToastVariant } from '@/types';

const VARIANT_META: Record<ToastVariant, { icon: IconName; classes: string }> = {
  success: {
    icon: 'check-circle',
    classes: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  },
  error: { icon: 'x-circle', classes: 'border-rose-500/40 text-rose-700 dark:text-rose-300' },
  warning: { icon: 'alert', classes: 'border-amber-500/40 text-amber-700 dark:text-amber-300' },
  info: { icon: 'info', classes: 'border-brand-500/40 text-brand-700 dark:text-brand-300' },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[min(92vw,22rem)] flex-col gap-2.5">
      {toasts.map((t) => {
        const meta = VARIANT_META[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'glass-strong pointer-events-auto flex animate-slide-in-right items-start gap-3 rounded-2xl border-l-4 px-4 py-3 shadow-glass-lg',
              meta.classes
            )}
          >
            <Icon name={meta.icon} size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="ปิดการแจ้งเตือน"
              className="shrink-0 rounded p-0.5 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
