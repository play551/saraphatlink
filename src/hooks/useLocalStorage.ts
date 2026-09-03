'use client';

import { useCallback, useEffect, useState } from 'react';
import { readLS, writeLS, isBrowser } from '@/lib/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(readLS<T>(key, initialValue));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        writeLS(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  // sync ข้ามแท็บ + ข้าม component ในแท็บเดียวกัน
  useEffect(() => {
    if (!isBrowser) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(readLS<T>(key, initialValue));
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string } | undefined;
      if (detail?.key === key || detail?.key === '*') setValue(readLS<T>(key, initialValue));
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('wdh:storage', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wdh:storage', onCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, update, hydrated];
}
