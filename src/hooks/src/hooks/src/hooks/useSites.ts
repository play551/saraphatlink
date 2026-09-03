'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WebSite, FilterState, StatusCheckResult } from '@/types';
import { DEFAULT_FILTERS } from '@/types';
import { SEED_SITES, SEED_VERSION } from '@/data/sites';
import { SitesStore, readLS, writeLS, STORAGE_KEYS } from '@/lib/storage';
import { applyFilters, nowISO, withBasePath } from '@/lib/utils';

/**
 * โหลดข้อมูลตามลำดับความสำคัญ:
 *  1) LocalStorage (ที่ผู้ใช้/แอดมินแก้ไว้)
 *  2) public/data/sites.json (override layer จาก GitHub)
 *  3) SEED_SITES (ฝังในโค้ด)
 */
export function useSites() {
  const [sites, setSites] = useState<WebSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  /* ── Bootstrap ─────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = SitesStore.get();
      const storedVersion = readLS<string>(STORAGE_KEYS.seedVersion, '');

      if (stored.length > 0 && storedVersion === SEED_VERSION) {
        if (!cancelled) {
          setSites(stored);
          setLoading(false);
        }
        return;
      }

      // ลองโหลด override JSON จาก GitHub
      let remote: WebSite[] = [];
      try {
        const res = await fetch(withBasePath('/data/sites.json'), { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.sites) && json.sites.length > 0) remote = json.sites;
        }
      } catch {
        /* ไม่มีไฟล์ก็ไม่เป็นไร */
      }

      const merged = remote.length > 0 ? mergeSites(SEED_SITES, remote) : SEED_SITES;

      if (!cancelled) {
        setSites(merged);
        SitesStore.set(merged);
        writeLS(STORAGE_KEYS.seedVersion, SEED_VERSION);
        setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Persist ───────────────────────────────────────────── */
  const persist = useCallback((next: WebSite[]) => {
    setSites(next);
    SitesStore.set(next);
  }, []);

  /* ── CRUD ──────────────────────────────────────────────── */
  const addSite = useCallback(
    (site: WebSite) => persist([site, ...SitesStore.get()]),
    [persist]
  );

  const updateSite = useCallback(
    (id: string, patch: Partial<WebSite>) =>
      persist(
        SitesStore.get().map((s) => (s.id === id ? { ...s, ...patch, updatedAt: nowISO() } : s))
      ),
    [persist]
  );

  const deleteSite = useCallback(
    (id: string) => persist(SitesStore.get().filter((s) => s.id !== id)),
    [persist]
  );

  const bulkUpdateStatus = useCallback(
    (results: StatusCheckResult[]) => {
      const map = new Map(results.map((r) => [r.siteId, r]));
      persist(
        SitesStore.get().map((s) => {
          const r = map.get(s.id);
          if (!r) return s;
          return { ...s, linkStatus: r.status, lastCheckedAt: r.checkedAt, httpCode: r.httpCode };
        })
      );
    },
    [persist]
  );

  const resetToSeed = useCallback(() => {
    persist(SEED_SITES);
    writeLS(STORAGE_KEYS.seedVersion, SEED_VERSION);
  }, [persist]);

  /* ── Derived ───────────────────────────────────────────── */
  const approved = useMemo(() => sites.filter((s) => s.status === 'approved'), [sites]);
  const filtered = useMemo(() => applyFilters(sites, filters), [sites, filters]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    approved.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [approved]);

  const categoryCounts = useMemo(
    () =>
      approved.reduce<Record<string, number>>((acc, s) => {
        acc[s.categoryId] = (acc[s.categoryId] ?? 0) + 1;
        return acc;
      }, {}),
    [approved]
  );

  const stats = useMemo(
    () => ({
      total: sites.length,
      approved: approved.length,
      pending: sites.filter((s) => s.status === 'pending').length,
      online: sites.filter((s) => s.linkStatus === 'online').length,
      offline: sites.filter((s) => s.linkStatus === 'offline').length,
      unchecked: sites.filter((s) => s.linkStatus === 'unknown').length,
      featured: sites.filter((s) => s.featured).length,
      avgRating:
        approved.length > 0
          ? approved.reduce((sum, s) => sum + s.rating, 0) / approved.length
          : 0,
    }),
    [sites, approved]
  );

  /* ── Filter helpers ────────────────────────────────────── */
  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), []);
  const setCategory = useCallback(
    (categoryId: string) =>
      setFilters((f) => ({ ...f, categoryId, subCategoryId: 'all' })),
    []
  );
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.categoryId !== 'all') n++;
    if (filters.subCategoryId !== 'all') n++;
    if (filters.pricing.length) n++;
    if (filters.minRating > 0) n++;
    if (filters.tags.length) n++;
    if (filters.onlyVerified) n++;
    if (filters.onlyOnline) n++;
    return n;
  }, [filters]);

  return {
    sites,
    approved,
    filtered,
    loading,
    filters,
    setFilters,
    setQuery,
    setCategory,
    resetFilters,
    activeFilterCount,
    allTags,
    categoryCounts,
    stats,
    addSite,
    updateSite,
    deleteSite,
    bulkUpdateStatus,
    resetToSeed,
    persist,
  };
}

/** รวมข้อมูล: remote ทับ seed ตาม id, ของใหม่ที่ไม่มีใน seed ก็เพิ่มเข้าไป */
function mergeSites(seed: WebSite[], remote: WebSite[]): WebSite[] {
  const map = new Map(seed.map((s) => [s.id, s]));
  remote.forEach((r) => map.set(r.id, { ...map.get(r.id), ...r } as WebSite));
  return Array.from(map.values());
}
