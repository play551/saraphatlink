'use client';

import { AdminPanel } from '@/components/admin/AdminPanel';
import { useSites } from '@/hooks/useSites'; // สมมติว่ามี hook จัดการ data

export default function AdminDashboard() {
  const { sites, toggleStatus, deleteSite } = useSites();

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <AdminPanel 
        sites={sites} 
        onToggleStatus={toggleStatus} 
        onDelete={deleteSite}
        onEdit={(s) => console.log('Edit', s)}
      />
    </div>
  );
}
