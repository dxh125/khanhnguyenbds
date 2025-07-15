"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Property {
  _id?: string;
  title: string;
  price: string;
  area: string;
  date: string;
  type: string;
  image: string;
  status?: string;
  ownerId?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id?.toString();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:5000/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error("Lỗi khi lấy chi tiết:", err));
  }, [id]);

  if (!property) return <div className="p-6 text-center">Đang tải thông tin bất động sản...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-96 object-cover rounded mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <p><strong>💰 Giá:</strong> {property.price}</p>
        <p><strong>📏 Diện tích:</strong> {property.area}</p>
        <p><strong>🏷️ Loại:</strong> {property.type}</p>
        <p><strong>📅 Ngày đăng:</strong> {property.date}</p>
        {property.status && <p><strong>📌 Trạng thái:</strong> {property.status}</p>}
      </div>
    </div>
  );
}
