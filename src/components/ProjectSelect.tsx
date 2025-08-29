"use client";
import { useEffect, useState } from "react";

type Option = { slug: string; name: string };

export default function ProjectSelect({
  value,
  onChange,
  placeholder = "Chọn dự án (tuỳ chọn)"
}: {
  value?: string;
  onChange?: (slug: string) => void;
  placeholder?: string;
}) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setOptions(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <select
      className="border rounded px-3 py-2"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value || "")}
    >
      <option value="">{loading ? "Đang tải..." : placeholder}</option>
      {options.map(p => (
        <option key={p.slug} value={p.slug}>{p.name}</option>
      ))}
    </select>
  );
}
