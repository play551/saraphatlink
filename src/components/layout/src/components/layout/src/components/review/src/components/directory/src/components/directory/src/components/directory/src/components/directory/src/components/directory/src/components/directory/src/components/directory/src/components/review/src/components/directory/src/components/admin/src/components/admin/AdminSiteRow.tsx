'use client';

import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import { VerifiedBadge } from '@/components/ui/Badge';
import type { WebSite } from '@/types';

interface RowProps {
  site: WebSite;
  onEdit: (s: WebSite) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function AdminSiteRow({ site, onEdit, onDelete, onToggleStatus }: RowProps) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-900/4 dark:hover:bg-white/4 transition">
      <div className="h-10 w-10 shrink-0 rounded-lg bg-white p-1.5 ring-1 ring-slate-900/5">
        <img src={site.favicon} alt="" className="h-full w-full object-contain" />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold truncate">{site.name}</h4>
          {site.verified && <VerifiedBadge />}
        </div>
        <p className="text-[11px] text-muted truncate">{site.domain}</p>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => onToggleStatus(site.id)} className="btn-ghost !p-2" title="สลับสถานะ">
          <Icon name="check" size={16} className={site.verified ? 'text-emerald-500' : 'text-slate-300'} />
        </button>
        <button onClick={() => onEdit(site)} className="btn-ghost !p-2" title="แก้ไข">
          <Icon name="edit" size={16} />
        </button>
        <button onClick={() => onDelete(site.id)} className="btn-ghost !p-2 text-rose-500" title="ลบ">
          <Icon name="trash" size={16} />
        </button>
      </div>
    </div>
  );
}

export default AdminSiteRow;
