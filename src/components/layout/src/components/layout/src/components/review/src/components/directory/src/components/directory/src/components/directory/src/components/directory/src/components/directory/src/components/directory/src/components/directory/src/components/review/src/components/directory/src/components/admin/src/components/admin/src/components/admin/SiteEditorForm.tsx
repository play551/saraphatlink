'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { WebSite } from '@/types';

export function SiteEditorForm({ initial, onSubmit }: { initial?: WebSite; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState(initial || { name: '', url: '', description: '', tags: [] });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="ชื่อเว็บไซต์"
        className="input-field w-full"
        required
      />
      <input
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
        placeholder="URL"
        className="input-field w-full"
        required
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="คำอธิบาย"
        className="input-field w-full h-24"
        required
      />
      <Button type="submit" fullWidth>บันทึกการเปลี่ยนแปลง</Button>
    </form>
  );
}

export default SiteEditorForm;
