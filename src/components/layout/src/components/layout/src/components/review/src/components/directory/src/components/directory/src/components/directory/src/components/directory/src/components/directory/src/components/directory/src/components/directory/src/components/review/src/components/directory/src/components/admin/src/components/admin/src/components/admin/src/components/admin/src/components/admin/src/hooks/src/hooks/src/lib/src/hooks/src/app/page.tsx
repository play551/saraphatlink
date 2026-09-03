import { Hero } from '@/components/home/Hero';
import { SiteGrid } from '@/components/home/SiteGrid';
import { FilterBar } from '@/components/home/FilterBar';
import { getAllSites } from '@/lib/db'; // สมมติว่ามี function ดึงข้อมูลจากไฟล์ JSON

export default async function HomePage() {
  const sites = await getAllSites();

  return (
    <main className="min-h-screen pt-20">
      <Hero />
      <div className="container py-12">
        <FilterBar />
        <SiteGrid sites={sites} />
      </div>
    </main>
  );
}
