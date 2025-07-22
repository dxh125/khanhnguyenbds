"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Property {
  _id: string;
  title: string;
  price: number;
  area: number;
  postedAt: string;
  propertyType: string;
  images: string[];
  status?: string;
  userId?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/properties/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy dữ liệu");
        return res.json();
      })
      .then((data: Property) => setProperty(data))
      .catch((err) => console.error("Lỗi khi lấy chi tiết BĐS:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center">Đang tải thông tin bất động sản...</div>;
  if (!property) return <div className="p-6 text-center text-red-600">Không tìm thấy bất động sản</div>;

  const formattedDate = new Date(property.postedAt).toLocaleDateString("vi-VN");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <img
        src={property.images?.length ? property.images[0] : "/placeholder.jpg"}
        alt={property.title}
        className="w-full h-96 object-cover rounded mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
        <p><strong>💰 Giá:</strong> {property.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
        <p><strong>📏 Diện tích:</strong> {property.area} m²</p>
        <p><strong>🏷️ Loại:</strong> {property.propertyType}</p>
        <p><strong>📅 Ngày đăng:</strong> {formattedDate}</p>
        {property.status && <p><strong>📌 Trạng thái:</strong> {property.status}</p>}
      </div>
    </div>
  );
}
