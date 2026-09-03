'use client';

import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/data/categories';
import Icon, { type IconName } from '@/components/ui/Icon';
import type { FilterState } from '@/types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onCategoryChange: (id: string) => void;
  onSubCategoryChange: (id: string) => void;
  counts: Record<string, number>;
  totalCount: number;
}

export function Sidebar({
  open,
  onClose,
  filters,
  onCategoryChange,
  onSubCategoryChange,
  counts,
  totalCount,
}: SidebarProps) {
  const activeCat = CATEGORIES.find((c) => c.id === filters.categoryId);

  const content = (
    <div className="flex h-full flex-col gap-1.5 overflow-y-auto p-3">
      <p className="px-2 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-muted">
        หมวดหมู่ทั้งหมด
      </p>

      {/* All */}
      <button
        onClick={() => {
          onCategoryChange('all');
          onClose();
        }}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200',
          filters.categoryId === 'all'
            ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
            : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/8'
        )}
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            filters.categoryId === 'all'
              ? 'bg-white/20'
              : 'bg-gradient-to-br from-slate-400 to-slate-600 text-white'
          )}
        >
          <Icon name="grid" size={15} />
        </span>
        <span className="flex-1 truncate">ทั้งหมด</span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-bold',
            filters.categoryId === 'all'
              ? 'bg-white/25 text-white'
              : 'bg-slate-900/8 text-slate-500 dark:bg-white/10 dark:text-slate-400'
          )}
        >
          {totalCount}
        </span>
      </button>

      {CATEGORIES.map((cat) => {
        const active = filters.categoryId === cat.id;
        return (
          <div key={cat.id}>
            <button
              onClick={() => {
                onCategoryChange(active ? 'all' : cat.id);
                if (!active) onClose();
              }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-slate-900/8 text-slate-900 dark:bg-white/12 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/8'
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm transition-transform duration-200 group-hover:scale-110',
                  cat.color
                )}
              >
                <Icon name={cat.icon as IconName} size={15} />
              </span>
              <span className="flex-1 truncate">{cat.nameTh}</span>
              <span className="rounded-full bg-slate-900/8 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                {counts[cat.id] ?? 0}
              </span>
            </button>

            {/* Sub-categories */}
            {active && cat.subCategories.length > 0 && (
              <div className="ml-6 mt-1 animate-fade-in-up space-y-0.5 border-l-2 border-slate-400/20 pl-3">
                <button
                  onClick={() => onSubCategoryChange('all')}
                  className={cn(
                    'w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition',
                    filters.subCategoryId === 'all'
                      ? 'bg-brand-500/12 text-brand-700 dark:text-brand-300'
                      : 'text-slate-500 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/8'
                  )}
                >
                  ทุกหมวดย่อย
                </button>
                {cat.subCategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSubCategoryChange(sub.id);
                      onClose();
                    }}
                    className={cn(
                      'w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition',
                      filters.subCategoryId === sub.id
                        ? 'bg-brand-500/12 text-brand-700 dark:text-brand-300'
                        : 'text-slate-500 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/8'
                    )}
                  >
                    {sub.nameTh}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Category description */}
      {activeCat && (
        <div className="glass mt-3 animate-fade-in-up rounded-xl p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            {activeCat.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {activeCat.description}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/45 backdrop-blur-sm" onClick={onClose} />
          <aside className="glass-strong absolute left-0 top-0 h-full w-[17rem] animate-slide-in-right overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-400/15 px-4 py-3.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">หมวดหมู่</span>
              <button onClick={onClose} aria-label="ปิด" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-900/10 dark:hover:bg-white/10">
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="h-[calc(100%-3.5rem)]">{content}</div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
