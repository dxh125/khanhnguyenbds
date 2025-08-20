"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  _id?: string;
  name: string;
  location: string;
  price: string;
  image: string;
  label: string;
  labelColor: string;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/projects")
      .then((res) => setProjects(res.data as Project[]))
      .catch((err) => console.error("Lỗi khi lấy danh sách dự án:", err));
  }, []);

  if (projects.length === 0) {
    return (
      <section className="py-12 bg-white text-center text-gray-500">
        Đang tải danh sách dự án nổi bật...
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Dự án nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="relative rounded-lg overflow-hidden shadow-md group"
            >
              <img
                src={project.image || "/default-project.jpg"}
                alt={project.name}
                className="w-full h-60 object-cover transition duration-300 group-hover:scale-105"
              />
              <div
                className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded ${project.labelColor}`}
              >
                {project.label}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm">{project.location}</p>
                <p className="text-sm font-medium mt-1">Giá: {project.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
