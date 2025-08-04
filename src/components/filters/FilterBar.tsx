'use client';

import { useState } from 'react';
import PropertyTypeDropdown from './PropertyTypeDropdown';
import PriceDropdown from './PriceDropdown';
import AreaDropdown from './AreaDropdown';
import Has3DDropdown from './Has3DDropdown';
import AdvancedFiltersModal from './AdvancedFiltersModal';

interface Props {
  initialFilters?: Record<string, string | string[] | undefined>;
}

export default function FilterBar({ initialFilters }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow">
      {/* Các dropdown filter */}
      <PropertyTypeDropdown />
      <PriceDropdown />
      <AreaDropdown />
      <Has3DDropdown />

      {/* Nút mở modal "Thêm" */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gray-100 text-gray-800 rounded border border-gray-300 hover:bg-gray-200 transition-all"
      >
        + Thêm
      </button>

      {/* Modal nâng cao */}
      {showModal && <AdvancedFiltersModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
