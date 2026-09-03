import { useState, useMemo } from 'react';
import type { WebSite, FilterState } from '@/types';

export function useFilter(initialSites: WebSite[]) {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    pricing: [],
    tags: [],
    minRating: 0,
    sort: 'newest',
    onlyVerified: false,
    onlyOnline: false,
  });

  const filtered = useMemo(() => {
    return initialSites.filter((s) => {
      if (filters.query && !s.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.pricing.length && !filters.pricing.includes(s.pricing)) return false;
      if (filters.tags.length && !filters.tags.every((t) => s.tags.includes(t))) return false;
      if (s.rating < filters.minRating) return false;
      if (filters.onlyVerified && !s.verified) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sort === 'rating') return b.rating - a.rating;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [initialSites, filters]);

  const activeCount = Object.entries(filters).filter(([k, v]) => 
    k !== 'query' && k !== 'sort' && (Array.isArray(v) ? v.length > 0 : v !== false && v !== 0)
  ).length;

  return { filters, setFilters, filtered, activeCount };
}
