// app/[locale]/properties/[id]/page.tsx (đổi theo path thực tế của bạn)
import { notFound } from "next/navigation";
import OverviewSection from "@/components/property/OverviewSection";
import BasicInfoSection from "@/components/property/BasicInfoSection";
import HighlightsSection from "@/components/property/HighlightsSection";
import { Property } from "@/types/property";

type PageParams = { locale: string; id: string };

interface PageProps {
  params: Promise<PageParams>; // 👈 Next 15: Promise
}

function getBaseUrl() {
  // Ưu tiên biến môi trường trên Vercel
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getProperty(id: string): Promise<Property | null> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/properties/${id}`, {
    cache: "no-store",              // luôn lấy mới
    // next: { revalidate: 0 },     // (tuỳ chọn) tương đương no-store
  });

  if (!res.ok) return null;
  return res.json();
}
export default async function PropertyDetail({ params }: PageProps) {
  const { id } = await params;

  const property = await getProperty(id);
  if (!property) return notFound();

  // ✅ Narrow an toàn
  const highlights = Array.isArray(property.highlights) ? property.highlights : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <OverviewSection property={property} />
      <BasicInfoSection property={property} />
      {highlights.length > 0 && (
        <HighlightsSection highlights={highlights} />
      )}
    </div>
  );
}

