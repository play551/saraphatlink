'use client';

import { useState } from 'react';
import { cn, timeAgo } from '@/lib/utils';
import { useReviews } from '@/hooks/useReviews';
import { toast } from '@/hooks/useToast';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import RatingStars from './RatingStars';

export function ReviewSection({ siteId }: { siteId: string }) {
  const { reviews, stats, addReview, removeReview, markHelpful } = useReviews(siteId);
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.warning('กรุณาให้คะแนนดาวก่อนส่งรีวิว');
    if (comment.trim().length < 5) return toast.warning('กรุณาเขียนความเห็นอย่างน้อย 5 ตัวอักษร');

    addReview({ siteId, author, rating, comment });
    setRating(0);
    setComment('');
    setOpen(false);
    toast.success('ขอบคุณสำหรับรีวิวของคุณ!');
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="section-title !text-base">
          <Icon name="star-filled" size={17} className="text-amber-400" />
          รีวิวจากผู้ใช้
          {stats.count > 0 && (
            <span className="rounded-full bg-slate-900/8 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
              {stats.count}
            </span>
          )}
        </h3>
        <Button
          size="sm"
          variant={open ? 'ghost' : 'primary'}
          icon={open ? 'close' : 'plus'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'ยกเลิก' : 'เขียนรีวิว'}
        </Button>
      </div>

      {stats.count > 0 && (
        <div className="glass flex flex-wrap items-center gap-5 rounded-xl p-4">
          <div className="text-center">
            <p className="text-3xl font-extrabold leading-none text-slate-900 dark:text-white">
              {stats.avg.toFixed(1)}
            </p>
            <RatingStars value={stats.avg} size={13} className="mt-1.5 justify-center" />
            <p className="mt-1 text-[11px] text-muted">{stats.count} รีวิว</p>
          </div>
          <div className="min-w-[150px] flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((n) => {
              const c = stats.distribution[n - 1];
              const pct = stats.count ? (c / stats.count) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2">
                  <span className="w-3 text-[11px] font-semibold text-muted">{n}</span>
                  <Icon name="star-filled" size={10} className="text-amber-400" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-900/8 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-5 text-right text-[11px] text-muted">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form */}
      {open && (
        <form onSubmit={submit} className="glass animate-fade-in-up space-y-3 rounded-xl p-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
              ให้คะแนน <span className="text-rose-500">*</span>
            </label>
            <RatingStars value={rating} size={26} interactive onChange={setRating} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
              ชื่อของคุณ
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="ไม่ระบุชื่อ"
              maxLength={40}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
              ความคิดเห็น <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="ประสบการณ์การใช้งานเว็บนี้เป็นอย่างไรบ้าง?"
              className="input-field resize-y"
            />
            <p className="mt-1 text-right text-[10px] text-muted">{comment.length}/500</p>
          </div>
          <Button type="submit" icon="send" fullWidth>
            ส่งรีวิว
          </Button>
        </form>
      )}

      {/* List */}
      {reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          ยังไม่มีรีวิว — เป็นคนแรกที่แบ่งปันความเห็นสิ! ✨
        </p>
      ) : (
        <div className="space-y-2.5">
          {reviews.map((r) => (
            <div key={r.id} className="glass animate-fade-in-up rounded-xl p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                  {r.author.trim()[0]?.toUpperCase() || '?'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {r.author}
                    </span>
                    <RatingStars value={r.rating} size={11} />
                    <span className="text-[11px] text-muted">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {r.comment}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => markHelpful(r.id)}
                      className="flex items-center gap-1 text-[11px] font-medium text-muted transition hover:text-brand-600"
                    >
                      <Icon name="heart" size={12} />
                      มีประโยชน์ {r.helpful > 0 && `(${r.helpful})`}
                    </button>
                    <button
                      onClick={() => {
                        removeReview(r.id);
                        toast.info('ลบรีวิวแล้ว');
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-muted transition hover:text-rose-500"
                    >
                      <Icon name="trash" size={12} />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
