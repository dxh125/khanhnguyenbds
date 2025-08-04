'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const areaRanges = [
  { label: 'Dưới 30 m²', value: '0-30' },
  { label: '30 - 50 m²', value: '30-50' },
  { label: '50 - 70 m²', value: '50-70' },
  { label: '70 - 100 m²', value: '70-100' },
  { label: 'Trên 100 m²', value: '100-9999' },
];

export default function AreaDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('area') || '';

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('area', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => handleSelect(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">Diện tích</option>
      {areaRanges.map((a) => (
        <option key={a.value} value={a.value}>{a.label}</option>
      ))}
    </select>
  );
}