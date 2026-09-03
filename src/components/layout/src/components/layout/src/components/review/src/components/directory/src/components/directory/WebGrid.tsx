'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { GridSkeleton } from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import WebCard from './WebCard';
import type { WebSite, ViewMode } from '@/types';

interface WebGridProps {
  sites: WebSite[];
  loading?: boolean;
  view: ViewMode;
  bookmarkIds: string[];
  onToggleBookmark: (id: string) => void;
  onOpenDetail: (site: WebSite) => void;
  onResetFilters?: () => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyHint?: string;
}

export function WebGrid({
  sites,
  loading = false,
  view,
  bookmarkIds,
  onToggleBookmark,
  onOpenDetail,
  onResetFilters,
  pageSize = 24,
  emptyTitle = 'ไม่พบเว็บไซต์ที่ตรงกับเงื่อนไข',
  emptyHint = 'ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองแล้วลองใหม่อีกครั้ง',
}: WebGridProps) {
  const [visible, setVisible] = useState(pageSize);

  const shown = useMemo(() => sites.slice(0, visible), [sites, visible]);
  const hasMore = visible < sites.length;

  if (loading) return <GridSkeleton count={8} />;

  /* ── Empty state ───────────────────────────────────────── */
  if (sites.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-400">
          <Icon name="search" size={30} />
        </span>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{emptyTitle}</h3>
        <p className="max-w-sm text-sm text-muted">{emptyHint}</p>
        {onResetFilters && (
          <Button variant="secondary" icon="refresh" onClick={onResetFilters} className="mt-2">
            ล้างตัวกรองทั้งหมด
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
            : 'flex flex-col gap-3'
        )}
      >
        {shown.map((site, i) => (
          <WebCard
            key={site.id}
            site={site}
            view={view}
            index={i}
            bookmarked={bookmarkIds.includes(site.id)}
            onToggleBookmark={onToggleBookmark}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            variant="secondary"
            icon="chevron-down"
            onClick={() => setVisible((v) => v + pageSize)}
          >
            โหลดเพิ่มอีก {Math.min(pageSize, sites.length - visible)} รายการ
          </Button>
          <p className="text-xs text-muted">
            แสดง {shown.length} จาก {sites.length} รายการ
          </p>
        </div>
      )}
    </div>
  );
}

export default WebGrid;
