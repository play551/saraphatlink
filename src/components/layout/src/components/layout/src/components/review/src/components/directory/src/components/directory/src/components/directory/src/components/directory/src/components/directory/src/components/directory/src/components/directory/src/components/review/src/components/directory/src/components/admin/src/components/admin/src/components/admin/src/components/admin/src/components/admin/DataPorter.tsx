'use client';

import Button from '@/components/ui/Button';
import { toast } from '@/hooks/useToast';

export function DataPorter() {
  const exportData = () => {
    const data = localStorage.getItem('sites-db');
    const blob = new Blob([data || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-export.json';
    a.click();
    toast.success('ส่งออกข้อมูลแล้ว');
  };

  return (
    <div className="glass p-4 rounded-xl space-y-3">
      <h3 className="font-bold text-sm">การจัดการข้อมูล (Data)</h3>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={exportData}>Export JSON</Button>
      </div>
    </div>
  );
}

export default DataPorter;
