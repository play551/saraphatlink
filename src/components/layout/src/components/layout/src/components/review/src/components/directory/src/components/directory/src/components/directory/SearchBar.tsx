'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn, faviconUrl } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import type { WebSite } from '@/types';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  sites: WebSite[];
  onSelectSite: (site: WebSite) => void;
  resultCount: number;
}

const RECENT_KEY = 'wdh:recentSearch:v1';

export function SearchBar({ value, onChange, sites, onSelectSite, resultCount }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Load recent searches */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  /* Keyboard shortcut: "/" or Ctrl+K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Close on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return sites
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.domain.toLowerCase().includes(q) ||
          s.tags.some((t) => t.includes(q))
      )
      .slice(0, 6);
  }, [value, sites]);

  const saveRecent = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focused || suggestions.length === 0) {
      if (e.key === 'Enter') saveRecent(value);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (cursor >= 0) {
        onSelectSite(suggestions[cursor]);
        setFocused(false);
      }
      saveRecent(value);
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const showPanel = focused && (suggestions.length > 0 || (!value && recent.length > 0));

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={cn(
          'glass flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300',
          focused && 'ring-4 ring-brand-500/15 shadow-glow-brand'
        )}
      >
        <Icon name="search" size={19} className="shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setCursor(-1);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="ค้นหาเว็บไซต์ เครื่องมือ หรือแท็ก… (กด / เพื่อค้นหา)"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          aria-label="ค้นหาเว็บไซต์"
        />
        {value && (
          <>
            <span className="hidden shrink-0 rounded-full bg-brand-500/12 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-300 sm:inline">
              {resultCount} ผลลัพธ์
            </span>
            <button
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              aria-label="ล้างคำค้นหา"
              className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-900/8 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Icon name="close" size={16} />
            </button>
          </>
        )}
        {!value && (
          <kbd className="hidden shrink-0 rounded-md border border-slate-400/30 px-1.5 py-0.5 text-[10px] font-semibold text-muted sm:block">
            /
          </kbd>
        )}
      </div>

      {/* Suggestion panel */}
      {showPanel && (
        <div className="glass-strong absolute left-0 right-0 top-full z-40 mt-2 animate-fade-in-up overflow-hidden rounded-2xl">
          {suggestions.length > 0 ? (
            <>
              <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                ผลลัพธ์ที่ตรงที่สุด
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => {
                    onSelectSite(s);
                    saveRecent(value);
                    setFocused(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition',
                    cursor === i ? 'bg-brand-500/10' : 'hover:bg-slate-900/5 dark:hover:bg-white/8'
                  )}
                >
                  <img
                    src={s.favicon || faviconUrl(s.url)}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-md bg-white object-contain p-0.5 ring-1 ring-slate-900/5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {s.name}
                    </span>
                    <span className="block truncate text-[11px] text-muted">{s.description}</span>
                  </span>
                  <Icon name="chevron-right" size={15} className="shrink-0 text-slate-400" />
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 pb-1 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  ค้นหาล่าสุด
                </p>
                <button
                  onClick={() => {
                    setRecent([]);
                    localStorage.removeItem(RECENT_KEY);
                  }}
                  className="text-[11px] font-medium text-muted transition hover:text-rose-500"
                >
                  ล้าง
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-3">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => onChange(r)}
                    className="chip-idle"
                  >
                    <Icon name="clock" size={11} />
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
