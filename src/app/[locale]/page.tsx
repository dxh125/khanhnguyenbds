"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProperties } from "@/lib/api";
import { Search } from "lucide-react";
import SidebarFilter from "@/components/SidebarFilter";
import PropertyCard from "@/components/PropertyCard";
import FeatureSection from "@/components/FeatureSection";
import FeaturedProjects from "@/components/FeaturedProjects";

interface Property {
  _id?: string;
  title: string;
  price: number;
  area: number;
  postedAt: string;
  propertyType: string;
  images: string[];
  status?: string;
}

export default function HomePage() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties()
      .then((data: Property[]) => setProperties(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  const parseNumber = (val: string) => parseFloat(val.replace(/[^\d.]/g, "")) || 0;

  const filtered = properties.filter((p) => {
    return (
      (!filter || p.propertyType === filter) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!priceFrom || p.price >= parseNumber(priceFrom)) &&
      (!priceTo || p.price <= parseNumber(priceTo)) &&
      (!areaFrom || p.area >= parseNumber(areaFrom)) &&
      (!areaTo || p.area <= parseNumber(areaTo))
    );
  });

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow p-4 animate-pulse space-y-3">
      <div className="bg-gray-300 h-48 w-full rounded" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-8 bg-gray-300 rounded w-full mt-2" />
    </div>
  );

  return (
    <main className="flex-1 bg-white">
      <section className="relative h-[480px] bg-cover bg-center" style={{ backgroundImage: "url('/banner.jpg')" }}>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4 text-center">
          <p className="text-sm mb-2">An tâm với 100% bất động sản xác thực tại Rever</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Lựa chọn căn nhà ưng ý của bạn</h1>
          <div className="flex gap-4 mb-4 text-lg">
            <span className="border-b-2 border-white pb-1">Mua nhà</span>
            <span className="opacity-80">Thuê nhà</span>
          </div>

          <div className="bg-white rounded-full flex items-center overflow-hidden w-full max-w-2xl">
            <Search className="text-gray-500 ml-4" />
            <input
              type="text"
              placeholder="Tìm kiếm nhà đất khu vực TP Hồ Chí Minh"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-black focus:outline-none"
            />
            <button className="bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700">
              Tìm kiếm
            </button>
          </div>

          <p className="text-sm mt-4">Hiện có <strong>177,008</strong> nhà đất xác thực</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-center text-sm">
            <span className="bg-white text-black px-3 py-1 rounded-full border">The Global City</span>
            <span className="bg-white text-black px-3 py-1 rounded-full border">Caraworld Cam Ranh</span>
            <span className="bg-white text-black px-3 py-1 rounded-full border">Eaton Park</span>
            <span className="bg-white text-black px-3 py-1 rounded-full border">LUMIÈRE Boulevard</span>
          </div>
        </div>
      </section>

      <FeatureSection />
      <FeaturedProjects />

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <SidebarFilter
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          priceFrom={priceFrom}
          setPriceFrom={setPriceFrom}
          priceTo={priceTo}
          setPriceTo={setPriceTo}
          areaFrom={areaFrom}
          setAreaFrom={setAreaFrom}
          areaTo={areaTo}
          setAreaTo={setAreaTo}
        />

        <section className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Danh sách bất động sản</h2>
            {!loading && (
              <p className="text-sm text-gray-500">Tìm thấy {filtered.length} kết quả</p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-600">Không tìm thấy bất động sản phù hợp.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
