"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PropertyCard from "@/src/components/PropertyCard";

interface Property {
  _id?: string;
  title: string;
  price: string;
  area: string;
  date: string;
  type: string;
  image: string;
  status?: string;
  ownerId: string;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Bạn cần đăng nhập để xem tin của mình.");
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(user);
    setUserId(parsed.id);
  }, [router]);

  const fetchMyProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/properties");
      const data: Property[] = res.data;
      const mine = data.filter((p) => p.ownerId === userId);
      setProperties(mine);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchMyProperties();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá tin này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyProperties();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      alert("Không thể xoá tin.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tin của tôi</h1>
      {properties.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có tin đăng nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="relative">
              <PropertyCard property={property} />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => router.push(`/edit/${property._id}`)}
                  className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(property._id!)}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
