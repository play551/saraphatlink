'use client';

import { useState } from 'react';
import {
  cn,
  faviconUrl,
  screenshotUrl,
  placeholderThumb,
  copyToClipboard,
  timeAgo,
} from '@/lib/utils';
import { getCategoryById } from '@/data/categories';
import { VisitStore } from '@/lib/storage';
import { toast } from '@/hooks/useToast';
import Icon, { type IconName } from '@/components/ui/Icon';
import { PricingBadge, StatusBadge, VerifiedBadge, FeaturedBadge } from '@/components/ui/Badge';
import RatingStars from '@/components/review/RatingStars';
import type { WebSite, ViewMode } from '@/types';

interface WebCardProps {
  site: WebSite;
  view?: ViewMode;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenDetail: (site: WebSite) => void;
  index?: number;
}

export function WebCard({
  site,
  view = 'grid',
  bookmarked,
  onToggleBookmark,
  onOpenDetail,
  index = 0,
}: WebCardProps) {
  const [thumbError, setThumbError] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const category = getCategoryById(site.categoryId);

  const thumb = thumbError
    ? placeholderThumb(site.name, index)
    : site.thumbnail || screenshotUrl(site.url);

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    VisitStore.record(site.id);
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(site.url);
    ok ? toast.success(`คัดลอกลิงก์ ${site.name} แล้ว`) : toast.error('คัดลอกไม่สำเร็จ');
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(site.id);
    toast.success(bookmarked ? `นำ ${site.name} ออกจากรายการโปรด` : `บันทึก ${site.name} แล้ว`);
  };

  /* ══════════════ LIST VIEW ══════════════ */
  if (view === 'list') {
    return (
      <article
        onClick={() => onOpenDetail(site)}
        className="glass-card card-shine group flex cursor-pointer items-center gap-4 p-3.5 animate-fade-in-up"
        style={{ animationDelay: `${Math.min(index * 35, 400)}ms` }}
      >
        <img
          src={site.favicon || faviconUrl(site.url)}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          className="h-11 w-11 shrink-0 rounded-xl bg-white object-contain p-1.5 shadow-sm ring-1 ring-slate-900/5"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderThumb(site.name, index);
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {site.name}
            </h3>
            {site.verified && <VerifiedBadge />}
            {site.featured && <FeaturedBadge />}
            <PricingBadge pricing={site.pricing} />
          </div>
          <p className="mt-1 line-clamp-2-safe text-xs leading-relaxed text-muted">
            {site.description}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <RatingStars value={site.rating} size={12} showValue count={site.ratingCount} />
            {category && (
              <span className="flex items-center gap-1 text-[11px] text-muted">
                <span className={cn('h-2 w-2 rounded-full bg-gradient-to-br', category.color)} />
                {category.nameTh}
              </span>
            )}
            <span className="hidden text-[11px] text-muted sm:inline">{site.domain}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <IconBtn name="copy" label="คัดลอกลิงก์" onClick={handleCopy} />
          <IconBtn
            name={bookmarked ? 'bookmark-filled' : 'bookmark'}
            label="รายการโปรด"
            active={bookmarked}
            onClick={handleBookmark}
          />
          <button
            onClick={handleVisit}
            className="btn-primary !px-3 !py-2 !text-xs"
            aria-label={`เปิด ${site.name}`}
          >
            <Icon name="external" size={14} />
            <span className="hidden sm:inline">เปิด</span>
          </button>
        </div>
      </article>
    );
  }

  /* ══════════════ GRID VIEW ══════════════ */
  return (
    <article
      onClick={() => onOpenDetail(site)}
      className="glass-card card-shine group flex cursor-pointer flex-col overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 45, 500)}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200/60 dark:bg-slate-800/60">
        {!thumbLoaded && <div className="absolute inset-0 skeleton rounded-none" />}
        <img
          src={thumb}
          alt={`ภาพหน้าจอของ ${site.name}`}
          loading="lazy"
          className={cn(
            'h-full w-full object-cover object-top transition-all duration-500',
            'group-hover:scale-[1.06]',
            thumbLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setThumbLoaded(true)}
          onError={() => {
            setThumbError(true);
            setThumbLoaded(true);
          }}
        />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent opacity-80" />

        {/* Top badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {site.featured && <FeaturedBadge />}
          <StatusBadge status={site.linkStatus} showLabel={false} />
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          aria-label={bookmarked ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
          className={cn(
            'absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg',
            'backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95',
            bookmarked
              ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/40'
              : 'bg-white/25 text-white hover:bg-white/40'
          )}
        >
          <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={15} />
        </button>

        {/* Category chip */}
        {category && (
          <span
            className={cn(
              'absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full',
              'bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold text-white shadow-md',
              category.color
            )}
          >
            <Icon name={category.icon as IconName} size={11} />
            {category.nameTh}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <img
            src={site.favicon || faviconUrl(site.url)}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1 shadow-sm ring-1 ring-slate-900/5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[15px] font-bold leading-tight text-slate-900 dark:text-white">
                {site.name}
              </h3>
              {site.verified && <VerifiedBadge />}
            </div>
            <p className="truncate text-[11px] text-muted">{site.domain}</p>
          </div>
          <PricingBadge pricing={site.pricing} />
        </div>

        <p className="mt-3 line-clamp-3-safe flex-1 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          {site.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {site.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-900/6 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-white/8 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
          {site.tags.length > 3 && (
            <span className="rounded-md px-1 py-0.5 text-[10px] font-medium text-muted">
              +{site.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-400/15 pt-3">
          <RatingStars value={site.rating} size={13} showValue count={site.ratingCount} />
          <div className="flex items-center gap-1">
            <IconBtn name="copy" label="คัดลอกลิงก์" onClick={handleCopy} small />
            <button
              onClick={handleVisit}
              className="btn-primary !px-3 !py-1.5 !text-[11px]"
              aria-label={`เปิดเว็บ ${site.name}`}
            >
              <Icon name="external" size={13} />
              เยี่ยมชม
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Small icon button ────────────────────────────────────── */
function IconBtn({
  name,
  label,
  onClick,
  active = false,
  small = false,
}: {
  name: IconName;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95',
        small ? 'h-7 w-7' : 'h-9 w-9',
        active
          ? 'bg-accent-500/15 text-accent-600 dark:text-accent-400'
          : 'text-slate-400 hover:bg-slate-900/8 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white'
      )}
    >
      <Icon name={name} size={small ? 13 : 16} />
    </button>
  );
}

export default WebCard;
