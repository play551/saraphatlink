// ════════════════════════════════════════════════════════════════
//  CORE DOMAIN TYPES
// ════════════════════════════════════════════════════════════════

export type PricingType = 'free' | 'freemium' | 'paid' | 'opensource';

export type LinkStatus = 'online' | 'offline' | 'unknown' | 'checking';

export type SiteStatus = 'approved' | 'pending' | 'rejected';

export type SortKey =
  | 'popularity'
  | 'rating'
  | 'newest'
  | 'name-asc'
  | 'name-desc'
  | 'visits';

export type ViewMode = 'grid' | 'list';

export type ThemeMode = 'light' | 'dark' | 'system';

// ════════════════════════════════════════════════════════════════
//  CATEGORY
// ════════════════════════════════════════════════════════════════

export interface SubCategory {
  id: string;
  name: string;
  nameTh: string;
}

export interface Category {
  id: string;
  name: string;
  nameTh: string;
  /** ชื่อไอคอนภายใน (map ใน components/ui/Icon) */
  icon: string;
  /** Tailwind gradient classes เช่น "from-blue-500 to-cyan-500" */
  color: string;
  description: string;
  subCategories: SubCategory[];
}

// ════════════════════════════════════════════════════════════════
//  WEBSITE ENTRY
// ════════════════════════════════════════════════════════════════

export interface WebSite {
  id: string;
  name: string;
  url: string;
  /** โดเมนสะอาด เช่น "github.com" */
  domain: string;
  description: string;
  longDescription?: string;

  categoryId: string;
  subCategoryId?: string;
  tags: string[];

  pricing: PricingType;
  /** 0–100 */
  popularity: number;
  /** 0–5 ค่าเฉลี่ยเริ่มต้น (seed) */
  rating: number;
  ratingCount: number;

  /** URL รูป favicon — ถ้าเว้นว่างระบบจะ generate อัตโนมัติ */
  favicon?: string;
  /** URL ภาพหน้าปก — ถ้าเว้นว่างระบบจะใช้ screenshot service */
  thumbnail?: string;

  featured: boolean;
  verified: boolean;
  status: SiteStatus;

  /** ISO date string */
  addedAt: string;
  updatedAt?: string;

  linkStatus: LinkStatus;
  lastCheckedAt?: string;
  httpCode?: number;

  language?: string;
  submittedBy?: string;
}

// ════════════════════════════════════════════════════════════════
//  USER-GENERATED CONTENT
// ════════════════════════════════════════════════════════════════

export interface Review {
  id: string;
  siteId: string;
  author: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  tags: string[];
  pricing: PricingType;
  submitterName: string;
  submitterEmail: string;
  note?: string;
  createdAt: string;
  status: SiteStatus;
  favicon?: string;
  thumbnail?: string;
}

export interface VisitRecord {
  siteId: string;
  count: number;
  lastVisitedAt: string;
}

// ════════════════════════════════════════════════════════════════
//  FILTERS / SEARCH
// ════════════════════════════════════════════════════════════════

export interface FilterState {
  query: string;
  categoryId: string | 'all';
  subCategoryId: string | 'all';
  pricing: PricingType[] | [];
  minRating: number;
  tags: string[];
  onlyVerified: boolean;
  onlyOnline: boolean;
  sort: SortKey;
}

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  categoryId: 'all',
  subCategoryId: 'all',
  pricing: [],
  minRating: 0,
  tags: [],
  onlyVerified: false,
  onlyOnline: false,
  sort: 'popularity',
};

// ════════════════════════════════════════════════════════════════
//  METADATA FETCHER
// ════════════════════════════════════════════════════════════════

export interface FetchedMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  siteName: string;
  domain: string;
  ok: boolean;
  error?: string;
}

// ════════════════════════════════════════════════════════════════
//  LINK STATUS CHECKER
// ════════════════════════════════════════════════════════════════

export interface StatusCheckResult {
  siteId: string;
  url: string;
  status: LinkStatus;
  httpCode?: number;
  latencyMs: number;
  checkedAt: string;
  message?: string;
}

export interface StatusCheckProgress {
  total: number;
  done: number;
  online: number;
  offline: number;
  running: boolean;
}

// ════════════════════════════════════════════════════════════════
//  EXPORT / IMPORT BUNDLE
// ════════════════════════════════════════════════════════════════

export interface ExportBundle {
  version: string;
  exportedAt: string;
  sites: WebSite[];
  submissions: Submission[];
  reviews: Review[];
  bookmarks: string[];
  visits: VisitRecord[];
}

// ════════════════════════════════════════════════════════════════
//  DATA PROVIDER INTERFACE (พร้อมสลับไป Supabase ภายหลัง)
// ════════════════════════════════════════════════════════════════

export interface DataProvider {
  name: 'local' | 'supabase';

  getSites(): Promise<WebSite[]>;
  getSiteById(id: string): Promise<WebSite | null>;
  createSite(site: WebSite): Promise<WebSite>;
  updateSite(id: string, patch: Partial<WebSite>): Promise<WebSite | null>;
  deleteSite(id: string): Promise<boolean>;

  getSubmissions(): Promise<Submission[]>;
  createSubmission(s: Submission): Promise<Submission>;
  updateSubmission(id: string, patch: Partial<Submission>): Promise<Submission | null>;
  deleteSubmission(id: string): Promise<boolean>;

  getReviews(siteId?: string): Promise<Review[]>;
  createReview(r: Review): Promise<Review>;
  deleteReview(id: string): Promise<boolean>;
}

// ════════════════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════════════════

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  }
