'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Review } from '@/types';
import { ReviewStore, isBrowser } from '@/lib/storage';
import { uid, nowISO } from '@/lib/utils';

export function useReviews(siteId?: string) {
  const [all, setAll] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAll(ReviewStore.get());
    setHydrated(true);

    if (!isBrowser) return;
    const sync = () => setAll(ReviewStore.get());
    window.addEventListener('wdh:storage', sync);
    return () => window.removeEventListener('wdh:storage', sync);
  }, []);

  const reviews = useMemo(
    () =>
      (siteId ? all.filter((r) => r.siteId === siteId) : all).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [all, siteId]
  );

  const addReview = useCallback(
    (input: { siteId: string; author: string; rating: number; comment: string }) => {
      const review: Review = {
        id: uid('rev'),
        siteId: input.siteId,
        author: input.author.trim() || 'ผู้ใช้ไม่ระบุชื่อ',
        rating: Math.min(5, Math.max(1, Math.round(input.rating))),
        comment: input.comment.trim(),
        createdAt: nowISO(),
        helpful: 0,
      };
      setAll(ReviewStore.add(review));
      return review;
    },
    []
  );

  const removeReview = useCallback((id: string) => setAll(ReviewStore.remove(id)), []);

  const markHelpful = useCallback((id: string) => {
    const next = ReviewStore.get().map((r) =>
      r.id === id ? { ...r, helpful: r.helpful + 1 } : r
    );
    ReviewStore.set(next);
    setAll(next);
  }, []);

  /** คะแนนเฉลี่ยจากรีวิวผู้ใช้ผสมกับคะแนน seed */
  const computeBlendedRating = useCallback(
    (targetId: string, seedRating: number, seedCount: number) => {
      const list = all.filter((r) => r.siteId === targetId);
      if (list.length === 0) return { rating: seedRating, count: seedCount };
      const userSum = list.reduce((s, r) => s + r.rating, 0);
      const total = seedRating * seedCount + userSum;
      const count = seedCount + list.length;
      return { rating: Math.round((total / count) * 10) / 10, count };
    },
    [all]
  );

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => (dist[r.rating - 1] += 1));
    return {
      avg: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10,
      count: reviews.length,
      distribution: dist,
    };
  }, [reviews]);

  return { reviews, all, stats, addReview, removeReview, markHelpful, computeBlendedRating, hydrated };
}
