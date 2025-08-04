'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const types = [
  { label: 'Căn hộ', value: 'can-ho' },
  { label: 'Nhà riêng', value: 'nha-rieng' },
  { label: 'Đất nền', value: 'dat-nen' },
];

export default function PropertyTypeDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('type') || '';

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => handleSelect(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">Loại hình</option>
      {types.map((t) => (
        <option key={t.value} value={t.value}>{t.label}</option>
      ))}
    </select>
  );
}
