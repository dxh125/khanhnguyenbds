import { notFound } from "next/navigation";
import OverviewSection from "@/components/property/OverviewSection";
import BasicInfoSection from "@/components/property/BasicInfoSection";
import HighlightsSection from "@/components/property/HighlightsSection";
import { Property } from "@/types/property";


async function getProperty(id: string): Promise<Property | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // fallback nếu chưa cấu hình
  const res = await fetch(`${baseUrl}/api/properties/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PropertyDetail({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  if (!property) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <OverviewSection property={property} />
      <BasicInfoSection property={property} />
      <HighlightsSection highlights={property.highlights} />
    </div>
  );
}
