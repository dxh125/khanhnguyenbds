"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

import { fetchProperties } from "@/lib/api";
// ❌ import SidebarFilter from "@/components/SidebarFilter";
import PropertyCard from "@/components/PropertyCard";
import FeatureSection from "@/components/FeatureSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import FilterBar from "@/components/filters/FilterBar"; // ✅ dùng FilterBar

interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  postedAt: string;
  propertyType: string;
  images: string[];
  status?: string;
}

export default function HomePage() {
  const t = useTranslations("Home");

  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties()
      .then((data: Property[]) => setProperties(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

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
      {/* HERO */}
      <section
        className="relative h-[480px] bg-cover bg-center"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4 text-center">
          <p className="text-sm mb-2">{t("heroSub")}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("heroTitle")}</h1>

          <div className="flex gap-4 mb-4 text-lg">
            <span className="border-b-2 border-white pb-1">{t("buyTab")}</span>
            <span className="opacity-80">{t("rentTab")}</span>
          </div>

          <div className="bg-white rounded-full flex items-center overflow-hidden w-full max-w-2xl">
            <Search className="text-gray-500 ml-4" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-black focus:outline-none"
            />
            <button className="bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700">
              {t("searchButton")}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 justify-center text-sm">
            <span className="bg-white text-black px-3 py-1 rounded-full border">The Global City</span>
            <span className="bg-white text-black px-3 py-1 rounded-full border">Caraworld Cam Ranh</span>
            <span className="bg-white text-black px-3 py-1 rounded-full border">Eaton Park</span>
            <span className="bg-white text-black px-3 py-1 rounded-full border">LUMIÈRE Boulevard</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* ✅ FilterBar ngang: truyền initialFilters rỗng hoặc mặc định purpose nếu muốn */}
        <FilterBar initialFilters={{}} defaultPurpose="buy" defaultType="can-ho" />

        {/* Danh sách bất động sản */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{t("propertyListTitle")}</h2>
            {!loading && (
              <p className="text-sm text-gray-500">
                {t("resultFound", { count: filtered.length })}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-600">{t("noResult")}</p>
          ) : (
            // ✅ 4 cột trên màn hình lớn, vẫn responsive đẹp
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* <FeatureSection />
      <FeaturedProjects /> */}
    </main>
  );
}
