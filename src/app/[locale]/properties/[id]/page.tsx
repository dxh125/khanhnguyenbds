// app/[locale]/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import OverviewSection from "@/components/property/OverviewSection";
import BasicInfoSection from "@/components/property/BasicInfoSection";
import HighlightsSection from "@/components/property/HighlightsSection";
import { getPropertyById } from "@/lib/queries";
import { Property } from "@/types/property";

type PageParams = { locale: string; id: string };

interface PageProps {
  params: Promise<PageParams>; // Next 15: Promise
}

// Tránh pre-render SSG cố thu thập dữ liệu → ép SSR
export const dynamic = "force-dynamic"; // hoặc: export const revalidate = 0;

export default async function PropertyDetail({ params }: PageProps) {
  const { id } = await params;

  const property = (await getPropertyById(id)) as Property | null;
  if (!property) return notFound();

  const highlights = Array.isArray(property.highlights) ? property.highlights : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <OverviewSection property={property} />
      <BasicInfoSection property={property} />
      {highlights.length > 0 && <HighlightsSection highlights={highlights} />}
    </div>
  );
}
