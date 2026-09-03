'use client';

import { cn, faviconUrl, screenshotUrl, placeholderThumb } from '@/lib/utils';
import { getCategoryById } from '@/data/categories';
import { VisitStore } from '@/lib/storage';
import Icon, { type IconName } from '@/components/ui/Icon';
import { PricingBadge, VerifiedBadge } from '@/components/ui/Badge';
import RatingStars from '@/components/review/RatingStars';
import { useState } from 'react';
import type { WebSite } from '@/types';

interface WebOfTheDayProps {
  site: WebSite | null;
  onOpenDetail: (s: WebSite) => void;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export function WebOfTheDay({
  site,
  onOpenDetail,
  bookmarked,
  onToggleBookmark,
}: WebOfTheDayProps) {
  const [imgError, setImgError] = useState(false);

  if (!site) return null;

  const category = getCategoryById(site.categoryId);
  const cover = imgError ? placeholderThumb(site.name, 7) : site.thumbnail || screenshotUrl(site.url, 900);

  return (
    <section className="glass-card card-shine relative overflow-hidden p-0 animate-fade-in-up">
      {/* Ribbon */}
      <div className="absolute left-0 top-0 z-20">
        <div className="flex items-center gap-1.5 rounded-br-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg">
          <Icon name="sparkles" size={14} />
          เว็บแห่งวัน
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden lg:col-span-2 lg:aspect-auto">
          <img
            src={cover}
            alt={`ภาพหน้าจอของ ${site.name}`}
            className="h-full w-full object-cover object-top"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/85 dark:to-slate-900/85 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-900/90 lg:hidden" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center gap-4 p-5 sm:p-7 lg:col-span-3">
          <div className="flex items-start gap-4">
            <img
              src={site.favicon || faviconUrl(site.url)}
              alt=""
              className="h-14 w-14 shrink-0 rounded-2xl bg-white object-contain p-2 shadow-lg ring-1 ring-slate-900/5 animate-float"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {site.name}
                </h2>
                {site.verified && <VerifiedBadge />}
                <PricingBadge pricing={site.pricing} />
              </div>
              <p className="mt-0.5 text-xs text-muted">{site.domain}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {site.longDescription || site.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <RatingStars value={site.rating} size={15} showValue count={site.ratingCount} />
            {category && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-1 text-[11px] font-bold text-white shadow-sm',
                  category.color
                )}
              >
                <Icon name={category.icon as IconName} size={11} />
                {category.nameTh}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {site.tags.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-md bg-slate-900/6 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400"
              >
                #{t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => VisitStore.record(site.id)}
              className="btn-primary !px-5"
            >
              <Icon name="external" size={16} />
              เยี่ยมชมเว็บไซต์
            </a>
            <button onClick={() => onOpenDetail(site)} className="btn-secondary">
              <Icon name="eye" size={16} />
              ดูรายละเอียด
            </button>
            <button
              onClick={() => onToggleBookmark(site.id)}
              className={cn('btn-ghost', bookmarked && 'text-accent-600 dark:text-accent-400')}
              aria-label="รายการโปรด"
            >
              <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WebOfTheDay;
