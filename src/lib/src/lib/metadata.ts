import type { FetchedMetadata } from '@/types';
import { extractDomain, faviconUrl, normalizeUrl, screenshotUrl, isValidUrl } from './utils';

/**
 * ────────────────────────────────────────────────────────────
 *  METADATA FETCHER (100% Client-side, ไม่ต้องมี Backend)
 *
 *  กลยุทธ์: ลองหลาย provider ตามลำดับ ถ้าเจ๊งค่อย fallback
 *   1) Microlink API  — ฟรี 50 req/วัน ไม่ต้องสมัคร คุณภาพดีสุด
 *   2) jsonlink.io    — สำรอง
 *   3) Local fallback — เดาจากโดเมน + Google favicon (ไม่มีวันพัง)
 * ────────────────────────────────────────────────────────────
 */

const TIMEOUT_MS = 9000;

async function fetchWithTimeout(url: string, ms = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, mode: 'cors' });
  } finally {
    clearTimeout(timer);
  }
}

/* ── Provider 1: Microlink ────────────────────────────────── */
async function viaMicrolink(url: string): Promise<FetchedMetadata | null> {
  try {
    const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}&palette=false`;
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.status !== 'success' || !json?.data) return null;

    const d = json.data;
    return {
      title: d.title || '',
      description: d.description || '',
      image: d.image?.url || d.screenshot?.url || '',
      favicon: d.logo?.url || faviconUrl(url),
      siteName: d.publisher || '',
      domain: extractDomain(url),
      ok: true,
    };
  } catch {
    return null;
  }
}

/* ── Provider 2: jsonlink ─────────────────────────────────── */
async function viaJsonLink(url: string): Promise<FetchedMetadata | null> {
  try {
    const endpoint = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`;
    const res = await fetchWithTimeout(endpoint, 7000);
    if (!res.ok) return null;
    const d = await res.json();
    if (!d || (!d.title && !d.description)) return null;

    return {
      title: d.title || '',
      description: d.description || '',
      image: Array.isArray(d.images) && d.images.length ? d.images[0] : '',
      favicon: d.favicon || faviconUrl(url),
      siteName: d.domain || '',
      domain: extractDomain(url),
      ok: true,
    };
  } catch {
    return null;
  }
}

/* ── Provider 3: Local fallback (ไม่มีวันพัง) ─────────────── */
function viaFallback(url: string, error?: string): FetchedMetadata {
  const domain = extractDomain(url);
  const guessName = domain
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: guessName,
    description: '',
    image: screenshotUrl(url),
    favicon: faviconUrl(url),
    siteName: guessName,
    domain,
    ok: false,
    error: error || 'ดึงข้อมูลอัตโนมัติไม่สำเร็จ — กรุณากรอกด้วยตนเอง',
  };
}

/* ── PUBLIC API ───────────────────────────────────────────── */
export async function fetchMetadata(rawUrl: string): Promise<FetchedMetadata> {
  const url = normalizeUrl(rawUrl);

  if (!isValidUrl(url)) {
    return {
      title: '',
      description: '',
      image: '',
      favicon: '',
      siteName: '',
      domain: '',
      ok: false,
      error: 'URL ไม่ถูกต้อง',
    };
  }

  const providers = [viaMicrolink, viaJsonLink];
  for (const provider of providers) {
    const result = await provider(url);
    if (result && (result.title || result.description)) {
      // เติมช่องว่างที่ provider ไม่ให้มา
      if (!result.favicon) result.favicon = faviconUrl(url);
      if (!result.image) result.image = screenshotUrl(url);
      if (!result.title) result.title = extractDomain(url);
      return result;
    }
  }

  return viaFallback(url);
}

/** ดึง metadata หลาย URL พร้อมกัน (จำกัด concurrency กัน rate-limit) */
export async function fetchMetadataBatch(
  urls: string[],
  concurrency = 3,
  onProgress?: (done: number, total: number) => void
): Promise<Map<string, FetchedMetadata>> {
  const results = new Map<string, FetchedMetadata>();
  const queue = [...urls];
  let done = 0;

  async function worker() {
    while (queue.length) {
      const u = queue.shift();
      if (!u) break;
      const meta = await fetchMetadata(u);
      results.set(u, meta);
      done += 1;
      onProgress?.(done, urls.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, urls.length) }, () => worker())
  );
  return results;
}

/** สร้าง thumbnail/favicon ให้ครบโดยไม่ต้องยิง API (ใช้ตอน render การ์ด) */
export function resolveImages(site: { url: string; favicon?: string; thumbnail?: string }) {
  return {
    favicon: site.favicon || faviconUrl(site.url),
    thumbnail: site.thumbnail || screenshotUrl(site.url),
  };
}
