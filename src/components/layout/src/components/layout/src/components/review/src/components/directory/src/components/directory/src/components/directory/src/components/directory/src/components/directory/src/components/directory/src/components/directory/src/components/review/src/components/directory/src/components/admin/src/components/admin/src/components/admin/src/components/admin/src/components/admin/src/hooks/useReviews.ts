import { useState, useEffect } from 'react';
import type { Review } from '@/types';

export function useReviews(siteId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // โหลดจาก localStorage ตาม siteId
    const data = localStorage.getItem(`reviews:${siteId}`);
    if (data) setReviews(JSON.parse(data));
  }, [siteId]);

  const stats = {
    count: reviews.length,
    avg: reviews.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0,
    distribution: [1, 2, 3, 4, 5].map((n) => reviews.filter((r) => Math.round(r.rating) === n).length),
  };

  const addReview = (newReview: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const review: Review = {
      ...newReview,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews:${siteId}`, JSON.stringify(updated));
  };

  const removeReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    localStorage.setItem(`reviews:${siteId}`, JSON.stringify(updated));
  };

  const markHelpful = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
    setReviews(updated);
    localStorage.setItem(`reviews:${siteId}`, JSON.stringify(updated));
  };

  return { reviews, stats, addReview, removeReview, markHelpful };
}
