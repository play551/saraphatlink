import type { PricingType, WebSite, FilterState, SortKey } from '@/types';

/* ════════════════════════════════════════════════════════════
   CLASSNAME MERGER (เบา ๆ ไม่ต้องพึ่ง clsx)
   ════════════════════════════════════════════════════════════ */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* ════════════════════════════════════════════════════════════
   BASE PATH HELPER (สำคัญมากสำหรับ GitHub Pages)
   ════════════════════════════════════════════════════════════ */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** สร้าง path ที่ถูกต้องทั้งบน Vercel (basePath="") และ GH Pages (basePath="/repo") */
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}

/* ════════════════════════════════════════════════════════════
   URL / DOMAIN UTILITIES
   ════════════════════════════════════════════════════════════ */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function extractDomain(url: string): string {
  try {
    const u = new URL(normalizeUrl(url));
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0];
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(normalizeUrl(url));
    return (
      (u.protocol === 'http:' || u.protocol === 'https:') &&
      u.hostname.includes('.') &&
      u.hostname.length > 3
    );
  } catch {
    return false;
  }
}

/** favicon จาก Google S2 — ฟรี ไม่ต้องมี API key ไม่ติด CORS */
export function faviconUrl(url: string, size: 32 | 64 | 128 = 64): string {
  const domain = extractDomain(url);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

/** ภาพหน้าปกอัตโนมัติ — ใช้ screenshot service ฟรีแบบไม่ต้องสมัคร */
export function screenshotUrl(url: string, width = 640): string {
  const target = encodeURIComponent(normalizeUrl(url));
  return `https://api.microlink.io/?url=${target}&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2&viewport.width=${width}&viewport.height=${Math.round(
    width * 0.6
  )}`;
}

/** fallback: การ์ดสีไล่เฉดพร้อมตัวอักษรแรก (data-URI SVG ไม่ต้องโหลดเน็ต) */
export function placeholderThumb(name: string, seed = 0): string {
  const palettes = [
    ['#3182ff', '#7c3aed'],
    ['#d946ef', '#f43f5e'],
    ['#06b6d4', '#3b82f6'],
    ['#f59e0b', '#ef4444'],
    ['#10b981', '#14b8a6'],
    ['#8b5cf6', '#ec4899'],
  ];
  const idx = (hashCode(name) + seed) % palettes.length;
  const [c1, c2] = palettes[idx];
  const letter = (name.trim()[0] || '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="384">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
</linearGradient></defs>
<rect width="640" height="384" fill="url(#g)"/>
<text x="50%" y="50%" font-family="system-ui,sans-serif" font-size="150" font-weight="800"
 fill="rgba(255,255,255,0.92)" text-anchor="middle" dominant-baseline="central">${letter}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/* ════════════════════════════════════════════════════════════
   ID / DATE / TEXT
   ════════════════════════════════════════════════════════════ */
export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function formatDate(iso?: string, locale = 'th-TH'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function timeAgo(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return '—';
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return 'เมื่อครู่';
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} วันที่แล้ว`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} เดือนที่แล้ว`;
  return `${Math.floor(diff / 31536000)} ปีที่แล้ว`;
}

export function truncate(text: string, max = 120): string {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/* ════════════════════════════════════════════════════════════
   PRICING META
   ════════════════════════════════════════════════════════════ */
export const PRICING_META: Record<
  PricingType,
  { label: string; labelTh: string; classes: string }
> = {
  free: {
    label: 'Free',
    labelTh: 'ฟรี',
    classes: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  },
  freemium: {
    label: 'Freemium',
    labelTh: 'ฟรี/เสียเงิน',
    classes: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/30',
  },
  paid: {
    label: 'Paid',
    labelTh: 'เสียเงิน',
    classes: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
  },
  opensource: {
    label: 'Open Source',
    labelTh: 'โอเพนซอร์ส',
    classes: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500/30',
  },
};

export const PRICING_OPTIONS: PricingType[] = ['free', 'freemium', 'paid', 'opensource'];

/* ════════════════════════════════════════════════════════════
   SEARCH / FILTER / SORT ENGINE
   ════════════════════════════════════════════════════════════ */

/** ให้คะแนนความเกี่ยวข้อง ยิ่งสูงยิ่งตรง (0 = ไม่ตรงเลย) */
export function scoreMatch(site: WebSite, q: string): number {
  const query = q.trim().toLowerCase();
  if (!query) return 1;

  const terms = query.split(/\s+/).filter(Boolean);
  const name = site.name.toLowerCase();
  const desc = site.description.toLowerCase();
  const domain = site.domain.toLowerCase();
  const tags = site.tags.join(' ').toLowerCase();
  const long = (site.longDescription || '').toLowerCase();

  let total = 0;
  for (const t of terms) {
    let s = 0;
    if (name === t) s += 200;
    else if (name.startsWith(t)) s += 120;
    else if (name.includes(t)) s += 80;

    if (domain.includes(t)) s += 50;
    if (tags.includes(t)) s += 35;
    if (desc.includes(t)) s += 20;
    if (long.includes(t)) s += 8;

    if (s === 0) return 0; // ต้องตรงทุก term (AND)
    total += s;
  }
  return total + site.popularity / 100;
}

export function applyFilters(sites: WebSite[], f: FilterState): WebSite[] {
  const scored = sites
    .filter((s) => s.status === 'approved')
    .filter((s) => (f.categoryId === 'all' ? true : s.categoryId === f.categoryId))
    .filter((s) => (f.subCategoryId === 'all' ? true : s.subCategoryId === f.subCategoryId))
    .filter((s) => (f.pricing.length === 0 ? true : f.pricing.includes(s.pricing)))
    .filter((s) => s.rating >= f.minRating)
    .filter((s) => (f.onlyVerified ? s.verified : true))
    .filter((s) => (f.onlyOnline ? s.linkStatus !== 'offline' : true))
    .filter((s) => (f.tags.length === 0 ? true : f.tags.every((t) => s.tags.includes(t))))
    .map((s) => ({ site: s, score: scoreMatch(s, f.query) }))
    .filter((x) => x.score > 0);

  if (f.query.trim() && f.sort === 'popularity') {
    scored.sort((a, b) => b.score - a.score);
    return scored.map((x) => x.site);
  }

  return sortSites(
    scored.map((x) => x.site),
    f.sort
  );
}

export function sortSites(sites: WebSite[], key: SortKey): WebSite[] {
  const arr = [...sites];
  switch (key) {
    case 'popularity':
      return arr.sort((a, b) => b.popularity - a.popularity || b.rating - a.rating);
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
    case 'newest':
      return arr.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name, 'th'));
    case 'visits':
      return arr.sort((a, b) => b.ratingCount - a.ratingCount);
    default:
      return arr;
  }
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popularity', label: 'ยอดนิยม' },
  { value: 'rating', label: 'คะแนนสูงสุด' },
  { value: 'newest', label: 'เพิ่มล่าสุด' },
  { value: 'name-asc', label: 'ชื่อ A → Z' },
  { value: 'name-desc', label: 'ชื่อ Z → A' },
];

/* ════════════════════════════════════════════════════════════
   WEB OF THE DAY (deterministic — เปลี่ยนวันละครั้ง ไม่สุ่มมั่ว)
   ════════════════════════════════════════════════════════════ */
export function pickWebOfTheDay(sites: WebSite[]): WebSite | null {
  const pool = sites.filter((s) => s.status === 'approved' && s.popularity >= 70);
  if (pool.length === 0) return sites[0] ?? null;
  const today = new Date();
  const dayKey =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return pool[dayKey % pool.length];
}

export function pickTrending(sites: WebSite[], limit = 8): WebSite[] {
  return [...sites]
    .filter((s) => s.status === 'approved')
    .sort((a, b) => {
      const wa = a.popularity * 0.6 + a.rating * 8 + (a.featured ? 12 : 0);
      const wb = b.popularity * 0.6 + b.rating * 8 + (b.featured ? 12 : 0);
      return wb - wa;
    })
    .slice(0, limit);
}

/* ════════════════════════════════════════════════════════════
   MISC
   ════════════════════════════════════════════════════════════ */
export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 250) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readJSONFile<T = unknown>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as T);
      } catch (e) {
        reject(new Error('ไฟล์ JSON ไม่ถูกต้อง'));
      }
    };
    reader.onerror = () => reject(new Error('อ่านไฟล์ไม่สำเร็จ'));
    reader.readAsText(file, 'utf-8');
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
