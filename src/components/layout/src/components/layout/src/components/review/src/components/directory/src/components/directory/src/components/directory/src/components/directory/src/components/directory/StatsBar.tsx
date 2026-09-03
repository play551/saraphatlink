'use client';

import { cn } from '@/lib/utils';
import Icon, { type IconName } from '@/components/ui/Icon';

interface StatsBarProps {
  stats: {
    approved: number;
    online: number;
    featured: number;
    avgRating: number;
  };
  categoryCount: number;
}

export function StatsBar({ stats, categoryCount }: StatsBarProps) {
  const items: { icon: IconName; label: string; value: string; color: string }[] = [
    {
      icon: 'globe',
      label: 'เว็บไซต์ทั้งหมด',
      value: String(stats.approved),
      color: 'from-brand-500 to-brand-600',
    },
    {
      icon: 'layers',
      label: 'หมวดหมู่',
      value: String(categoryCount),
      color: 'from-accent-500 to-fuchsia-600',
    },
    {
      icon: 'fire',
      label: 'แนะนำพิเศษ',
      value: String(stats.featured),
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: 'star-filled',
      label: 'คะแนนเฉลี่ย',
      value: stats.avgRating.toFixed(1),
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((it, i) => (
        <div
          key={it.label}
          className="glass-card flex items-center gap-3 p-3.5 animate-fade-in-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
              it.color
            )}
          >
            <Icon name={it.icon} size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-none text-slate-900 dark:text-white">
              {it.value}
            </p>
            <p className="mt-1 truncate text-[11px] font-medium text-muted">{it.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
