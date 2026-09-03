'use client';

import { useState } from 'react';
import {
  cn,
  faviconUrl,
  screenshotUrl,
  placeholderThumb,
  copyToClipboard,
  formatDate,
  timeAgo,
} from '@/lib/utils';
import { getCategoryById, getSubCategoryById } from '@/data/categories';
import { VisitStore } from '@/lib/storage';
import { STATUS_META } from '@/lib/statusChecker';
import { toast } from '@/hooks/useToast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Icon, { type IconName } from '@/components/ui/Icon';
import { PricingBadge, StatusBadge, VerifiedBadge, FeaturedBadge } from '@/components/ui/Badge';
import RatingStars from '@/components/review/RatingStars';
import ReviewSection from '@/components/review/ReviewSection';
import type { WebSite } from '@/types';

interface SiteDetailModalProps {
  site: WebSite | null;
  onClose: () => void;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  relatedSites: WebSite[];
  onSelectRelated: (s: WebSite) => void;
}

export function SiteDetailModal({
  site,
  onClose,
  bookmarked,
  onToggleBookmark,
  relatedSites,
  onSelectRelated,
}: SiteDetailModalProps) {
  const [tab, setTab] = useState<'info' | 'reviews'>('info');
  const [imgError, setImgError] = useState(false);

  if (!site) return null;

  const category = getCategoryById(site.categoryId);
  const subCat = site.subCategoryId
    ? getSubCategoryById(site.categoryId, site.subCategoryId)
    : undefined;
  const cover = imgError
    ? placeholderThumb(site.name, 3)
    : site.thumbnail || screenshotUrl(site.url, 900);
  const visits = VisitStore.countOf(site.id);

  const handleVisit = () => {
    VisitStore.record(site.id);
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(site.url);
    ok ? toast.success('คัดลอกลิงก์แล้ว') : toast.error('คัดลอกไม่สำเร็จ');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: site.name, text: site.description, url: site.url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    handleCopy();
  };

  return (
    <Modal
      open={!!site}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <img
            src={site.favicon || faviconUrl(site.url)}
            alt=""
            className="h-8 w-8 rounded-lg bg-white object-contain p-1 ring-1 ring-slate-900/5"
          />
          <span className="min-w-0">
            <span className="block truncate">{site.name}</span>
            <span className="block truncate text-[11px] font-normal text-muted">{site.domain}</span>
          </span>
        </span>
      }
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Button icon="external" onClick={handleVisit} className="flex-1 sm:flex-none">
            เยี่ยมชมเว็บไซต์
          </Button>
          <Button variant="secondary" icon="copy" onClick={handleCopy}>
            <span className="hidden sm:inline">คัดลอกลิงก์</span>
          </Button>
          <Button variant="secondary" icon="send" onClick={handleShare}>
            <span className="hidden sm:inline">แชร์</span>
          </Button>
          <Button
            variant={bookmarked ? 'success' : 'ghost'}
            icon={bookmarked ? 'bookmark-filled' : 'bookmark'}
            onClick={() => {
              onToggleBookmark(site.id);
              toast.success(bookmarked ? 'นำออกจากรายการโปรดแล้ว' : 'บันทึกในรายการโปรดแล้ว');
            }}
          >
            <span className="hidden sm:inline">{bookmarked ? 'บันทึกแล้ว' : 'บันทึก'}</span>
          </Button>
        </div>
      }
    >
      {/* Cover */}
      <div className="relative -mx-5 -mt-5 mb-5 aspect-[2/1] overflow-hidden sm:-mx-6 sm:-mt-5">
        <img
          src={cover}
          alt={`ภาพหน้าจอของ ${site.name}`}
          className="h-full w-full object-cover object-top"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-slate-900 dark:via-slate-900/20" />
        <div className="absolute bottom-3 left-5 flex flex-wrap gap-2 sm:left-6">
          {site.featured && <FeaturedBadge />}
          {site.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
              <Icon name="check" size={11} strokeWidth={3} /> ตรวจสอบแล้ว
            </span>
          )}
          <PricingBadge pricing={site.pricing} />
          <StatusBadge status={site.linkStatus} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-900/5 p-1 dark:bg-white/8">
        {([
          { id: 'info', label: 'ข้อมูลเว็บไซต์', icon: 'info' },
          { id: 'reviews', label: 'รีวิวและคะแนน', icon: 'star' },
        ] as { id: 'info' | 'reviews'; label: string; icon: IconName }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition',
              tab === t.id
                ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            )}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'info' ? (
        <div className="space-y-5">
          {/* Rating */}
          <div className="flex flex-wrap items-center gap-4">
            <RatingStars value={site.rating} size={18} showValue count={site.ratingCount} />
            {visits > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="eye" size={13} />
                คุณเปิดดูแล้ว {visits} ครั้ง
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
              เกี่ยวกับเว็บไซต์นี้
            </h4>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {site.longDescription || site.description}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetaBox icon="layers" label="หมวดหมู่" value={category?.nameTh ?? '—'} />
            <MetaBox icon="grid" label="หมวดย่อย" value={subCat?.nameTh ?? '—'} />
            <MetaBox icon="clock" label="เพิ่มเมื่อ" value={formatDate(site.addedAt)} />
            <MetaBox
              icon="refresh"
              label="ตรวจสถานะล่าสุด"
              value={site.lastCheckedAt ? timeAgo(site.lastCheckedAt) : 'ยังไม่ตรวจ'}
            />
          </div>

          {/* Tags */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">แท็ก</h4>
            <div className="flex flex-wrap gap-1.5">
              {site.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:text-brand-300"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">ลิงก์</h4>
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2.5">
              <Icon name="globe" size={15} className="shrink-0 text-slate-400" />
              <code className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-300">
                {site.url}
              </code>
              <button
                onClick={handleCopy}
                aria-label="คัดลอก"
                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-900/8 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Icon name="copy" size={14} />
              </button>
            </div>
          </div>

          {/* Related */}
          {relatedSites.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                เว็บที่คล้ายกัน
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {relatedSites.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setTab('info');
                      setImgError(false);
                      onSelectRelated(r);
                    }}
                    className="glass group flex items-center gap-2.5 rounded-xl p-2.5 text-left transition hover:bg-white/80 dark:hover:bg-slate-700/60"
                  >
                    <img
                      src={r.favicon || faviconUrl(r.url)}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-lg bg-white object-contain p-1 ring-1 ring-slate-900/5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">
                        {r.name}
                      </span>
                      <span className="block truncate text-[10px] text-muted">{r.description}</span>
                    </span>
                    <Icon
                      name="chevron-right"
                      size={14}
                      className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <ReviewSection siteId={site.id} />
      )}
    </Modal>
  );
}

function MetaBox({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-muted">
        <Icon name={icon} size={12} />
        <span className="truncate text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default SiteDetailModal;
