'use client';

import React from 'react';
import { cn, PRICING_META } from '@/lib/utils';
import { STATUS_META } from '@/lib/statusChecker';
import type { PricingType, LinkStatus } from '@/types';
import Icon from './Icon';

/* ── Generic Badge ────────────────────────────────────────── */
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Pricing Badge ────────────────────────────────────────── */
export function PricingBadge({ pricing }: { pricing: PricingType }) {
  const meta = PRICING_META[pricing];
  return <Badge className={meta.classes}>{meta.labelTh}</Badge>;
}

/* ── Link Status Badge ────────────────────────────────────── */
export function StatusBadge({
  status,
  showLabel = true,
}: {
  status: LinkStatus;
  showLabel?: boolean;
}) {
  const meta = STATUS_META[status];
  return (
    <Badge className={cn(meta.bg, meta.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
      {showLabel && meta.label}
    </Badge>
  );
}

/* ── Verified Badge ───────────────────────────────────────── */
export function VerifiedBadge() {
  return (
    <span
      title="ตรวจสอบแล้ว"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm"
    >
      <Icon name="check" size={12} strokeWidth={3} />
    </span>
  );
}

/* ── Featured Badge ───────────────────────────────────────── */
export function FeaturedBadge() {
  return (
    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shadow-orange-500/30">
      <Icon name="fire" size={11} />
      แนะนำ
    </Badge>
  );
}

export default Badge;
