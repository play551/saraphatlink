'use client';

import { useTheme } from '@/hooks/useTheme';
import Icon, { type IconName } from '@/components/ui/Icon';
import type { ThemeMode } from '@/types';

const LABEL: Record<ThemeMode, { icon: IconName; text: string }> = {
  light: { icon: 'sun', text: 'สว่าง' },
  dark: { icon: 'moon', text: 'มืด' },
  system: { icon: 'monitor', text: 'ตามระบบ' },
};

export function ThemeToggle() {
  const { mode, cycleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="h-10 w-10 rounded-xl bg-slate-400/15" />;
  }

  const meta = LABEL[mode];

  return (
    <button
      onClick={cycleTheme}
      title={`ธีม: ${meta.text} (คลิกเพื่อสลับ)`}
      aria-label={`สลับธีม ปัจจุบัน ${meta.text}`}
      className="glass group flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:scale-105 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
    >
      <Icon
        name={meta.icon}
        size={18}
        className="transition-transform duration-500 group-hover:rotate-45"
      />
    </button>
  );
}

export default ThemeToggle;
