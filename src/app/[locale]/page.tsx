"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";

import { fetchProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/filters/FilterBar";

// nạp SearchBar ở client
const SearchBar = dynamic(() => import("@/components/search/SearchBar"), {
  ssr: false,
});

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
  const locale = useLocale();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties()
      .then((data: Property[]) => setProperties(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("heroTitle")}
          </h1>

          <div className="flex gap-4 mb-4 text-lg">
            <span className="border-b-2 border-white pb-1">{t("buyTab")}</span>
            <span className="opacity-80">{t("rentTab")}</span>
          </div>

          {/* ✅ Thay input cũ bằng SearchBar, redirect sang trang listing mặc định */}
          <div className="w-full max-w-2xl">
            <SearchBar
              placeholder={t("searchPlaceholder")}
              shape="pill"
              redirectTo={`/${locale}/search`}
            />
          </div>

          {/* Gợi ý nhanh: click sẽ dẫn tới trang listing kèm q=... */}
          <div className="mt-2 flex flex-wrap gap-2 justify-center text-sm">
            {[
              "The Global City",
              "Caraworld Cam Ranh",
              "Eaton Park",
              "LUMIÈRE Boulevard",
            ].map((kw) => (
              <a
                key={kw}
                href={`/${locale}/buy/can-ho?q=${encodeURIComponent(kw)}`}
                className="bg-white text-black px-3 py-1 rounded-full border hover:bg-gray-100"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* FilterBar ngang */}
        <FilterBar
          initialFilters={{}}
          defaultPurpose="buy"
          defaultType="can-ho"
        />

        {/* Danh sách bất động sản (trang chủ chỉ hiển thị gợi ý mới nhất) */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{t("propertyListTitle")}</h2>
            {!loading && (
              <p className="text-sm text-gray-500">
                {t("resultFound", { count: properties.length })}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <p className="text-gray-600">{t("noResult")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
