// ── src/lib/supabaseAdapter.ts ───────────────────────────────
import type { DataProvider } from '@/types';

/**
 * ────────────────────────────────────────────────────────────
 *  SUPABASE ADAPTER (โครงพร้อมใช้ — ยังไม่เปิดใช้งาน)
 *
 *  วิธีเปิดใช้:
 *   1) npm i @supabase/supabase-js
 *   2) ตั้ง env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   3) uncomment โค้ดด้านล่าง
 *   4) แก้ dataProvider.ts ให้ export supabaseProvider แทน localProvider
 *
 *  SQL Schema:
 *  ─────────────────────────────────────────────────────────
 *  create table sites (
 *    id text primary key,
 *    name text not null,
 *    url text not null,
 *    domain text not null,
 *    description text,
 *    long_description text,
 *    category_id text not null,
 *    sub_category_id text,
 *    tags text[] default '{}',
 *    pricing text not null default 'free',
 *    popularity int default 50,
 *    rating numeric default 0,
 *    rating_count int default 0,
 *    favicon text, thumbnail text,
 *    featured bool default false,
 *    verified bool default false,
 *    status text default 'pending',
 *    added_at timestamptz default now(),
 *    updated_at timestamptz,
 *    link_status text default 'unknown',
 *    last_checked_at timestamptz,
 *    http_code int
 *  );
 *  alter table sites enable row level security;
 *  create policy "public read approved" on sites
 *    for select using (status = 'approved');
 * ────────────────────────────────────────────────────────────
 */

// import { createClient } from '@supabase/supabase-js';
//
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
//
// export const supabaseProvider: DataProvider = {
//   name: 'supabase',
//   async getSites() {
//     const { data, error } = await supabase.from('sites').select('*');
//     if (error) throw error;
//     return (data ?? []) as any;
//   },
//   async getSiteById(id) {
//     const { data } = await supabase.from('sites').select('*').eq('id', id).single();
//     return (data ?? null) as any;
//   },
//   async createSite(site) {
//     const { data, error } = await supabase.from('sites').insert(site).select().single();
//     if (error) throw error;
//     return data as any;
//   },
//   async updateSite(id, patch) {
//     const { data } = await supabase.from('sites').update(patch).eq('id', id).select().single();
//     return (data ?? null) as any;
//   },
//   async deleteSite(id) {
//     const { error } = await supabase.from('sites').delete().eq('id', id);
//     return !error;
//   },
//   async getSubmissions() { const { data } = await supabase.from('submissions').select('*'); return (data ?? []) as any; },
//   async createSubmission(s) { const { data } = await supabase.from('submissions').insert(s).select().single(); return data as any; },
//   async updateSubmission(id, patch) { const { data } = await supabase.from('submissions').update(patch).eq('id', id).select().single(); return (data ?? null) as any; },
//   async deleteSubmission(id) { const { error } = await supabase.from('submissions').delete().eq('id', id); return !error; },
//   async getReviews(siteId) {
//     let q = supabase.from('reviews').select('*');
//     if (siteId) q = q.eq('site_id', siteId);
//     const { data } = await q; return (data ?? []) as any;
//   },
//   async createReview(r) { const { data } = await supabase.from('reviews').insert(r).select().single(); return data as any; },
//   async deleteReview(id) { const { error } = await supabase.from('reviews').delete().eq('id', id); return !error; },
// };

export {};
