// components/search/SearchBar.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Suggestion = {
  id: string;
  title: string;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  propertyType?: string | null;
};

interface Props {
  placeholder?: string;
  className?: string;
  /** Nếu set, khi submit sẽ chuyển tới path này thay vì path hiện tại */
  redirectTo?: string;
  /** Thêm các query cố định khi submit (ví dụ purpose, type...) */
  extraParams?: Record<string, string | number | boolean>;
  /** Tuỳ biến bo góc cho hero */
  shape?: "pill" | "rounded";
}

function useDebounce<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({
  placeholder = "Tìm theo từ khóa, địa điểm, dự án…",
  className,
  redirectTo,
  extraParams,
  shape = "rounded",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem("recent_searches") || "[]");
      if (Array.isArray(r)) setRecent(r.slice(0, 8));
    } catch {}
  }, []);

  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    let cancel = false;
    async function fetchSuggestions() {
      if (!debouncedQ) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(q)}`,
          { cache: "no-store" }
        );

        if (!cancel) {
          const data = await res.json();
          setItems(data?.suggestions || []);
        }
      } catch {
        if (!cancel) setItems([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    fetchSuggestions();
    return () => {
      cancel = true;
    };
  }, [debouncedQ]);

  const doSearch = (keyword: string) => {
    try {
      const next = [keyword, ...recent.filter((s) => s !== keyword)].slice(
        0,
        8
      );
      setRecent(next);
      localStorage.setItem("recent_searches", JSON.stringify(next));
    } catch {}

    // Nếu có redirectTo: bắt đầu từ query rỗng; nếu không, giữ nguyên query hiện tại
    const params = new URLSearchParams(
      redirectTo ? "" : Array.from(searchParams.entries())
    );
    if (keyword) params.set("q", keyword);
    else params.delete("q");
    params.delete("page"); // reset phân trang

    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => {
        params.set(k, String(v));
      });
    }

    const targetPath = redirectTo || pathname;
    const url = `${targetPath}?${params.toString()}`;
    router.push(url);
    setOpen(false);
  };

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    doSearch(q.trim());
  };

  const visibleList = useMemo(
    () => (q && items.length ? items : []),
    [q, items]
  );

  const wrapCls =
    shape === "pill"
      ? "bg-white rounded-full flex items-center overflow-hidden"
      : "bg-white rounded-xl flex items-center overflow-hidden";

  return (
    <div className={`relative ${className || ""} text-black text-left`}>
      <form onSubmit={onSubmit} className={`${wrapCls} shadow px-3 py-2`}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          // ✅ màu chữ + placeholder + caret
          className="flex-1 outline-none text-sm md:text-base px-1 py-1.5 text-black placeholder-gray-500 caret-black"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg md:rounded-xl hover:bg-red-700"
        >
          Tìm
        </button>
      </form>

      {open && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border overflow-hidden"
        >
          {loading && (
            <div className="p-3 text-sm text-gray-500">Đang tìm gợi ý…</div>
          )}

          {!loading && visibleList.length > 0 && (
            <ul className="max-h-72 overflow-auto">
              {visibleList.map((s) => {
                const line2 = [s.address, s.district, s.city]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <li
                    key={s.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => doSearch(s.title)}
                  >
                    <div className="text-sm font-medium line-clamp-1">
                      {s.title}
                    </div>
                    {line2 && (
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {line2}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {!loading && q && visibleList.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              Không có gợi ý phù hợp
            </div>
          )}

          {!q && recent.length > 0 && (
            <div className="p-2">
              <div className="px-1 pb-1 text-xs text-gray-500">
                Tìm kiếm gần đây
              </div>
              <div className="flex flex-wrap gap-2 px-1 pb-2">
                {recent.map((r) => (
                  <button
                    type="button"
                    key={r}
                    className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
                    onClick={() => doSearch(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onMouseDown={() => setOpen(false)}
        />
      )}
    </div>
  );
}
