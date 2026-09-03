import type {
  WebSite,
  Review,
  Submission,
  VisitRecord,
  ExportBundle,
  ThemeMode,
} from '@/types';

/* ════════════════════════════════════════════════════════════
   KEYS
   ════════════════════════════════════════════════════════════ */
export const STORAGE_KEYS = {
  sites: 'wdh:sites:v1',
  bookmarks: 'wdh:bookmarks:v1',
  reviews: 'wdh:reviews:v1',
  submissions: 'wdh:submissions:v1',
  visits: 'wdh:visits:v1',
  theme: 'wdh:theme:v1',
  adminAuth: 'wdh:admin:v1',
  seedVersion: 'wdh:seedVersion:v1',
  view: 'wdh:view:v1',
} as const;

export const isBrowser = typeof window !== 'undefined';

/* ════════════════════════════════════════════════════════════
   LOW-LEVEL SAFE ACCESS
   ════════════════════════════════════════════════════════════ */
export function readLS<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] read failed: ${key}`, err);
    return fallback;
  }
}

export function writeLS<T>(key: string, value: T): boolean {
  if (!isBrowser) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('wdh:storage', { detail: { key } }));
    return true;
  } catch (err) {
    console.warn(`[storage] write failed: ${key}`, err);
    return false;
  }
}

export function removeLS(key: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('wdh:storage', { detail: { key } }));
  } catch {
    /* noop */
  }
}

export function clearAllAppData(): void {
  if (!isBrowser) return;
  Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent('wdh:storage', { detail: { key: '*' } }));
}

/* ════════════════════════════════════════════════════════════
   TYPED ACCESSORS
   ════════════════════════════════════════════════════════════ */
export const SitesStore = {
  get: (): WebSite[] => readLS<WebSite[]>(STORAGE_KEYS.sites, []),
  set: (sites: WebSite[]) => writeLS(STORAGE_KEYS.sites, sites),
  clear: () => removeLS(STORAGE_KEYS.sites),
};

export const BookmarkStore = {
  get: (): string[] => readLS<string[]>(STORAGE_KEYS.bookmarks, []),
  set: (ids: string[]) => writeLS(STORAGE_KEYS.bookmarks, ids),
  toggle: (id: string): string[] => {
    const cur = BookmarkStore.get();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    BookmarkStore.set(next);
    return next;
  },
  has: (id: string): boolean => BookmarkStore.get().includes(id),
};

export const ReviewStore = {
  get: (): Review[] => readLS<Review[]>(STORAGE_KEYS.reviews, []),
  set: (r: Review[]) => writeLS(STORAGE_KEYS.reviews, r),
  bySite: (siteId: string): Review[] =>
    ReviewStore.get()
      .filter((r) => r.siteId === siteId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  add: (review: Review): Review[] => {
    const next = [review, ...ReviewStore.get()];
    ReviewStore.set(next);
    return next;
  },
  remove: (id: string): Review[] => {
    const next = ReviewStore.get().filter((r) => r.id !== id);
    ReviewStore.set(next);
    return next;
  },
};

export const SubmissionStore = {
  get: (): Submission[] => readLS<Submission[]>(STORAGE_KEYS.submissions, []),
  set: (s: Submission[]) => writeLS(STORAGE_KEYS.submissions, s),
  add: (s: Submission): Submission[] => {
    const next = [s, ...SubmissionStore.get()];
    SubmissionStore.set(next);
    return next;
  },
  remove: (id: string): Submission[] => {
    const next = SubmissionStore.get().filter((x) => x.id !== id);
    SubmissionStore.set(next);
    return next;
  },
};

export const VisitStore = {
  get: (): VisitRecord[] => readLS<VisitRecord[]>(STORAGE_KEYS.visits, []),
  set: (v: VisitRecord[]) => writeLS(STORAGE_KEYS.visits, v),
  record: (siteId: string): VisitRecord[] => {
    const cur = VisitStore.get();
    const found = cur.find((v) => v.siteId === siteId);
    const next = found
      ? cur.map((v) =>
          v.siteId === siteId
            ? { ...v, count: v.count + 1, lastVisitedAt: new Date().toISOString() }
            : v
        )
      : [...cur, { siteId, count: 1, lastVisitedAt: new Date().toISOString() }];
    VisitStore.set(next);
    return next;
  },
  countOf: (siteId: string): number =>
    VisitStore.get().find((v) => v.siteId === siteId)?.count ?? 0,
};

export const ThemeStore = {
  get: (): ThemeMode => readLS<ThemeMode>(STORAGE_KEYS.theme, 'system'),
  set: (t: ThemeMode) => writeLS(STORAGE_KEYS.theme, t),
};

export const AdminStore = {
  isAuthed: (): boolean => readLS<boolean>(STORAGE_KEYS.adminAuth, false),
  login: () => writeLS(STORAGE_KEYS.adminAuth, true),
  logout: () => removeLS(STORAGE_KEYS.adminAuth),
};

/* ════════════════════════════════════════════════════════════
   EXPORT / IMPORT BUNDLE
   ════════════════════════════════════════════════════════════ */
export function buildExportBundle(sites: WebSite[]): ExportBundle {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    sites,
    submissions: SubmissionStore.get(),
    reviews: ReviewStore.get(),
    bookmarks: BookmarkStore.get(),
    visits: VisitStore.get(),
  };
}

export interface ImportResult {
  ok: boolean;
  message: string;
  counts?: { sites: number; reviews: number; submissions: number; bookmarks: number };
}

export function applyImportBundle(raw: unknown): ImportResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'ไฟล์ไม่ใช่ JSON object ที่ถูกต้อง' };
  }
  const b = raw as Partial<ExportBundle>;
  if (!Array.isArray(b.sites)) {
    return { ok: false, message: 'ไม่พบฟิลด์ "sites" ที่เป็น array ในไฟล์' };
  }

  const validSites = b.sites.filter(
    (s) => s && typeof s.id === 'string' && typeof s.url === 'string' && typeof s.name === 'string'
  );
  if (validSites.length === 0) {
    return { ok: false, message: 'ไม่พบรายการเว็บไซต์ที่ถูกต้องในไฟล์' };
  }

  SitesStore.set(validSites);
  if (Array.isArray(b.reviews)) ReviewStore.set(b.reviews);
  if (Array.isArray(b.submissions)) SubmissionStore.set(b.submissions);
  if (Array.isArray(b.bookmarks)) BookmarkStore.set(b.bookmarks);
  if (Array.isArray(b.visits)) VisitStore.set(b.visits);

  return {
    ok: true,
    message: `นำเข้าสำเร็จ ${validSites.length} เว็บไซต์`,
    counts: {
      sites: validSites.length,
      reviews: b.reviews?.length ?? 0,
      submissions: b.submissions?.length ?? 0,
      bookmarks: b.bookmarks?.length ?? 0,
    },
  };
}

/* ════════════════════════════════════════════════════════════
   STORAGE USAGE (แสดงใน Admin)
   ════════════════════════════════════════════════════════════ */
export function getStorageUsage(): { bytes: number; readable: string } {
  if (!isBrowser) return { bytes: 0, readable: '0 B' };
  let bytes = 0;
  Object.values(STORAGE_KEYS).forEach((k) => {
    const v = window.localStorage.getItem(k);
    if (v) bytes += new Blob([v]).size;
  });
  const readable =
    bytes < 1024
      ? `${bytes} B`
      : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return { bytes, readable };
                }
