'use client';

import { useState } from 'react';
import { cn, PRICING_META, PRICING_OPTIONS, SORT_OPTIONS } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import type { FilterState, PricingType, SortKey, ViewMode } from '@/types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  allTags: string[];
  activeCount: number;
  onReset: () => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  resultCount: number;
}

export function FilterBar({
  filters,
  setFilters,
  allTags,
  activeCount,
  onReset,
  view,
  onViewChange,
  resultCount,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const togglePricing = (p: PricingType) =>
    setFilters((f) => ({
      ...f,
      pricing: f.pricing.includes(p)
        ? (f.pricing.filter((x) => x !== p) as PricingType[])
        : ([...f.pricing, p] as PricingType[]),
    }));

  const toggleTag = (t: string) =>
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }));

  const topTags = allTags.slice(0, expanded ? allTags.length : 14);

  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      {/* Row 1 */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            'btn !px-3 !py-2 !text-xs',
            activeCount > 0
              ? 'bg-brand-500/12 text-brand-700 dark:text-brand-300'
              : 'text-slate-600 hover:bg-slate-900/6 dark:text-slate-300 dark:hover:bg-white/10'
          )}
        >
          <Icon name="filter" size={14} />
          ตัวกรอง
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-brand-500 px-1.5 py-px text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
          <Icon
            name="chevron-down"
            size={13}
            className={cn('transition-transform duration-300', expanded && 'rotate-180')}
          />
        </button>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortKey }))}
            aria-label="เรียงลำดับ"
            className="input-field !w-auto !rounded-lg !py-2 !pl-8 !pr-8 !text-xs font-semibold appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Icon
            name="trending"
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Icon
            name="chevron-down"
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Quick toggles */}
        <button
          onClick={() => setFilters((f) => ({ ...f, onlyVerified: !f.onlyVerified }))}
          className={filters.onlyVerified ? 'chip-active' : 'chip-idle'}
        >
          <Icon name="shield" size={11} />
          ตรวจสอบแล้ว
        </button>
        <button
          onClick={() => setFilters((f) => ({ ...f, onlyOnline: !f.onlyOnline }))}
          className={filters.onlyOnline ? 'chip-active' : 'chip-idle'}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          ใช้งานได้
        </button>

        <div className="flex-1" />

        <span className="hidden text-xs font-semibold text-muted sm:block">
          {resultCount} รายการ
        </span>

        {/* View switcher */}
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-900/6 p-0.5 dark:bg-white/8">
          {(['grid', 'list'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              aria-label={v === 'grid' ? 'มุมมองตาราง' : 'มุมมองรายการ'}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md transition',
                view === v
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              )}
            >
              <Icon name={v} size={14} />
            </button>
          ))}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="btn !px-2.5 !py-2 !text-xs text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
          >
            <Icon name="refresh" size={13} />
            <span className="hidden sm:inline">ล้าง</span>
          </button>
        )}
      </div>

      {/* Row 2 — expanded */}
      {expanded && (
        <div className="mt-4 animate-fade-in-up space-y-4 border-t border-slate-400/15 pt-4">
          {/* Pricing */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
              ราคา
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICING_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePricing(p)}
                  className={filters.pricing.includes(p) ? 'chip-active' : 'chip-idle'}
                >
                  {PRICING_META[p].labelTh}
                </button>
              ))}
            </div>
          </div>

          {/* Min rating */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
              คะแนนขั้นต่ำ
            </p>
            <div className="flex flex-wrap gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
                  className={filters.minRating === r ? 'chip-active' : 'chip-idle'}
                >
                  {r === 0 ? (
                    'ทั้งหมด'
                  ) : (
                    <>
                      <Icon name="star-filled" size={11} className="text-amber-400" />
                      {r}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
              แท็ก ({allTags.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={cn(
                    'rounded-md px-2 py-1 text-[11px] font-medium transition',
                    filters.tags.includes(t)
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-slate-900/6 text-slate-500 hover:bg-slate-900/12 dark:bg-white/8 dark:text-slate-400 dark:hover:bg-white/15'
                  )}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
