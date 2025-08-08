import { notFound } from "next/navigation";
import { getProjectBySlug, getPropertiesByFilter } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";

interface Props {
  params: { locale: string; slug: string };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = params;

  const project = await getProjectBySlug(slug);
  if (!project) return notFound();

  const properties = await getPropertiesByFilter({
    project: slug,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-700 mb-6">{project.description}</p>

      <h2 className="text-xl font-semibold mb-2">Bất động sản thuộc dự án</h2>

      {properties.length === 0 ? (
        <p>Chưa có bất động sản nào thuộc dự án này.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
