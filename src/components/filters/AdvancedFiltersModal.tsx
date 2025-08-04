// 📁 src/components/filters/AdvancedFiltersModal.tsx
'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc'];
const statuses = ['Đăng thường', 'Rever độc quyền', 'Đang GD'];

export default function AdvancedFiltersModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [bedrooms, setBedrooms] = useState<string[]>([]);
  const [bathrooms, setBathrooms] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [direction, setDirection] = useState<string[]>([]);

  const toggle = (list: string[], value: string, setList: (val: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (bedrooms.length) params.set('bedrooms', bedrooms.join(','));
    if (bathrooms.length) params.set('bathrooms', bathrooms.join(','));
    if (status.length) params.set('status', status.join(','));
    if (direction.length) params.set('direction', direction.join(','));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl max-h-[90%] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Chọn số phòng ngủ</h4>
            {[1, 2, 3, 4, 5, '6+'].map((n) => (
              <label key={n} className="block">
                <input type="checkbox" onChange={() => toggle(bedrooms, `${n}`, setBedrooms)} /> {n} phòng ngủ
              </label>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chọn số phòng tắm</h4>
            {[1, 2, 3, 4, 5, '6+'].map((n) => (
              <label key={n} className="block">
                <input type="checkbox" onChange={() => toggle(bathrooms, `${n}`, setBathrooms)} /> {n} phòng tắm
              </label>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chọn trạng thái</h4>
            {statuses.map((s) => (
              <label key={s} className="block">
                <input type="checkbox" onChange={() => toggle(status, s, setStatus)} /> {s}
              </label>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chọn hướng</h4>
            {directions.map((d) => (
              <label key={d} className="block">
                <input type="checkbox" onChange={() => toggle(direction, d, setDirection)} /> {d}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={applyFilters} className="px-4 py-2 bg-red-500 text-white rounded">Áp dụng</button>
          <button onClick={() => router.push(pathname)} className="px-4 py-2 border rounded">Huỷ</button>
        </div>
      </div>
    </div>
  );
}
