import { getAllProjects } from "@/lib/queries";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách dự án</h1>

      {projects.length === 0 ? (
        <p>Chưa có dự án nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block p-4 border rounded hover:shadow transition-all bg-white"
            >
              <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
