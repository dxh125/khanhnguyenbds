'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Has3DDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('has3D') || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.checked) {
      params.set('has3D', 'true');
    } else {
      params.delete('has3D');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={current === 'true'}
        onChange={handleChange}
        className="form-checkbox"
      />
      Có 3D
    </label>
  );
}
