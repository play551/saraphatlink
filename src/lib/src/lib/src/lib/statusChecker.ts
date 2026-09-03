import type { WebSite, StatusCheckResult, LinkStatus } from '@/types';
import { normalizeUrl } from './utils';

/**
 * ────────────────────────────────────────────────────────────
 *  LINK STATUS CHECKER (Client-side, ไม่มี Backend)
 *
 *  ปัญหา: เบราว์เซอร์บล็อก CORS ทำให้ fetch เว็บอื่นตรง ๆ ไม่ได้
 *  ทางออก 3 ชั้น:
 *   1) Image Probe   — โหลด favicon จาก Google S2 (ไม่ติด CORS เลย)
 *   2) no-cors fetch — ถ้าไม่ throw = เซิร์ฟเวอร์ตอบสนอง (opaque response)
 *   3) Proxy check   — ใช้ r.jina.ai / allorigins เป็นตัวยืนยัน HTTP code
 * ────────────────────────────────────────────────────────────
 */

const DEFAULT_TIMEOUT = 8000;

/* ── Method 1: Image Probe (เร็ว + ไม่ติด CORS) ───────────── */
function probeViaFavicon(url: string, timeout = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    const domain = (() => {
      try {
        return new URL(normalizeUrl(url)).hostname;
      } catch {
        return '';
      }
    })();
    if (!domain) return resolve(false);

    const img = new Image();
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };

    const timer = setTimeout(() => finish(false), timeout);

    img.onload = () => {
      clearTimeout(timer);
      // Google คืนไอคอน default (16x16 globe) เมื่อโดเมนตาย
      finish(img.naturalWidth > 16);
    };
    img.onerror = () => {
      clearTimeout(timer);
      finish(false);
    };

    img.referrerPolicy = 'no-referrer';
    img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      domain
    )}&sz=64&_=${Date.now()}`;
  });
}

/* ── Method 2: no-cors fetch ──────────────────────────────── */
async function probeViaNoCors(url: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    await fetch(normalizeUrl(url), {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
      redirect: 'follow',
    });
    return true; // opaque response = server ตอบกลับมา
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/* ── Method 3: Proxy (ได้ HTTP code จริง) ─────────────────── */
async function probeViaProxy(
  url: string,
  timeout = DEFAULT_TIMEOUT
): Promise<{ ok: boolean; code?: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const endpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      normalizeUrl(url)
    )}`;
    const res = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' });
    return { ok: res.ok, code: res.status };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

/* ── PUBLIC: ตรวจ 1 เว็บ ───────────────────────────────────── */
export async function checkSiteStatus(
  site: Pick<WebSite, 'id' | 'url'>,
  opts: { deep?: boolean; timeout?: number } = {}
): Promise<StatusCheckResult> {
  const start = performance.now();
  const url = normalizeUrl(site.url);
  const timeout = opts.timeout ?? DEFAULT_TIMEOUT;

  // ชั้นที่ 1
  const faviconOk = await probeViaFavicon(url, Math.min(timeout, 6000));
  if (faviconOk) {
    return {
      siteId: site.id,
      url,
      status: 'online',
      latencyMs: Math.round(performance.now() - start),
      checkedAt: new Date().toISOString(),
      message: 'ตรวจผ่าน favicon probe',
    };
  }

  // ชั้นที่ 2
  const noCorsOk = await probeViaNoCors(url, timeout);
  if (noCorsOk) {
    return {
      siteId: site.id,
      url,
      status: 'online',
      latencyMs: Math.round(performance.now() - start),
      checkedAt: new Date().toISOString(),
      message: 'ตรวจผ่าน no-cors request',
    };
  }

  // ชั้นที่ 3 (เฉพาะโหมด deep เพราะช้ากว่า)
  if (opts.deep) {
    const proxy = await probeViaProxy(url, timeout);
    if (proxy.ok) {
      return {
        siteId: site.id,
        url,
        status: 'online',
        httpCode: proxy.code,
        latencyMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
        message: `ตรวจผ่าน proxy (HTTP ${proxy.code})`,
      };
    }
    return {
      siteId: site.id,
      url,
      status: 'offline',
      httpCode: proxy.code,
      latencyMs: Math.round(performance.now() - start),
      checkedAt: new Date().toISOString(),
      message: 'ไม่ตอบสนองทุกวิธีตรวจสอบ',
    };
  }

  return {
    siteId: site.id,
    url,
    status: 'unknown',
    latencyMs: Math.round(performance.now() - start),
    checkedAt: new Date().toISOString(),
    message: 'ตรวจไม่ได้จากฝั่งเบราว์เซอร์ (อาจถูก CORS บล็อก)',
  };
}

/* ── PUBLIC: ตรวจทั้งหมดแบบ batch พร้อม progress ──────────── */
export interface BatchCheckOptions {
  concurrency?: number;
  deep?: boolean;
  timeout?: number;
  onResult?: (result: StatusCheckResult) => void;
  onProgress?: (done: number, total: number) => void;
  signal?: { aborted: boolean };
}

export async function checkAllSites(
  sites: Pick<WebSite, 'id' | 'url'>[],
  options: BatchCheckOptions = {}
): Promise<StatusCheckResult[]> {
  const {
    concurrency = 5,
    deep = false,
    timeout = DEFAULT_TIMEOUT,
    onResult,
    onProgress,
    signal,
  } = options;

  const queue = [...sites];
  const results: StatusCheckResult[] = [];
  let done = 0;

  async function worker() {
    while (queue.length) {
      if (signal?.aborted) return;
      const site = queue.shift();
      if (!site) break;
      const r = await checkSiteStatus(site, { deep, timeout });
      results.push(r);
      onResult?.(r);
      done += 1;
      onProgress?.(done, sites.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, sites.length || 1) }, () => worker())
  );
  return results;
}

/* ── UI Meta ──────────────────────────────────────────────── */
export const STATUS_META: Record<
  LinkStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  online: {
    label: 'ใช้งานได้',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/15 ring-1 ring-emerald-500/30',
  },
  offline: {
    label: 'เข้าไม่ได้',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-500/15 ring-1 ring-rose-500/30',
  },
  checking: {
    label: 'กำลังตรวจ',
    dot: 'bg-amber-500 animate-pulse',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-500/15 ring-1 ring-amber-500/30',
  },
  unknown: {
    label: 'ยังไม่ตรวจ',
    dot: 'bg-slate-400',
    text: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-500/12 ring-1 ring-slate-500/25',
  },
};
