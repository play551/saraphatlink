'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import AdminSiteRow from './AdminSiteRow';
import type { WebSite } from '@/types';

interface AdminPanelProps {
  sites: WebSite[];
  onEdit: (site: WebSite) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function AdminPanel({ sites, onEdit, onDelete, onToggleStatus }: AdminPanelProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');

  const filtered = sites.filter((s) => {
    if (filter === 'pending') return !s.verified;
    if (filter === 'verified') return s.verified;
    return true;
  });

  return (
    <div className="glass-card rounded-2xl p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-400/15 p-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon name="settings" size={17} /> จัดการเว็บไซต์ ({sites.length})
        </h2>
        <div className="flex gap-1 bg-slate-900/6 p-1 rounded-lg dark:bg-white/8">
          {(['all', 'pending', 'verified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-md transition',
                filter === f ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'
              )}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-400/15">
        {filtered.map((s) => (
          <AdminSiteRow
            key={s.id}
            site={s}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
