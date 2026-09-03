import { SiteHeader } from '@/components/site/SiteHeader';
import { ReviewSection } from '@/components/site/ReviewSection';
import { getSiteById } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function SitePage({ params }: { params: { id: string } }) {
  const site = await getSiteById(params.id);
  if (!site) notFound();

  return (
    <div className="container py-12 max-w-4xl">
      <SiteHeader site={site} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <ReviewSection siteId={site.id} />
        </div>
        <aside>
          {/* ข้อมูลเสริม/Sidebar */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-4">ข้อมูลเพิ่มเติม</h3>
            <p className="text-sm text-muted">{site.description}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
