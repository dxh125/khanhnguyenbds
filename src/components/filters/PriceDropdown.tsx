'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const priceRanges = [
  { label: 'Dưới 2 tỷ', value: '0-2000000000' },
  { label: '2 - 4 tỷ', value: '2000000000-4000000000' },
  { label: '4 - 6 tỷ', value: '4000000000-6000000000' },
  { label: '6 - 10 tỷ', value: '6000000000-10000000000' },
  { label: 'Trên 10 tỷ', value: '10000000000-99999999999' },
];

export default function PriceDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('price') || '';

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('price', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => handleSelect(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">Khoảng giá</option>
      {priceRanges.map((p) => (
        <option key={p.value} value={p.value}>{p.label}</option>
      ))}
    </select>
  );
}