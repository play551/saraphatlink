// ── src/lib/dataProvider.ts ──────────────────────────────────
import type { DataProvider, WebSite, Review, Submission } from '@/types';
import { SitesStore, ReviewStore, SubmissionStore } from './storage';
import { nowISO } from './utils';

export const localProvider: DataProvider = {
  name: 'local',

  async getSites() {
    return SitesStore.get();
  },
  async getSiteById(id) {
    return SitesStore.get().find((s) => s.id === id) ?? null;
  },
  async createSite(site) {
    const next = [site, ...SitesStore.get()];
    SitesStore.set(next);
    return site;
  },
  async updateSite(id, patch) {
    const cur = SitesStore.get();
    let updated: WebSite | null = null;
    const next = cur.map((s) => {
      if (s.id !== id) return s;
      updated = { ...s, ...patch, updatedAt: nowISO() };
      return updated;
    });
    SitesStore.set(next);
    return updated;
  },
  async deleteSite(id) {
    const cur = SitesStore.get();
    const next = cur.filter((s) => s.id !== id);
    SitesStore.set(next);
    return next.length !== cur.length;
  },

  async getSubmissions() {
    return SubmissionStore.get();
  },
  async createSubmission(s) {
    SubmissionStore.add(s);
    return s;
  },
  async updateSubmission(id, patch) {
    const cur = SubmissionStore.get();
    let updated: Submission | null = null;
    const next = cur.map((s) => {
      if (s.id !== id) return s;
      updated = { ...s, ...patch };
      return updated;
    });
    SubmissionStore.set(next);
    return updated;
  },
  async deleteSubmission(id) {
    const before = SubmissionStore.get().length;
    const after = SubmissionStore.remove(id).length;
    return after !== before;
  },

  async getReviews(siteId) {
    return siteId ? ReviewStore.bySite(siteId) : ReviewStore.get();
  },
  async createReview(r: Review) {
    ReviewStore.add(r);
    return r;
  },
  async deleteReview(id) {
    const before = ReviewStore.get().length;
    const after = ReviewStore.remove(id).length;
    return after !== before;
  },
};

/**
 * จุดสลับ Provider เดียวในระบบ
 * วันไหนอยากใช้ Supabase: import supabaseProvider แล้วเปลี่ยนบรรทัดนี้บรรทัดเดียวจบ
 */
export const dataProvider: DataProvider = localProvider;
