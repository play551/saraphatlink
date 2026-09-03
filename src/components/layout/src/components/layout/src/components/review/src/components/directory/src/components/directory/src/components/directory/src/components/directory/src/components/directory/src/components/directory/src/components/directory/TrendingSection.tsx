'use client';

import { useRef } from 'react';
import { cn, faviconUrl } from '@/lib/utils';
import { getCategoryById } from '@/data/categories';
import Icon from '@/components/ui/Icon';
import RatingStars from '@/components/review/RatingStars';
import type { WebSite } from '@/types';

interface TrendingSectionProps {
  sites: WebSite[];
  onOpenDetail: (s: WebSite) => void;
}

export function TrendingSection({ sites, onOpenDetail }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (sites.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md">
            <Icon name="fire" size={16} />
          </span>
          กำลังมาแรง
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="เลื่อนซ้าย"
            className="glass flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:text-brand-600"
          >
            <Icon name="chevron-right" size={15} className="rotate-180" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="เลื่อนขวา"
            className="glass flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:text-brand-600"
          >
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      >
        {sites.map((s, i) => {
          const cat = getCategoryById(s.categoryId);
          return (
            <button
              key={s.id}
              onClick={() => onOpenDetail(s)}
              className="glass-card group flex w-[240px] shrink-0 snap-start items-center gap-3 p-3 text-left animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="relative shrink-0">
                <img
                  src={s.favicon || faviconUrl(s.url)}
                  alt=""
                  className="h-10 w-10 rounded-xl bg-white object-contain p-1.5 shadow-sm ring-1 ring-slate-900/5"
                />
                <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-[10px] font-extrabold text-white shadow">
                  {i + 1}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                  {s.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5">
                  <RatingStars value={s.rating} size={10} />
                  {cat && (
                    <span
                      className={cn('h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br', cat.color)}
                    />
                  )}
                  <span className="truncate text-[10px] text-muted">{cat?.nameTh}</span>
                </span>
              </span>
              <Icon
                name="chevron-right"
                size={15}
                className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default TrendingSection;
