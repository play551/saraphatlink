'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import Icon from '@/components/ui/Icon';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-400/15">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg">
                <Icon name="layers" size={18} />
              </span>
              <span className="text-base font-extrabold text-gradient">WebDirectory Hub</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              ศูนย์รวมเว็บไซต์และเครื่องมือยอดนิยมจากทั่วโลก คัดสรรอย่างมีคุณภาพ
              จัดหมวดหมู่ชัดเจน ค้นหาง่าย ใช้งานฟรี 100%
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="shield" size={13} />
              ข้อมูลทั้งหมดเก็บในเครื่องคุณ ไม่มีการส่งออกภายนอก
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              หมวดหมู่ยอดนิยม
            </h3>
            <ul className="space-y-1.5">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/?category=${c.id}`}
                    className="text-sm text-muted transition hover:text-brand-600 dark:hover:text-brand-300"
                  >
                    {c.nameTh}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              เมนู
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/" className="text-sm text-muted transition hover:text-brand-600">หน้าแรก</Link></li>
              <li><Link href="/bookmarks" className="text-sm text-muted transition hover:text-brand-600">รายการโปรด</Link></li>
              <li><Link href="/submit" className="text-sm text-muted transition hover:text-brand-600">เสนอเว็บไซต์</Link></li>
              <li><Link href="/admin" className="text-sm text-muted transition hover:text-brand-600">แดชบอร์ดผู้ดูแล</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider my-7" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <p>© {year} WebDirectory Hub — สร้างด้วย Next.js + Tailwind CSS</p>
          <p className="flex items-center gap-1.5">
            <Icon name="heart" size={13} className="text-rose-500" />
            Open Source & Free Forever
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
