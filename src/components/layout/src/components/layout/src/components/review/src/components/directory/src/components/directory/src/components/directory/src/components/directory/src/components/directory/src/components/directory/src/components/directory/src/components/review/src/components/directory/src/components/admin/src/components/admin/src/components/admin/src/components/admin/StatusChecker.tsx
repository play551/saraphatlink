'use client';

import { useState } from 'react';
import { checkWebsiteStatus } from '@/lib/statusChecker';
import Button from '@/components/ui/Button';

export function StatusChecker({ siteId, url }: { siteId: string; url: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    const res = await checkWebsiteStatus(url);
    setStatus(res.online ? '🟢 ออนไลน์' : '🔴 ออฟไลน์');
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 glass rounded-lg">
      <Button size="sm" onClick={run} loading={loading}>ตรวจสอบสถานะ</Button>
      {status && <span className="text-xs font-bold">{status}</span>}
    </div>
  );
}

export default StatusChecker;
