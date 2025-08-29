"use client";

import React, { useState } from "react";

type Uploaded = { url: string; publicId: string };

export default function ImageUploader({
  onChange,
  max = 12,
}: {
  onChange?: (urls: string[]) => void;
  max?: number;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<Uploaded[]>([]);
  const [loading, setLoading] = useState(false);
  const canAdd = uploaded.length < max;

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    // lọc kiểu ảnh cơ bản
    const imagesOnly = selected.filter((f) => f.type.startsWith("image/"));
    const remain = Math.max(0, max - uploaded.length);
    setFiles(imagesOnly.slice(0, remain));
  };

  const uploadAll = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Không lấy được chữ ký");
      const { timestamp, signature, cloudName, apiKey, folder } =
        await signRes.json();

      const results: Uploaded[] = [];

      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("api_key", apiKey);
        fd.append("timestamp", String(timestamp));
        fd.append("signature", signature);
        fd.append("folder", folder);
        // gợi ý nén nhẹ (Cloudinary sẽ tự tối ưu nếu bật q_auto,f_auto ở URL khi hiển thị)

        const up = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: fd }
        );

        const json = await up.json();
        if (json.secure_url && json.public_id) {
          results.push({ url: json.secure_url, publicId: json.public_id });
        } else {
          console.warn("Upload fail:", json?.error || json);
        }
      }

      const next = [...uploaded, ...results];
      setUploaded(next);
      setFiles([]);
      onChange?.(next.map((i) => i.url));
    } finally {
      setLoading(false);
    }
  };

  const removeAt = (idx: number) => {
    const next = uploaded.filter((_, i) => i !== idx);
    setUploaded(next);
    onChange?.(next.map((i) => i.url));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelect}
          disabled={!canAdd}
        />
        <button
          type="button"
          onClick={uploadAll}
          disabled={!files.length || loading}
          className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Đang upload..." : "Upload ảnh đã chọn"}
        </button>
        <span className="text-sm text-gray-500">
          {uploaded.length}/{max} ảnh
        </span>
      </div>

      {Boolean(files.length) && (
        <p className="text-xs text-gray-500">
          {files.length} file sẵn sàng để upload
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {uploaded.map((u, i) => (
          <div key={u.publicId} className="relative">
            <img
              src={u.url}
              alt={`img-${i}`}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs px-2 py-1 rounded"
            >
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
