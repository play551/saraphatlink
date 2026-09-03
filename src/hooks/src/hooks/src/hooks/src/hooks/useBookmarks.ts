'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookmarkStore, isBrowser } from '@/lib/storage';

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(BookmarkStore.get());
    setHydrated(true);

    if (!isBrowser) return;
    const sync = () => setIds(BookmarkStore.get());
    window.addEventListener('wdh:storage', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('wdh:storage', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const next = BookmarkStore.toggle(id);
    setIds(next);
    return next.includes(id);
  }, []);

  const isBookmarked = useCallback((id: string) => ids.includes(id), [ids]);

  const clear = useCallback(() => {
    BookmarkStore.set([]);
    setIds([]);
  }, []);

  return { ids, count: ids.length, toggle, isBookmarked, clear, hydrated };
}
