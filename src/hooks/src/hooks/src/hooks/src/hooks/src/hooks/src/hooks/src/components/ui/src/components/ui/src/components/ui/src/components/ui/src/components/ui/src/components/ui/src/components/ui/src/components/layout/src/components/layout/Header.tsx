'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';
import Icon, { type IconName } from '@/components/ui/Icon';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onToggleSidebar?: () => void;
  query?: string;
  onQueryChange?: (q: string) => void;
  showSearch?: boolean;
}

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'หน้าแรก', icon: 'home' },
  { href: '/bookmarks', label: 'รายการโปรด', icon: 'bookmark' },
  { href: '/submit', label: 'เสนอเว็บ', icon: 'send' },
  { href: '/admin', label: 'ผู้ดูแล', icon: 'shield' },
];

export function Header({ onToggleSidebar, query = '', onQueryChange, showSearch = true }: HeaderProps) {
  const pathname = usePathname();
  const { count } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'glass-strong shadow-glass' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-3 sm:px-5 lg:px-8">
        {/* Sidebar toggle (mobile) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="เปิดเมนูหมวดหมู่"
            className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:text-brand-600 dark:text-slate-300 lg:hidden"
          >
            <Icon name="menu" size={19} />
          </button>
        )}

        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 text-white shadow-lg shadow-brand-600/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Icon name="layers" size={20} />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-[15px] font-extrabold tracking-tight text-gradient">
              WebDirectory
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-wider text-muted">
              RESOURCES HUB
            </span>
          </span>
        </Link>

        {/* Quick search */}
        {showSearch && onQueryChange && (
          <div className="relative mx-1 hidden max-w-md flex-1 md:block">
            <Icon
              name="search"
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="ค้นหาเว็บไซต์, เครื่องมือ, แท็ก…"
              className="input-field !rounded-full !py-2.5 pl-10 pr-4"
            />
          </div>
        )}

        <div className="flex-1 md:hidden" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200',
                isActive(item.href)
                  ? 'bg-brand-500/12 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
              )}
            >
              <Icon name={item.icon} size={16} />
              <span className="hidden lg:inline">{item.label}</span>
              {item.href === '/bookmarks' && count > 0 && (
                <span className="ml-0.5 rounded-full bg-accent-500 px-1.5 py-px text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <ThemeToggle />

        {/* Mobile nav toggle */}
        <button
          onClick={() => setMobileNav((v) => !v)}
          aria-label="เมนู"
          className="glass flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 md:hidden"
        >
          <Icon name={mobileNav ? 'close' : 'menu'} size={19} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileNav && (
        <div className="glass-strong animate-fade-in-up border-t border-slate-400/15 px-4 py-3 md:hidden">
          {showSearch && onQueryChange && (
            <div className="relative mb-3">
              <Icon
                name="search"
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="ค้นหา…"
                className="input-field !rounded-full pl-10"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNav(false)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold',
                  isActive(item.href)
                    ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-300'
                )}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
